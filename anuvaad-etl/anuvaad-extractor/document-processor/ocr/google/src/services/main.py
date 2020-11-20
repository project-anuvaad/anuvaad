from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
import src.utilities.app_context as app_context
#from src.services.get_underline import get_underline
#from src.services.get_tables import get_text_table_line_df, get_text_from_table_cells
from compose import compose
import config
from src.utilities.request_parse import get_files, File
from pdf_to_image import doc_pre_processing

def detect_text(image_paths):
    

def process_input(app_context) :
    try:
        files       = get_files(app_context.application_context)
        file_images = []
        output      = []
        for index,file in enumerate(files):
            file_properties = File(file)
            if "page_info" in file.keys():
                page_paths = file_properties.get_pages()
            else:
                page_paths = doc_pre_processing(file['name'],config.BASE_DIR)
            
            
            
            
        log_info("successfully completed layout detection", None)
    except Exception as e:
        log_exception("Error occured during prima layout detection ",  app_context.application_context, e)
        return None

    return app_context.application_context


def GoogleVisionOCR(app_context):
    
    log_debug('layout detection process starting {}'.format(app_context.application_context), app_context.application_context)
    try:
        response   = process_input(app_context)
        return {
                'code': 200,
                'message': 'request completed',
                'rsp': response
                }
    except Exception as e:
        log_exception("Error occured during layout detection ",  app_context.application_context, e)
        return {
            'code': 400,
            'message': 'Error occured during layout detection ',
            'rsp': None
            }
