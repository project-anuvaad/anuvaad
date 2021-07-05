from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
import src.utilities.app_context as app_context
import config,copy,time
from src.utilities.request_parse import get_files, File,get_json
from src.utilities.pdf_to_image import doc_pre_processing
from src.services.ocr import text_extraction

def process_input(app_context,base_dir):
    try:
        start_time = time.time()
        files       = get_files(app_context.application_context)
        output_files= []
        langs       = []
        for index,file in enumerate(files):
            file_output    = {"status":{}}
            file   = get_json(base_dir, file['file']['name'])[0]
            
            file_properties = File(file)
            if "page_info" in file.keys():
                page_paths = file_properties.get_pages()
            else:
                page_paths = doc_pre_processing(file['file']['name'],config.BASE_DIR)
            
            page_res = text_extraction(file_properties,page_paths,file)
            output_files.append(page_res)
            langs.append(file_properties.get_language())

        app_context.application_context["outputs"] = output_files
        end_time=start_time+ time.time()
        log_info("successfully completed tesseract ocr in {}".format(end_time), None)

    except Exception as e:
        log_exception("Error occured during tesseract ocr",  app_context.application_context, e)
        return None, None

    return app_context.application_context, langs

def TesseractOCR(app_context,base_dir = config.BASE_DIR):
    
    log_debug('tesseract ocr process starting {}'.format(app_context.application_context), app_context.application_context)
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
                'message': 'Error occured during tesseract ocr',
                'rsp': None
                }
    except Exception as e:
        log_exception("Error occured during tesseract ocr  ",  app_context.application_context, e)
        return {
            'code': 400,
            'message': 'Error occured during tesseract ocr ',
            'rsp': None
            }
