from src.utilities.class_2  import children_functions
import src.utilities.app_context as app_context
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
from anuvaad_auditor.loghandler import log_error
import src.utilities.app_context as app_context
from src.services.preprocess import prepocess_pdf_regions
from src.utilities.craft_pytorch.detect import detect_text
from src.services import get_xml
from src.services.ocr_text_utilities import tesseract_ocr
from src.services.get_underline import get_underline
from src.services.child_text_unify_to_parent import ChildTextUnify
from src.services.get_tables import get_text_table_line_df, get_text_from_table_cells
from src.utilities.class_2.break_block_condition_single_column import process_page_blocks as process_block_single_column
from compose import compose
import config

def extract_images_and_text_regions(filename, base_dir,lang,page_layout):
    pdf_data , flags = children_functions.doc_pre_processing(filename,base_dir,lang)
    flags['doc_class'] ='class_2'
    if flags['doc_class'] == 'class_1':
        pass
    else :
        pdf_data['in_dfs'] = detect_text(image_paths=pdf_data['pdf_image_paths'])

    pdf_data['in_dfs'], table_dfs, line_dfs, bg_dfs                     = get_text_table_line_df(pdf_data,flags)
    pdf_data['table_dfs'], pdf_data['line_dfs'], pdf_data['bg_dfs']     = table_dfs, line_dfs,bg_dfs
    pdf_data['lang']        = lang
    #to_do : add page_layout detection module
    flags['page_layout']    = page_layout
    #del pdf_data['img_dfs']
    return [pdf_data ,flags]


def merge_horizontally(input) :
    pdf_data, flags = input
    if flags['doc_class'] == 'class_1':
        pdf_data['header_region'], pdf_data['footer_region'] = prepocess_pdf_regions(pdf_data['in_dfs'], pdf_data['page_height'])
    else :
        pdf_data['header_region'], pdf_data['footer_region'] = prepocess_pdf_regions(pdf_data['in_dfs'], pdf_data['pdf_image_height'])

    if flags['page_layout'] =='single_cloumn' :
        pdf_data['h_dfs'] = get_xml.get_hdfs(pdf_data['in_dfs'],  pdf_data['header_region'], pdf_data['footer_region'])
    else :
        pdf_data['h_dfs']  = children_functions.get_layout_proposals(pdf_data,flags)

    if (pdf_data['lang'] != 'en') or (flags['doc_class'] != 'class_1'):
        h_dfs = tesseract_ocr(pdf_data,flags)
        pdf_data['h_dfs'] = h_dfs
    #del pdf_data['in_dfs']
    return [pdf_data,flags]


def merge_vertically(input):
    pdf_data, flags = input
    if flags['doc_class'] == 'class_1' :
        v_dfs = get_xml.get_vdfs(pdf_data['h_dfs'])
    else :
        v_dfs = children_functions.vertical_merging(pdf_data,flags)
    pdf_data['v_dfs'] = v_dfs
    #del pdf_data['h_dfs']
    return [pdf_data ,flags]

def break_blocks(input):
    pdf_data, flags = input
    text_merger = ChildTextUnify()
    if flags['doc_class'] == 'class_1' :
        p_dfs = get_xml.get_pdfs(pdf_data['v_dfs'], pdf_data['lang'])
    else :
        p_dfs = children_functions.breaK_into_paragraphs(pdf_data,flags)
    p_dfs = get_text_from_table_cells(pdf_data['table_dfs'], p_dfs)
    p_dfs, line_dfs = get_underline(p_dfs, pdf_data['line_dfs'], app_context.application_context)
    #p_dfs = text_merger.unify_child_text_blocks(p_dfs)
    pdf_data['p_dfs'] = p_dfs
    #del pdf_data['v_dfs']
    log_info("document structure analysis successfully completed", app_context.application_context)
    return [pdf_data,flags]


def generate_response(input):
    pdf_data, flags = input
    response = children_functions.doc_structure_response(pdf_data,flags)
    return  response




def DocumentStructure(app_context, file_name, lang='en',base_dir=config.BASE_DIR,page_layout='single_cloumn'):
    log_debug('Block merger starting processing {}'.format(app_context.application_context), app_context.application_context)
    try:
        doc_structure_compose = compose(generate_response,break_blocks,merge_vertically,merge_horizontally,extract_images_and_text_regions)
        response              = doc_structure_compose(file_name, base_dir,lang,page_layout)
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