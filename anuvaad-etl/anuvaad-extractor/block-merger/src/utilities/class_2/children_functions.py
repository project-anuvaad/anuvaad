# import os
# import pandas as pd
# import base64
import config
import time
import cv2
import pandas as pd
from src.services import get_xml
from anuvaad_auditor.loghandler import log_info
# from anuvaad_auditor.loghandler import log_error
from anuvaad_auditor.loghandler import log_debug
# from src.errors.errors_exception import ServiceError
from anuvaad_auditor.loghandler import log_exception
from src.services.preprocess import prepocess_pdf_regions
from src.services.get_tables import get_text_table_line_df, get_text_from_table_cells
from src.services.get_underline import get_underline
from src.services.ocr_text_utilities import tesseract_ocr
from src.services.child_text_unify_to_parent import ChildTextUnify
from src.services.get_response import process_image_df, process_table_df, df_to_json, process_line_df, adopt_child
from src.utilities.xml_utils import check_text
import src.utilities.app_context as app_context
from src.utilities.class_2.break_block_condition_single_column import process_page_blocks as process_block_single_column


def doc_pre_processing(filename, base_dir, lang):
    '''
        Preprocessing on input pdf to get:
            - xml files
            - images
            - background images
            - classify digital and scanned documents

    '''

    log_info("document preprocessing started ===>", app_context.application_context)
    flags = {}
    #pdf_data={}

    img_dfs, xml_dfs, page_width, page_height, working_dir, pdf_bg_img_filepaths, pdf_image_paths = get_xml.process_input_pdf(
        filename, base_dir, lang)

    img_filepath = pdf_image_paths[0]
    image        = cv2.imread(img_filepath)
    pdf_image_height  = image.shape[0]
    pdf_image_width = image.shape[1]

    text_blocks_count = check_text(xml_dfs)
    if text_blocks_count == 0:
        log_info("DocumentStructure : looks like the file is either empty or scanned", app_context.application_context)
        flags['doc_class'] = 'class_2'
    else:
        flags['doc_class'] = 'class_1'

    pdf_data = {'in_dfs':xml_dfs,'img_dfs':img_dfs , 'page_width':page_width,'page_height':page_height,
                'pdf_bg_img_filepaths':pdf_bg_img_filepaths ,'pdf_image_paths':pdf_image_paths,
                'pdf_image_height':pdf_image_height,'pdf_image_width':pdf_image_width}

    return pdf_data, flags



def vertical_merging(pdf_data,flags):
    v_dfs = []

    #to_do : add support for multicolumn documents
    if  flags['page_layout'] == 'single_column' :
        columns = ['xml_index', 'text_top', 'text_left', 'text_width', 'text_height',
                         'text', 'font_size', 'font_family', 'font_color', 'attrib']
        for h_df in pdf_data['h_dfs'] :
            v_df = pd.DataFrame(columns=columns)
            v_df['text_height'] = [pdf_data['pdf_image_height']]
            v_df['text_width'] = pdf_data['pdf_image_width']
            v_df['text_top'] = 0
            v_df['text_left'] = 0
            v_df['children'] = h_df.to_json()
            v_dfs.append(v_df)

    return v_dfs

def breaK_into_paragraphs(pdf_data,flags):
    p_dfs =[]
    if flags['page_layout'] == 'single_column':
        for page_index ,v_df in enumerate(pdf_data['v_dfs']) :
            p_df = pd.concat(process_block_single_column(v_df, pdf_data['pdf_image_width'],page_num= page_index +1, configs=config.BLOCK_BREAK_CONFIG))
            p_dfs.append(p_df)
    return p_dfs


def doc_structure_response(pdf_data,flags):
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
    bg_dfs          = pdf_data['bg_dfs']
    text_block_dfs  = pdf_data['p_dfs']
    table_dfs       = pdf_data['table_dfs']
    line_dfs        = pdf_data['line_dfs']
    if flags['doc_class'] == 'class_1':
        page_width      = pdf_data['page_width']
        page_height     = pdf_data['page_height']
    else :
        page_width = pdf_data['pdf_image_width']
        page_height = pdf_data['pdf_image_height']

    log_info("document structure response started  ===>", app_context.application_context)
    start_time = time.time()
    response = {'result': []}
    pages = len(text_block_dfs)

    for page_index in range(pages):
        img_df = bg_dfs[page_index]
        text_df = text_block_dfs[page_index]
        text_df = get_xml.drop_update_col(text_df)
        table_df = table_dfs[page_index]
        line_df = line_dfs[page_index]
        # text_df    = adopt_child(text_df)

        page_json = response_per_page(text_df, img_df, table_df, line_df, page_index, page_width, page_height)
        response['result'].append(page_json)
    end_time = time.time() - start_time
    log_info("document structure response successfully completed {}".format(end_time), app_context.application_context)

    return response


def response_per_page(p_df, img_df, table_df, line_df, page_no, page_width, page_height):
    # p_df['block_id']     = range(len(p_df))
    img_df['image_id'] = range(len(img_df))
    table_df['table_id'] = range(len(table_df))
    line_df['line_id'] = range(len(line_df))

    res_dict = {'page_no': page_no + 1, 'page_width': page_width, 'page_height': page_height, 'lines': [], 'tables': [],
                'images': [], 'text_blocks': []}
    image_data = process_image_df(img_df)
    table_data = process_table_df(table_df)
    line_data = process_line_df(line_df)

    text_data = df_to_json(p_df, block_key='')
    text_data = adopt_child(text_data)
    res_dict['images'] = image_data
    res_dict['tables'] = table_data
    res_dict['lines'] = line_data
    res_dict['text_blocks'] = text_data

    return res_dict

#
# def DocumentStructure(app_context, file_name, lang='en', base_dir=config.BASE_DIR):
#     log_debug('Block merger starting processing {}'.format(app_context.application_context),
#               app_context.application_context)
#     img_dfs, xml_dfs, page_width, page_height, pdf_bg_img_filepaths, pdf_image_paths = doc_pre_processing(file_name,
#                                                                                                           base_dir,
#                                                                                                           lang)
#
#     if xml_dfs == None:
#         return {
#             'code': 400,
#             'message': 'Document pre-processing failed, check your installation',
#             'rsp': None
#         }
#
#     text_blocks_count = check_text(xml_dfs)
#     if text_blocks_count == 0:
#         log_info(
#             "DocumentStructure : looks like the file is either empty or scanned type, currently we support Class-1 document.",
#             app_context.application_context)
#         return {
#             'code': 400,
#             'message': 'looks like the file is of scanned type, currently we support Class-1 document.',
#             'rsp': None
#         }
#
#     try:
#         text_block_dfs, table_dfs, line_dfs, bg_dfs = doc_structure_analysis(xml_dfs, img_dfs, lang, page_width,
#                                                                              page_height, pdf_bg_img_filepaths,
#                                                                              pdf_image_paths)
#         response = doc_structure_response(bg_dfs, text_block_dfs, table_dfs, line_dfs, page_width, page_height)
#         log_info("DocumentStructure : successfully received blocks in json response", app_context.application_context)
#         return {
#             'code': 200,
#             'message': 'request completed',
#             'rsp': response
#         }
#
#     except Exception as e:
#         log_exception("Error occured during pdf to blocks conversion", app_context.application_context, e)
#         return {
#             'code': 400,
#             'message': 'Error occured during pdf to blocks conversion',
#             'rsp': None
#         }