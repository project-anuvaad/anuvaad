from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
import src.utilities.app_context as app_context
#from src.services.get_underline import get_underline
#from src.services.get_tables import get_text_table_line_df, get_text_from_table_cells
import config
from src.utilities.request_parse import get_files, File
from src.utilities.pdf_to_image import doc_pre_processing
from src.services.ocr import text_extraction

def process_input(app_context) :
    try:
        files       = get_files(app_context.application_context)
        output_files= []
        
        for index,file in enumerate(files):
            file_output    = {"status":{}}
            file_properties = File(file)
            if "page_info" in file.keys():
                page_paths = file_properties.get_pages()
            else:
                page_paths = doc_pre_processing(file['file']['name'],config.BASE_DIR)
            page_res = text_extraction(page_paths)
            file_output["page_info"] = page_paths
            file_output["file"]      = file
            file_output["pages"]     = page_res
            file_output['status']['message']="google-vision ocr run successfully"
            output_files.append(file_output)
        app_context.application_context["outputs"] =output_files
        log_info("successfully completed google vision ocr", None)

    except Exception as e:
        log_exception("Error occured during google vision ocr",  app_context.application_context, e)
        return None

    return app_context.application_context

def GoogleVisionOCR(app_context,base_dir = config.BASE_DIR):
    
    log_debug('google vision ocr process starting {}'.format(app_context.application_context), app_context.application_context)
    try:
        response   = process_input(app_context)
        if response!=None:
            return {
                    'code': 200,
                    'message': 'request completed',
                    'rsp': response
                    }
        else:
            return {
                'code': 400,
                'message': 'Error occured during google vision ocr',
                'rsp': None
                }
    except Exception as e:
        log_exception("Error occured during google vision ocr  ",  app_context.application_context, e)
        return {
            'code': 400,
            'message': 'Error occured during google vision ocr ',
            'rsp': None
            }
