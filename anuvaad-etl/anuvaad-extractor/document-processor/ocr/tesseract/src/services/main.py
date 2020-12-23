from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
import src.utilities.app_context as app_context
import config, time
from src.utilities.request_parse import get_files, File, get_ocr_config,get_json
from src.services.ocr import text_extraction
from src.services.dynamic_adjustment import coord_adjustment



def get_ocr(app_context,base_dir):
    try:
        files       = get_files(app_context.application_context)        
        file_images = []
        output      = []
        for index,file_new in enumerate(files):
            ocr_level, lang = get_ocr_config(file_new)
            file   = get_json(file_new['file']['name'],base_dir)[0]
            file_properties = File(file)
            page_paths      = file_properties.get_pages()
            start_time = time.time()
            for idx,page_path in enumerate(page_paths):
                width, height = file_properties.get_pageinfo(idx)
                page_lines  = file_properties.get_lines(idx)
                page_words  = file_properties.get_words(idx)
                if config.IS_DYNAMIC:
                    if config.DYNAMIC_LEVEL == 'lines':
                        page_lines = coord_adjustment(page_path, page_lines)
                    if config.DYNAMIC_LEVEL == 'words':
                        page_words = coord_adjustment(page_path, page_words)
                if ocr_level == "line":
                    page_ocr     = text_extraction(lang, page_path, page_lines,width, height)
                    file['pages'][idx]['lines'] = page_ocr
                if ocr_level == "word":
                    page_ocr     = text_extraction(lang, page_path, page_words,width, height)
                    file['pages'][idx]['words'] = page_ocr
                
            file['file'] = file_new['file']
            file['config'] = file_new['config']
            output.append(file)
            output[index]['status'] = {}
            output[index]['status']['message']="tesseract ocr successful"
            end_time            = time.time()
            extraction_time     = (end_time - start_time)/len(page_paths)
            log_info('tesseract ocr per page completed in {}'.format(extraction_time), app_context.application_context)
        app_context.application_context["outputs"] =output
        log_info("successfully completed tesseract ocr", None)
    except Exception as e:
        log_exception("Error occured during tesseract ocr ",  app_context.application_context, e)
        return None

    return app_context.application_context

def TesseractOCR(app_context,base_dir= config.BASE_DIR):
    
    log_debug('tesseract ocr process starting {}'.format(app_context.application_context), app_context.application_context)
    try:
        response   = get_ocr(app_context,base_dir)
        return {
                'code': 200,
                'message': 'request completed',
                'rsp': response
                }
    except Exception as e:
        log_exception("Error occured during tesseract ocr  ",  app_context.application_context, e)
        return {
            'code': 400,
            'message': 'Error occured during tesseract ocr ',
            'rsp': None
            }
