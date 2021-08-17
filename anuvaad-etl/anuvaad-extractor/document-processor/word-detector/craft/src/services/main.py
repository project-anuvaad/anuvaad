from src.services.extract_images import extract_images
from src.utilities.craft_pytorch.detect import detect_text
from src.utilities.model_response import FileOutput, Page
from src.utilities.request_parse import get_files, get_languages,File
from src.utilities.primalinenet.infer import  PRIMA
predict_primanet = PRIMA()
import config
import copy
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
from src.services.detect_text import get_coords
from src.services.collate import RemoveOverlap, merger_lines_words

removeoverlap = RemoveOverlap()
def get_text(app_context,base_dir) :

    images   = extract_images(app_context,base_dir)
    #languages = get_languages(app_context)
    #words,lines = detect_text(images,languages)
    #words,lines  = get_coords(images,app_context)
    words,lines = [],[]

    ############## custom line detection model
    files = get_files(app_context.application_context)
    file_properties = File(files[0])
    line_layout = file_properties.get_line_layout_config()
    print("line_layout",line_layout)
    craft_line = file_properties.get_craft_config()
    if line_layout is not None and line_layout=='True':
        log_info('Line detection started by prima linenet model', app_context.application_context)
        lines = [predict_primanet.predict_primanet(images)]
    if craft_line is not None and craft_line=='True':
        log_info('Line detection started by craft model', app_context.application_context)
        languages = get_languages(app_context)
        words,lines = detect_text(images,languages)
        words,lines  = get_coords(images,app_context)
    return  words,lines,images


def get_response(app_context, words, lines, images):

    output = []
    files = get_files(app_context.application_context)

    for file_index, file in enumerate(files):
        file_prperties = FileOutput(file)
        try :
            for page_index, page in enumerate(images[file_index]):
                if len(words)!=0:
                    page_words  = words[file_index][page_index]
                else:
                    page_words = []
                if len(lines)!=0:
                    page_lines = lines[file_index][page_index]
                else:
                    page_lines = []

                ################ remove overlap at page level in lines
                
                page_properties = Page(page_words, page_lines, page)
                temp_page = page_properties.get_page()
                page_lines =  temp_page['lines']
                page_words =  temp_page['words']
                # if len(page_lines)>0 and len(page_words)>0:
                #     page_lines = removeoverlap.remove_overlap(page_lines)
                    ################ horizontal merging 
                    #page_lines = merger_lines_words(page_lines,page_words)
                    #page_lines = removeoverlap.remove_overlap(page_lines)

                    #temp_page['lines'] = copy.deepcopy(page_lines)
                file_prperties.set_page(temp_page)
                file_prperties.set_page_info(page)
            file_prperties.set_staus(True)
        except Exception as e:
            file_prperties.set_staus(False)
            log_exception("Error occured during response generation" + str(e), app_context.application_context, e)
            return None
        
        output.append(file_prperties.get_file())

    app_context.application_context['outputs'] = output

    return app_context.application_context


def TextDetection(app_context,base_dir=config.BASE_DIR):

    log_debug('Line detection starting processing {}'.format(app_context.application_context), app_context.application_context)

    try:

        words,lines,images = get_text(app_context,base_dir)

        if words !=None or lines!=None:
            return {
                    'code': 200,
                    'message': 'request completed',
                    'rsp':  get_response(app_context,words,lines,images)

                    }
        else:
            return {
                'code': 400,
                'message': 'Error occured during pdf to blocks conversion',
                'rsp': None
                }

    except Exception as e:
        log_exception("Error occured during Line detection conversion" + str(e),  app_context.application_context, e)
        return {
            'code': 400,
            'message': 'Error occured during pdf to blocks conversion',
            'rsp': None
            }
