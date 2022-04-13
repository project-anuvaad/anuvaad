#import os
#import pandas as pd
#import base64
import config
import time
from src.services import get_xml
from anuvaad_auditor.loghandler import log_info
#from anuvaad_auditor.loghandler import log_error
from anuvaad_auditor.loghandler import  log_debug
#from src.errors.errors_exception import ServiceError
from anuvaad_auditor.loghandler import log_exception
from src.services.preprocess import prepocess_pdf_regions
from src.services.get_tables import  get_text_table_line_df , get_text_from_table_cells
from src.services.get_underline import get_underline
from src.services.ocr_text_utilities import  tesseract_ocr
from src.services.child_text_unify_to_parent import ChildTextUnify
from src.services.get_response import process_image_df,  process_table_df, df_to_json, process_line_df, adopt_child
from src.utilities.xml_utils import check_text
import src.utilities.app_context as app_context
from src.utilities.craft_pytorch.detect import extract_word_bbox

def doc_pre_processing(filename, base_dir,lang):

    '''
        Preprocessing on input pdf to get:
            - xml files
            - images 
            - background images 
            - header and footer regions

    '''
    log_info("document preprocessing started ===>", app_context.application_context)

    img_dfs,xml_dfs, page_width, page_height,working_dir, pdf_bg_img_filepaths, pdf_image_paths  = get_xml.process_input_pdf(filename, base_dir, lang)
    return img_dfs,xml_dfs, working_dir, page_width, page_height, pdf_bg_img_filepaths,pdf_image_paths

def doc_structure_analysis(xml_dfs,img_dfs,working_dir ,lang, page_width, page_height, pdf_bg_img_filepaths,pdf_image_paths):
    
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

    header_region, footer_region = prepocess_pdf_regions(xml_dfs, page_height)
    text_merger = ChildTextUnify()
    
    in_dfs, table_dfs, line_dfs,bg_dfs = get_text_table_line_df(xml_dfs, img_dfs, pdf_bg_img_filepaths)
    h_dfs = get_xml.get_hdfs(in_dfs, header_region, footer_region)

    if lang != 'en':
        h_dfs = tesseract_ocr(pdf_image_paths, page_width, page_height, h_dfs, lang)
        for index, h_df in enumerate(h_dfs):
            h_dfs[index]['children'] = None
            #h_dfs[index]['font_size'] = h_dfs[index]['text_height']

    v_dfs                              = get_xml.get_vdfs(h_dfs)
    p_dfs                              = get_xml.get_pdfs(v_dfs,lang)

    p_dfs                              = get_text_from_table_cells(table_dfs,p_dfs)
    p_dfs, line_dfs = get_underline(p_dfs, line_dfs, app_context.application_context)

    if lang=='en':
        p_dfs  = text_merger.unify_child_text_blocks(p_dfs)
    
    
    log_info( "document structure analysis successfully completed", app_context.application_context )
    return p_dfs, table_dfs, line_dfs , bg_dfs


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
    start_time = time.time()
    response = { 'result' : [] }
    pages    = len(text_block_dfs)
    
    for page_index in range(pages):
        img_df     = bg_dfs[page_index]
        text_df    = text_block_dfs[page_index]
        text_df    = get_xml.drop_update_col(text_df)
        table_df   = table_dfs[page_index]
        line_df    = line_dfs[page_index]
        #text_df    = adopt_child(text_df)

        page_json  = response_per_page(text_df, img_df, table_df,line_df, page_index, page_width, page_height)
        response['result'].append(page_json)
    end_time = time.time() -start_time
    log_info( "document structure response successfully completed {}".format(end_time), app_context.application_context)

    return response

def response_per_page(p_df, img_df, table_df,line_df,page_no,page_width,page_height):
    
    

    #p_df['block_id']     = range(len(p_df))
    img_df['image_id']   = range(len(img_df))
    table_df['table_id'] = range(len(table_df))
    line_df['line_id']   = range(len(line_df))

    res_dict           = {'page_no': page_no + 1,'page_width': page_width,'page_height':page_height,'lines':[],'tables':[],'images':[],'text_blocks':[]}
    image_data         = process_image_df(img_df)
    table_data         = process_table_df(table_df)
    line_data          = process_line_df(line_df)

    text_data          = df_to_json(p_df,block_key='')
    text_data          = adopt_child(text_data)
    res_dict['images'] = image_data
    res_dict['tables'] = table_data
    res_dict['lines']  = line_data
    res_dict['text_blocks'] = text_data

    return res_dict


def DocumentStructure(app_context, file_name, lang='en',base_dir=config.BASE_DIR):
    log_debug('Block merger starting processing {}'.format(app_context.application_context), app_context.application_context)
    img_dfs, xml_dfs, working_dir, page_width, page_height, pdf_bg_img_filepaths,pdf_image_paths  = doc_pre_processing(file_name,base_dir,lang)
    
    if xml_dfs == None:
        return {
            'code': 400,
            'message': 'Document pre-processing failed, check your installation',
            'rsp': None
        }
    df = extract_word_bbox(pdf_image_paths[0])
    print(df)

    text_blocks_count = check_text(xml_dfs)
    if text_blocks_count == 0:
        log_info("DocumentStructure : looks like the file is either empty or scanned type, currently we support Class-1 document.", app_context.application_context)
        return {
            'code': 400,
            'message': 'looks like the file is of scanned type, currently we support Class-1 document.',
            'rsp': None
            }

    try:
        text_block_dfs, table_dfs, line_dfs ,bg_dfs = doc_structure_analysis(xml_dfs,img_dfs,working_dir, lang, page_width, page_height, pdf_bg_img_filepaths,pdf_image_paths)
        response   =  doc_structure_response(bg_dfs, text_block_dfs, table_dfs,line_dfs,page_width, page_height)
        log_info("DocumentStructure : successfully received blocks in json response",  app_context.application_context)
        return {
                'code': 200,
                'message': 'request completed',
                'rsp': response
                }

    except Exception as e:
        log_exception("Error occured during pdf to blocks conversion",  app_context.application_context, e)
        return {
            'code': 400,
            'message': 'Error occured during pdf to blocks conversion',
            'rsp': None
            }