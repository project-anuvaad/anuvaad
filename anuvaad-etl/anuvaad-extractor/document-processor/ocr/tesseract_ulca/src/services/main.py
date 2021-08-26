from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
import src.utilities.app_context as app_context
import config
from src.utilities.request_parse import File
import copy
from src.services.ocr import TextExtraction


def process_input(app_context, base_dir):
    try:
        sentences = []
        file_properties = File(app_context.application_context)

        for im_index in range(file_properties.get_images_len()):
            
            image_sentences = TextExtraction(file_properties.get_image(
                im_index), file_properties.get_coords(im_index), file_properties.get_config()).get_sentences()
            if type(image_sentences) is not str:
                sentences.extend(image_sentences )
            else :
                sentences.append("**** Image index {} not processed because  {} ****".format(im_index,image_sentences) )

        log_info("successfully completed ocr", None)
        return sentences

    except Exception as e:
        log_exception("Error occured during google vision ocr",
                      app_context.application_context, e)
        return None


def OCR(app_context, base_dir=config.BASE_DIR):

    log_debug('google vision ocr process starting {}'.format(
        app_context.application_context), app_context.application_context)
    try:
        sentences = process_input(app_context, base_dir)
        if response != None:
            return {
                'code': 200,
                'message': 'request completed',
                'sentences': sentences,
                'config': langs

            }
        else:
            return {
                'code': 400,
                'message': 'Error occured during  ocr',
                'rsp': None
            }
    except Exception as e:
        log_exception("Error occured during  ocr  ",
                      app_context.application_context, e)
        return {
            'code': 400,
            'message': 'Error occured during ocr ',
            'rsp': None
        }
