from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
import src.utilities.app_context as app_context
import config, time
from src.utilities.request_parse import get_files, File, get_ocr_config,get_json
from src.services.ocr import text_extraction,merge_text,frequent_height
from src.services.dynamic_adjustment import coord_adjustment


def preprocess_file(file_properties,lang,ocr_level):
    file = file_properties.get_file()
    page_paths = file_properties.get_pages()
    width, height = file_properties.get_pageinfo(0)

    for page_index, page_path in enumerate(page_paths):
        page_regions = file_properties.get_regions(page_index)
        page_path =  '/'.join(page_path.split('/')[-4:])
        mode_height = frequent_height(file_properties.get_lines(page_index))


        if config.OCR_LEVEL[ocr_level] == 'words':
            for idx, region in enumerate(page_regions):
                region_lines = file_properties.get_region_lines(page_index,idx)
                for line_index, line in enumerate(region_lines):
                    region_words_org = file_properties.get_region_words(page_index,idx,line_index)
                    if config.IS_DYNAMIC:
                        region_words = coord_adjustment(page_path, region_words_org)
                        region_ocr = text_extraction(lang, page_path, region_words,region_words_org, width, height,mode_height)
                    else:
                        region_ocr = text_extraction(lang, page_path, region_words_org,region_words_org, width, height,mode_height)

                    file['pages'][page_index]['regions'][idx]['children'][line_index]['children'] = region_ocr
                file['pages'][page_index]['regions'][idx]['children'] = merge_text(file['pages'][page_index]['regions'][idx]['children'],merge_tess_confidence=True)
            file['pages'][page_index]['regions'] = merge_text(file['pages'][page_index]['regions'])


        if config.OCR_LEVEL[ocr_level] == 'lines':
                for idx, region in enumerate(page_regions):
                    region_lines_org = file_properties.get_region_lines(page_index,idx)
                    if config.IS_DYNAMIC:
                        region_lines_org = coord_adjustment(page_path, region_lines_org)
                        region_ocr = text_extraction(lang, page_path, region_lines_org,region_lines_org, width, height,mode_height)
                    else:
                        region_ocr = text_extraction(lang, page_path, region_lines_org,region_lines_org, width, height,mode_height)

                    file['pages'][page_index]['regions'][idx]['children'] = region_ocr
                file['pages'][page_index]['regions']  = merge_text(file['pages'][page_index]['regions'])
    return file






def process_info(app_context,base_dir):
    try:
        files       = get_files(app_context.application_context)        
        file_images = []
        output      = []
        for index,file_new in enumerate(files):
            start_time = time.time()
            ocr_level, lang = get_ocr_config(file_new)
            file   = get_json(file_new['file']['name'],base_dir)[0]
            file_properties = File(file)
            file = preprocess_file(file_properties,lang,ocr_level)
            file['file'] = file_new['file']
            file['config'] = file_new['config']
            output.append(file)
            output[index]['status'] = {'code':200, 'message':"tesseract ocr successful"}
            end_time            = time.time()
            extraction_time     = (end_time - start_time)/len(file_properties.get_pages())
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
        response   = process_info(app_context,base_dir)
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
