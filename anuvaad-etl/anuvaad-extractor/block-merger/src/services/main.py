import os
import pandas as pd
import base64
import config
from src.services import get_xml
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
from anuvaad_auditor.loghandler import  log_debug
from src.errors.errors_exception import ServiceError
from anuvaad_auditor.loghandler import log_exception
from src.services.preprocess import prepocess_pdf_regions
from src.services.get_tables import  get_text_table_line_df
from src.services.get_underline import get_underline
from src.services.ocr_text_utilities import  tesseract_ocr
from src.services.child_text_unify_to_parent import ChildTextUnify
from src.services.get_response import process_image_df,  process_table_df, df_to_json, process_line_df, process_bg_image
from src.utilities.xml_utils import check_text
import src.utilities.app_context as app_context

def doc_pre_processing(filename, base_dir,lang):

    '''
        Preprocessing on input pdf to get:
            - xml files
            - images 
            - background images 
            - header and footer regions

    '''
    log_info("document preprocessing started ===>",app_context.application_context )

    img_dfs,xml_dfs, page_width, page_height,working_dir, pdf_image_paths  = get_xml.process_input_pdf(filename, base_dir, lang)
    
    try:
        header_region, footer_region = prepocess_pdf_regions(xml_dfs, page_height)
    except Exception as e :
            log_error("Error in finding footer and header region", app_context.application_context, e)

    log_info("document preprocessing successfully completed", app_context.application_context)

    return img_dfs,xml_dfs, working_dir, header_region , footer_region, page_width, page_height, pdf_image_paths

def doc_structure_analysis(xml_dfs,img_dfs,working_dir,header_region , footer_region,lang, page_width, page_height, pdf_image_paths):
    
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
    log_info("document structure analysis started  ===>", app_context.application_context )
    
    text_merger = ChildTextUnify()
    
    in_dfs, table_dfs, line_dfs,bg_dfs = get_text_table_line_df(xml_dfs, img_dfs, pdf_image_paths)
    h_dfs                              = get_xml.get_hdfs(in_dfs,header_region,footer_region)
    v_dfs                              = get_xml.get_vdfs(h_dfs)
    p_dfs                              = get_xml.get_pdfs(v_dfs)
    p_dfs , line_dfs                   = get_underline(p_dfs,line_dfs,app_context.application_context)
    p_dfs                              = get_xml.update_font(p_dfs)
    
    if lang  != 'en':
        text_block_dfs  = tesseract_ocr(pdf_image_paths, page_width, page_height, p_dfs, lang)
    else:
        text_block_dfs  = text_merger.unify_child_text_blocks(p_dfs)

    log_info( "document structure analysis successfully completed", app_context.application_context )
    return text_block_dfs, table_dfs, line_dfs , bg_dfs


def doc_structure_response(bg_dfs, text_block_dfs,table_dfs,line_dfs,page_width, page_height):

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
    log_info("document structure response started  ===>", app_context.application_context)

    response = { 'result' : [] }
    pages    = len(text_block_dfs)
    for page_index in range(pages):
        img_df     = bg_dfs[page_index]
        text_df    = text_block_dfs[page_index]
        table_df   = table_dfs[page_index]
        line_df    = line_dfs[page_index]
        page_json  = response_per_page(text_df, img_df, table_df,line_df, page_index, page_width, page_height)
        response['result'].append(page_json)
    
    log_info( "document structure response successfully completed", app_context.application_context)

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


def DocumentStructure(app_context, file_name, lang='en',base_dir=config.BASE_DIR):
    log_debug('Block merger starting processing {}'.format(app_context), app_context.application_context)
    img_dfs, xml_dfs, working_dir, header_region , footer_region, page_width, page_height, pdf_image_paths  = doc_pre_processing(file_name,base_dir,lang)

    text_blocks_count = check_text(xml_dfs)
    if text_blocks_count == 0:
        raise ServiceError(400, "Text extraction failed. Either document is empty or is scanned or is not in pdf format.")

    try:
        text_block_dfs, table_dfs, line_dfs ,bg_dfs= doc_structure_analysis(xml_dfs,img_dfs,working_dir,header_region , footer_region, lang, page_width, page_height, pdf_image_paths)
        response   =  doc_structure_response(bg_dfs, text_block_dfs, table_dfs,line_dfs,page_width, page_height)
        log_info("DocumentStructure : successfully received blocks in json response",  app_context.application_context)
        return response
    except Exception as e:
        log_exception("Error occured during pdf to blocks conversion",  app_context.application_context, e)
        raise ServiceError(400, "documentstructure failed. Something went wrong during pdf to blocks conversion.")