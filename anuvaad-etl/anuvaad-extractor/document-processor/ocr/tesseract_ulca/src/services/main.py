from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
from src.utilities.request_parse import File
from src.services.ocr import TextExtraction


def process_input(app_context):
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
        return sentences,file_properties.get_config()

    except Exception as e:
        log_exception("Error occured during google vision ocr",
                      app_context.application_context, e)
        return None,None


def OCR(app_context):

    log_debug('process starting  for request {}'.format(
        app_context.application_context), app_context.application_context)
    try:
        sentences, config = process_input(app_context)
        if sentences != None:
            return {
                'code': 200,
                'message': 'ocr request completed',
                'sentences': sentences,
                'config': config

            }
        else:
            return {
                'code': 400,
                'message': 'Error occured during  ocr',
                'sentences': sentences,
                'config': config

            }
    except Exception as e:
        log_exception("Error occured during  ocr  ",
                      app_context.application_context, e)
        return {
            'code': 400,
            'message': 'Error occured during ocr ',
            'sentences': None,
            'config': None

        }
