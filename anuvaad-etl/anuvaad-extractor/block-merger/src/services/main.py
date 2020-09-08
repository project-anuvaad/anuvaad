import os
import pandas as pd
import base64
import config
from src.services import get_xml
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
from src.errors.errors_exception import ServiceError
from anuvaad_auditor.loghandler import log_exception
from src.services.preprocess import prepocess_pdf_regions
from src.services.get_tables import  get_text_table_line_df
from src.services.get_underline import get_underline
from src.services.ocr_text_utilities import  tesseract_ocr
from src.services.child_text_unify_to_parent import ChildTextUnify
from src.services.get_response import process_image_df,  process_table_df, df_to_json, process_line_df, process_bg_image
from src.utilities.xml_utils import check_text


def doc_pre_processing(filename, base_dir,input_json,lang):

    '''
        Preprocessing on input pdf to get:
            - xml files
            - images 
            - background images 
            - header and footer regions

    '''
    log_info("document preprocessing started  ===>", input_json)

    img_dfs,xml_dfs, page_width, page_height,working_dir, pdf_image_paths  = get_xml.process_input_pdf(filename, base_dir,jobid,lang)
    multiple_pages = False
    pages          = len(xml_dfs)
    if pages > 1:
        multiple_pages =True
    try:
        header_region, footer_region = prepocess_pdf_regions(xml_dfs, page_height)
    except Exception as e :
            log_error("Error in finding footer and header region", input_json, e)

    log_info("Service main document preprocessing successfully completed", input_json)

    return img_dfs,xml_dfs, pages, working_dir, header_region , footer_region, multiple_pages, page_width, page_height, pdf_image_paths

def doc_structure_analysis(pages,xml_dfs,img_dfs,working_dir,header_region , footer_region, multiple_pages,input_json,lang, page_width, page_height, pdf_image_paths):
    
    '''
        Document structure analysis to get:
            - in_dfs
            - table_dfs
            - line_dfs
            - h_dfs
            - v_dfs
            - p_dfs
            - text_block_dfs

    '''
    log_info("document structure analysis started  ===>", input_json)
    
    text_merger = ChildTextUnify()
    
    in_dfs, table_dfs, line_dfs,bg_dfs = get_text_table_line_df(xml_dfs, img_dfs, pdf_image_paths, working_dir, jobid)
    h_dfs                              = get_xml.get_hdfs(pages, in_dfs, config.DOCUMENT_CONFIGS,header_region , footer_region, multiple_pages)
    v_dfs                              = get_xml.get_vdfs(pages, h_dfs, config.DOCUMENT_CONFIGS)
    p_dfs                              = get_xml.get_pdfs(pages, v_dfs, config.DOCUMENT_CONFIGS, config.BLOCK_CONFIGS)
    p_dfs , line_dfs                   = get_underline(p_dfs,line_dfs,input_json)
    #if lang  in ['en','hi']:
        #ocr_dfs  = tesseract_ocr(pdf_image_paths, page_width, page_height, p_dfs, lang )

    
    if lang  != 'en':
        text_block_dfs  = tesseract_ocr(pdf_image_paths, page_width, page_height, p_dfs, lang,input_json )
    else:
        text_block_dfs  = text_merger.unify_child_text_blocks(pages, p_dfs, config.DROP_TEXT,input_json)

    log_info( "document structure analysis successfully completed", input_json)
    return text_block_dfs, table_dfs, line_dfs , bg_dfs

   

    

def doc_structure_response(pages,bg_dfs, text_block_dfs,table_dfs,line_dfs,page_width, page_height,input_json):

    '''
        To build required response in json format;
            -  page level information:
                    - page_no
                    - page_width
                    - page_height
                    - images
                    - tables
                    - text_blocks
            -  convert dataframe into proper json format:
                    - img_df
                    - text_df
                    - tabel_df
    '''
    log_info("document structure response started  ===>", input_json)

    response = { 'result' : [] }
    for page_index in range(pages):
        #img_df     = img_dfs[page_index]
        img_df     = bg_dfs[page_index]
        text_df    = text_block_dfs[page_index]
        table_df   = table_dfs[page_index]
        line_df    = line_dfs[page_index]
        page_json  = response_per_page(text_df, img_df, table_df,line_df, page_index, page_width, page_height)
        response['result'].append(page_json)
    
    log_info( "document structure response successfully completed", input_json)

    return response

def response_per_page(p_df, img_df, table_df,line_df,page_no,page_width,page_height):

    p_df['block_id']     = range(len(p_df))
    img_df['image_id']   = range(len(img_df))
    table_df['table_id'] = range(len(table_df))
    line_df['line_id']   = range(len(line_df))

    res_dict           = {'page_no': page_no,'page_width': page_width,'page_height':page_height,'lines':[],'tables':[],'images':[],'text_blocks':[]}
    image_data         = process_image_df(img_df)
    table_data         = process_table_df(table_df)
    line_data          = process_line_df(line_df)
    text_data          = df_to_json(p_df)
    res_dict['images'] = image_data
    res_dict['tables'] = table_data
    res_dict['lines']  = line_data
    res_dict['text_blocks'] = text_data

    return res_dict


#<<<<<<< HEAD
#def DocumentStructure(input_json, file_name, lang='en',base_dir = config.BASE_DIR ):
#    img_dfs, xml_dfs, pages, working_dir, header_region , footer_region, multiple_pages, page_width, page_height, pdf_image_paths  = doc_pre_processing(file_name,base_dir,jobid)
#=======
#def DocumentStructure(jobid, file_name, lang='en',base_dir = config.BASE_DIR ):
#    img_dfs, xml_dfs, pages, working_dir, header_region , footer_region, multiple_pages, page_width, page_height, pdf_image_paths  = doc_pre_processing(file_name,base_dir,jobid, lang)
#>>>>>>> 7acb04d10f0f02c7ed64d25d02fb046ea343c2f5

    text_blocks_count = check_text(xml_dfs)
    if text_blocks_count == 0:
        raise ServiceError(400, "Text extraction failed. Either document is empty or is scanned or is not in pdf format.")

    try:
        text_block_dfs, table_dfs, line_dfs ,bg_dfs= doc_structure_analysis(pages,xml_dfs,img_dfs,working_dir,header_region , footer_region, multiple_pages,input_json, lang, page_width, page_height, pdf_image_paths)
        response   =  doc_structure_response(pages, bg_dfs, text_block_dfs, table_dfs,line_dfs,page_width, page_height,input_json)
        log_info("DocumentStructure : successfully received blocks in json response", input_json)
        return response
    except Exception as e:
        log_exception("Error occured during pdf to blocks conversion", input_json, e)
        raise ServiceError(400, "documentstructure failed. Something went wrong during pdf to blocks conversion.")