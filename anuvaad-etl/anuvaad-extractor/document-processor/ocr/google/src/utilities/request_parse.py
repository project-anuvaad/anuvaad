import src.utilities.app_context as app_context
from anuvaad_auditor.loghandler import log_exception
import copy
import os,json,cv2

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
    def get_language(self):
        return self.file['config']['OCR']['language']

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
    def get_regions(self, page_index):
        return self.file['pages'][page_index]['regions']

    @log_error
    def get_fontinfo(self):
        return {'family':'Arial Unicode MS', 'size':0, 'style':'REGULAR'}
        #return self.file['pages'][page_index]['font_properties']

    @log_error
    def get_file(self):
        return self.file
    @log_error  
    def get_pageinfo(self, page_index,path):
        img = cv2.imread(path)
        height = img.shape[0]
        width = img.shape[1]
        return width, height

def get_files(application_context):
    #files = copy.deepcopy(application_context['input']['files'])
    files = copy.deepcopy(application_context['input']['inputs'])
    return files


