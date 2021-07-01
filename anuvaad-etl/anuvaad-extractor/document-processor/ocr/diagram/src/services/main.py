from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
import src.utilities.app_context as app_context
from src.utilities.utils import load_json
from src.services.helper import get_text_from_image, get_inpainted_imgage, convert_to_resp
import config
import os

def diagram_ocr(bm_json):
    if bm_json is not None:
        lang = bm_json['file_locale']
        for page_index, page in enumerate(bm_json['result']):
            images = page['images']
            if len(images) > 1 :
                for image_index in range(1,len(images)):
                   
                    image_text,image_path    = get_text_from_image(images[image_index],lang)
                    healed_image             = get_inpainted_imgage(image_path ,image_text)                    
                    image_block, text_blocks = convert_to_resp(healed_image,image_text,images[image_index])
                    
                    bm_json['result'][page_index]['images'].append(image_block)
                    bm_json['result'][page_index]['text_blocks'].extend(text_blocks)
                    
    return bm_json

def DiagramOcr(app_context, file_name,base_dir=config.BASE_DIR):
    log_debug('Diagram Ocr starting processing {}'.format(app_context.application_context), app_context.application_context)
    try:

        bm_json  = load_json(os.path.join(base_dir,file_name))
        response = diagram_ocr(bm_json)

        if response != None :
            return {
                    'code': 200,
                    'message': 'request completed',
                    'rsp': response
                    }
        else :
            return {
                'code': 400,
                'message': 'Error occured during image ocr',
                'rsp': None
            }


    except Exception as e:
        log_exception("Error occured during image ocr",  app_context.application_context, e)
        return {
            'code': 400,
            'message': 'Error occured during image ocr',
            'rsp': None
            }
