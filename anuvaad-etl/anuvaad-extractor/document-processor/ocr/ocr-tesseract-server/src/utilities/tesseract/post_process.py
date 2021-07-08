import config
from src.utilities.tesseract.utils import get_tess_text

def post_process_ocr_text(image_crop,words,mode_height):
    
    if config.POST_PROCESSING_MODE == None :
        return words

    if config.POST_PROCESSING_MODE == 'FixInts':
        return process_ints(words)

    if config.POST_PROCESSING_MODE == 'DoubleOcr':
        return double_ocr(image_crop,ocr_text,ocr_conf,mode_height)

def double_ocr(image_crop,ocr_text,ocr_conf,mode_height):
    d_ocr = False
    if 'conf' in ocr_conf.keys():
        for conf in ocr_conf['conf']:
            if conf < config.DOUBLE_OCR_THRESHLOD:
                d_ocr = True
                break
    if d_ocr :
        return  get_tess_text(image_crop,config.DOUBLE_OCR_LANG,mode_height)

    return ocr_text,ocr_conf

def process_ints(words):
    try:
        if len(words)<2 and type(words[0]['text']) in [int, float]:
            if int(words[0]['text'])== words[0]['text'] :
                words[0]['text'] = int(words[0]['text'])
                return words
            else:
                return words
        else :
            return words
    except Exception as e:
        return words