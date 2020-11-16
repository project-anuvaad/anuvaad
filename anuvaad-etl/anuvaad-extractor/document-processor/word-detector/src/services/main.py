from src.services.extract_images import extract_images
from src.utilities.craft_pytorch.detect import detect_text
import src.utilities.app_context as app_context
from src.utilities.request_parse import get_languages
import config
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
from compose import compose



def get_text(app_context,base_dir) :
    images   = extract_images(app_context,base_dir)
    languages = get_languages(app_context)
    words,lines = detect_text(images,languages)
    return  [words,lines,images]

def get_response(input):
    return input


def TextDetection(app_context,base_dir=config.BASE_DIR):
    log_debug('Block merger starting processing {}'.format(app_context.application_context), app_context.application_context)
    try:
        word_detector_compose = compose(get_response,get_text)
        response              = word_detector_compose(app_context,base_dir)
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
