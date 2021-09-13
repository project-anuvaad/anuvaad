from src.services.collate import RemoveOverlap, merger_lines_words
from src.services.detect_text import get_coords
from src.utilities.tilt_alignment import Orientation
from anuvaad_auditor.loghandler import log_debug
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_info
import copy
import config
from src.services.extract_images import extract_images
from src.utilities.craft_pytorch.detect import detect_text
from src.utilities.model_response import FileOutput, Page
from src.utilities.request_parse import get_files, get_languages, File
from src.utilities.primalinenet.infer import PRIMA
predict_primanet = PRIMA()

removeoverlap = RemoveOverlap()


def get_text(app_context, base_dir):

    # PDF to image
    images = extract_images(app_context, base_dir)

    # Orientation correction
    
    #languages = get_languages(app_context)
    words, lines = [], []
    files = get_files(app_context.application_context)
    file_properties = File(files[0])

    align_img = file_properties.get_tilt_align_config()
    if config.ALIGN :
        if align_img is not None and align_img == 'True' :
            for file_index,file_imgs in enumerate(images):
                for img in file_imgs:
                    #print(img)
                    image,angle = Orientation(img,File(files[file_index]),).re_orient_east()
                    #print(image,"***",angle)

    # custom line detection model

    line_layout = file_properties.get_line_layout_config()
    craft_line = file_properties.get_craft_config()

    if line_layout is not None and line_layout == 'True':
        log_info('Line detection started by prima linenet model',
                 app_context.application_context)
        lines = predict_primanet.predict_primanet(images)
        lines = [lines]
    if craft_line is not None and craft_line == 'True':
        log_info('Line detection started by craft model',
                 app_context.application_context)
        languages = get_languages(app_context)
        words, lines = detect_text(images, languages)
    return words, lines, images


def get_response(app_context, words, lines, images):

    output = []
    files = get_files(app_context.application_context)

    for file_index, file in enumerate(files):
        file_prperties = FileOutput(file)
        try:
            for page_index, page in enumerate(images[file_index]):
                if len(words) != 0:
                    page_words = words[file_index][page_index]
                else:
                    page_words = []
                if len(lines) != 0:
                    page_lines = lines[file_index][page_index]
                else:
                    page_lines = []
                page_properties = Page(page_words, page_lines, page)
                file_prperties.set_page(page_properties.get_page())
                file_prperties.set_page_info(page)
            file_prperties.set_staus(True)

        except Exception as e:
            file_prperties.set_staus(False)
            log_exception("Error occured during response generation" +
                          str(e), app_context.application_context, e)
            return None

        output.append(file_prperties.get_file())

    app_context.application_context['outputs'] = output

    return app_context.application_context


def TextDetection(app_context, base_dir=config.BASE_DIR):

    log_debug('Line detection starting processing {}'.format(
        app_context.application_context), app_context.application_context)

    try:

        words, lines, images = get_text(app_context, base_dir)

        if words != None or lines != None:
            return {
                'code': 200,
                'message': 'request completed',
                'rsp':  get_response(app_context, words, lines, images)

            }
        else:
            return {
                'code': 400,
                'message': 'Error occured during pdf to blocks conversion',
                'rsp': None
            }

    except Exception as e:
        log_exception("Error occured during Line detection conversion" +
                      str(e),  app_context.application_context, e)
        return {
            'code': 400,
            'message': 'Error occured during pdf to blocks conversion',
            'rsp': None
        }
