from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
import src.utilities.app_context as app_context
import config, time
from src.utilities.request_parse import get_files, File, get_ocr_config,get_json
from src.utilities.model_response import set_bg_image
from src.services.ocr import text_extraction,merge_text,frequent_height,mask_image
from src.services.dynamic_adjustment import coord_adjustment
import copy

def preprocess_file(file_properties,lang,ocr_level):
    file = file_properties.get_file()
    page_paths = file_properties.get_pages()
    width, height = file_properties.get_pageinfo(0)
    mask_page_path = []
    for page_index, page_path in enumerate(page_paths):
        print('processing for page : '.format(([page_index])))
        page_regions = file_properties.get_regions(page_index)
        #page_path =  '/'.join(page_path.split('/')[-4:])

        save_path = mask_image(page_path, page_regions, page_index, file_properties, width, height)
        file = set_bg_image(file, save_path, page_index)

        mode_height = frequent_height(file_properties.get_lines(page_index))


        if config.OCR_LEVEL[ocr_level] == 'words':
            for idx, region in enumerate(page_regions):
                if region['class'] in config.ocr_class:
                    region_lines = file_properties.get_region_lines(page_index,idx)
                    for line_index, line in enumerate(region_lines):
                        region_words = file_properties.get_region_words(page_index,idx,line_index)
                        if config.IS_DYNAMIC and region['class'] in config.DYNAMIC_CLASS: 
                            region_words_org = coord_adjustment(page_path, copy.deepcopy(region_words))
                            region_ocr = text_extraction(lang, page_path, region_words_org,region_words, width, height,mode_height)
                        else:
                            region_ocr = text_extraction(lang, page_path, region_words,region_words, width, height,mode_height)

                        #file['pages'][page_index]['regions'][idx]['children'][line_index]['children'] = region_ocr
                        file['pages'][page_index]['regions'][idx]['regions'][line_index]['regions'] = region_ocr
                else:
                        
                    file['pages'][page_index]['regions'][idx] = copy.deepcopy(region)
                #file['pages'][page_index]['regions'][idx]['children'] = merge_text(file['pages'][page_index]['regions'][idx]['children'],merge_tess_confidence=True)
                file['pages'][page_index]['regions'][idx]['regions'] = merge_text(file['pages'][page_index]['regions'][idx]['regions'],merge_tess_confidence=True)
            #file['pages'][page_index]['regions'] = merge_text(file['pages'][page_index]['regions'])
            


        if config.OCR_LEVEL[ocr_level] == 'lines':
                for idx, region in enumerate(page_regions):
                    if region['class'] in config.ocr_class:
                        region_lines = file_properties.get_region_lines(page_index,idx)
                        if config.IS_DYNAMIC and region['class'] in config.DYNAMIC_CLASS:
                            region_lines_org = coord_adjustment(page_path, copy.deepcopy(region_lines))
                            region_ocr = text_extraction(lang, page_path, region_lines_org,region_lines, width, height,mode_height)
                        else:
                            region_ocr = text_extraction(lang, page_path, region_lines,region_lines, width, height,mode_height)
                        file['pages'][page_index]['regions'][idx]['children'] = region_ocr
                    else:
                        file['pages'][page_index]['regions'][idx] = copy.deepcopy(region)
            
                file['pages'][page_index]['regions']  = merge_text(file['pages'][page_index]['regions'])
        '''
            masking out images based on word coordinates
        '''

        log_info("successfully completed ocr for  page {}".format(page_index), app_context.application_context)
        #mask_page_path.append(save_path)
    #file['bg_image_paths']  = mask_page_path

    return file






def process_info(app_context,base_dir):
    try:
        files       = get_files(app_context.application_context)        
        file_images = []
        output      = []
        for index,file_new in enumerate(files):
            start_time = time.time()
            file   = get_json(file_new['file']['name'],base_dir)[0]
            file_properties = File(file)
            ocr_level, lang = get_ocr_config(file_new, file_properties.get_pages())
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
        if response!=None:
            return {
                    'code': 200,
                    'message': 'request completed',
                    'rsp': response
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
