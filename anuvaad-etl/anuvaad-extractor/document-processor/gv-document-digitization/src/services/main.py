from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
import src.utilities.app_context as app_context
import config,copy
from src.utilities.request_parse import get_files, File
#from src.utilities.pdf_to_image import doc_pre_processing
from src.utilities.extract_images import get_images 
from src.services.ocr import text_extraction



def process_input(app_context,base_dir) :
    try:
        files       = get_files(app_context.application_context)
        output_files= []
        langs = []

        for index,file in enumerate(files):
            file_output    = {"status":{}}
            file_properties = File(file)
            if "page_info" in file.keys():
                page_paths = file_properties.get_pages()
            else:
                #page_paths = doc_pre_processing(file['file']['name'],config.BASE_DIR)
                page_paths = get_images(file_properties.get_name(),file_properties.get_format()  ,config.BASE_DIR)

            
            file_output = text_extraction(file_properties,page_paths,file)
            output_files.append(file_output)
            langs.append(file_properties.get_language())
        app_context.application_context["outputs"] =output_files
        log_info("successfully completed google vision document digitization", None)

    except Exception as e:
        log_exception("Error occured during google vision document digitization",  app_context.application_context, e)
        return None, None

    return app_context.application_context, langs

def GoogleVisionOCR(app_context,base_dir = config.BASE_DIR):
    
    log_debug('google vision document digitization process starting {}'.format(app_context.application_context), app_context.application_context)
    try:
        response,langs   = process_input(app_context,base_dir)
        if response!=None:
            return {
                    'code': 200,
                    'message': 'request completed',
                    'rsp': response,
                    'langs':langs
                    }
        else:
            return {
                'code': 400,
                'message': 'Error occured during google vision document digitization',
                'rsp': None
                }
    except Exception as e:
        log_exception("Error occured during google vision document digitization  ",  app_context.application_context, e)
        return {
            'code': 400,
            'message': 'Error occured during google vision document digitization ',
            'rsp': None
            }
