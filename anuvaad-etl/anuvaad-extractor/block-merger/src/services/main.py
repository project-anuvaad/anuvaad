from src.utilities.class_2  import children_functions
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
import src.utilities.app_context as app_context
from src.services.preprocess import prepocess_pdf_regions
from src.utilities.craft_pytorch.detect import detect_text
from src.services.ocr_text_utilities import tesseract_ocr
from src.services.get_underline import get_underline
from src.services.child_text_unify_to_parent import ChildTextUnify
from src.services.get_tables import get_text_table_line_df, get_text_from_table_cells
from compose import compose
import config

def extract_images_and_text_regions(filename, base_dir,lang,page_layout):
    try :
        pdf_data , flags = children_functions.doc_pre_processing(filename,base_dir,lang)
        flags['doc_class'] ='class_1'

        if flags['doc_class'] == 'class_1':
            pass
        else :
            pdf_data['in_dfs'] = detect_text(pdf_data)

        pdf_data['in_dfs'], table_dfs, line_dfs, bg_dfs                     = get_text_table_line_df(pdf_data,flags)
        pdf_data['table_dfs'], pdf_data['line_dfs'], pdf_data['bg_dfs']     = table_dfs, line_dfs,bg_dfs
        pdf_data['lang']        = lang
        #to_do : add page_layout detection module
        flags['page_layout']    = "double_column"
        #del pdf_data['img_dfs']
        return [pdf_data ,flags]

    except Exception as e:
        log_exception("Error occured during text region extractions" + str(e), app_context.application_context, e)
        return [None,None]


def merge_horizontally(input) :
    try :

        pdf_data, flags = input

        pdf_data = prepocess_pdf_regions(pdf_data,flags)
        pdf_data['h_dfs']  = children_functions.get_layout_proposals(pdf_data,flags)
        # Uncomment Later
        if (pdf_data['lang'] != 'en') or (flags['doc_class'] != 'class_1'):
            pdf_data['h_dfs'] = tesseract_ocr(pdf_data,flags)

        return [pdf_data, flags]
        #del pdf_data['in_dfs']
    except Exception as e:
        log_exception("Error occured during horizontal merging ", app_context.application_context, e)
        return [None,None]



def merge_vertically(input):
    try :
        pdf_data, flags = input

        v_dfs = children_functions.vertical_merging(pdf_data,flags)
        pdf_data['v_dfs'] = v_dfs
        #del pdf_data['h_dfs']
        return [pdf_data ,flags]
    except Exception as e:
        log_exception("Error occured during vertical merging ", app_context.application_context, e)
        return [None, None]


def break_blocks(input):

    try :

        pdf_data, flags = input

        p_dfs = children_functions.breaK_into_paragraphs(pdf_data,flags)

        #p_dfs = get_text_from_table_cells(pdf_data['table_dfs'], p_dfs)
        p_dfs = get_text_from_table_cells(pdf_data,p_dfs,flags)
        #p_dfs, line_dfs = get_underline(p_dfs, pdf_data['line_dfs'], app_context.application_context)

        text_merger = ChildTextUnify()
        p_dfs = text_merger.unify_child_text_blocks(p_dfs)
        pdf_data['p_dfs'] = p_dfs
        #del pdf_data['v_dfs']
        log_info("document structure analysis successfully completed", app_context.application_context)
        return [pdf_data,flags]
    except Exception as e:
        log_exception("Error occured during breaking blocks", app_context.application_context, e)
        return [None,None]


def generate_response(input):
    try :
        pdf_data, flags = input
        response = children_functions.doc_structure_response(pdf_data,flags)
        return  response
    except Exception as e:
        log_exception("Error occured during response generation", app_context.application_context, e)
        return None


def DocumentStructure(app_context, file_name, lang='en',base_dir=config.BASE_DIR,page_layout='single_column'):
    log_debug('Block merger starting processing {}'.format(app_context.application_context), app_context.application_context)
    try:
        doc_structure_compose = compose(generate_response,break_blocks,merge_vertically,merge_horizontally,extract_images_and_text_regions)
        response              = doc_structure_compose(file_name, base_dir,lang,page_layout)
        if response != None :
            return {
                    'code': 200,
                    'message': 'request completed',
                    'rsp': response
                    }
        else :
            return {
                'code': 400,
                'message': 'Error occured during pdf to blocks conversion',
                'rsp': None
            }


    except Exception as e:
        log_exception("Error occured during pdf to blocks conversion",  app_context.application_context, e)
        return {
            'code': 400,
            'message': 'Error occured during pdf to blocks conversion',
            'rsp': None
            }
