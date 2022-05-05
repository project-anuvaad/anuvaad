import src.utilities.app_context as app_context
from anuvaad_auditor.loghandler import log_exception
import copy, json,os
from  config import LANG_MAPPING
from src.utilities.detect_language import detect

def log_error(method):
    def wrapper(*args, **kwargs):
        try:
            output = method(*args, **kwargs)
            return output
        except Exception as e:
            log_exception('Invalid request, required key missing of {}'.format(e), app_context.application_context, e)
            return None
    return wrapper


class File:

    def __init__(self, file):
        self.file = file

    @log_error
    def get_format(self):
        return self.file['file']['type']

    @log_error
    def get_name(self):
        return self.file['file']['name']

    @log_error
    def get_pages(self):
        return ['/'.join(page_path.split('/')[-4:]) for page_path in self.file['page_info']]

    @log_error
    def get_words(self, page_index):
        return self.file['pages'][page_index]['words']

    @log_error
    def get_lines(self, page_index):
        return self.file['pages'][page_index]['lines']

    @log_error
    def get_region_lines(self, page_index,region_index):
        if 'children' in self.file['pages'][page_index]['regions'][region_index].keys():
            return self.file['pages'][page_index]['regions'][region_index]['children']
        else:
            return None
    
    @log_error
    def get_region_words(self, page_index,region_index,child_index):
        return self.file['pages'][page_index]['regions'][region_index]['children'][child_index]['children']



    @log_error
    def get_regions(self, page_index):
        return self.file['pages'][page_index]['regions']

    @log_error  
    def get_pageinfo(self, page_index):
        width = self.file['pages'][page_index]['vertices'][1]['x']
        height = self.file['pages'][page_index]['vertices'][3]['y']
        return width, height

    def get_file(self):
        return self.file


def get_files(application_context):
    files = copy.deepcopy(application_context['input']['inputs'])
    return files

def get_ocr_config(file,pages):
    ocr_level = file['config']['OCR']['option']
    lang = file['config']['OCR']['language']

    if lang  == 'detect':
        print('Detecting language ...')
        lang = detect(pages)
        print('language detected is {}'.format(lang))
    else :
        lang = LANG_MAPPING[lang][0]
    weight_path = '/usr/share/tesseract-ocr/4.00/tessdata/' + lang + '.traineddata'
    if not os.path.exists(weight_path):
        download = 'curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/' + lang \
                   + '.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/script/' + lang + '.traineddata'
        os.system(download)
    return ocr_level, lang

def get_json(path,base_dir):
    path = os.path.join(base_dir, path)
    with open (path, "r") as f:
        data = json.loads(f.read())
    #print(data)
    #json_data = data['rsp']['outputs']
    json_data = data['outputs']
    return json_data


