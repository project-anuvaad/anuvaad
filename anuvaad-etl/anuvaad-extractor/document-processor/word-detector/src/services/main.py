from src.services import extract_images
from src.utilities.craft_pytorch.detect import detect_text
import src.utilities.app_context as app_context
import config
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
from compose import compose


def test(app_context):
    print("SUCCESSFULLY RUN")
    return {"code":200,"rsp":[],"message":"success"}




def get_text(app_context,base_dir) :
    images = extract_images(app_context,base_dir)
    words,lines = detect_text(images)
    return  words,lines


def get_response():
    return None




def TextDetection(app_context, file_name, lang='en',base_dir=config.BASE_DIR,page_layout='single_column'):
    log_debug('Block merger starting processing {}'.format(app_context.application_context), app_context.application_context)
    try:
        word_detector_compose = compose(get_response,get_text)(app_context,base_dir)
        response              = word_detector_compose(file_name, base_dir,lang,page_layout)
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
