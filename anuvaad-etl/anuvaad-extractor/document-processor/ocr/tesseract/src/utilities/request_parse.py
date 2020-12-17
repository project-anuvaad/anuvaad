import src.utilities.app_context as app_context
from anuvaad_auditor.loghandler import log_exception
import copy, json


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
        return self.file['page_info']

    @log_error
    def get_words(self, page_index):
        return self.file['pages'][page_index]['words']

    @log_error
    def get_lines(self, page_index):
        return self.file['pages'][page_index]['lines']

    @log_error
    def get_regions(self, page_index):
        return self.file['pages'][page_index]['regions']

    @log_error  
    def get_pageinfo(self, page_index):
        width = self.file['pages'][page_index]['vertices'][1]['x']
        height = self.file['pages'][page_index]['vertices'][3]['y']
        return width, height



def get_files(application_context):
    files = copy.deepcopy(application_context['input']['inputs'])
    return files

def get_ocr_config(file):
    ocr_level = file['config']['OCR']['option']
    lang = file['config']['OCR']['language']
    return ocr_level, lang 

def get_json(path):
    with open (path, "r") as f:
        data = json.loads(f.read())
    json_data = data['rsp']['outputs']
    return json_data


