import src.utilities.app_context as app_context
from anuvaad_auditor.loghandler import log_exception
import copy
import json
import config


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
    def get_language(self):
        return self.file['config']['OCR']['language']
    
    @log_error
    def get_craft_config(self):
        if 'craft_line' not in self.file['config']['OCR'].keys():
            return None
        else:
            return self.file['config']['OCR']['craft_line']
    @log_error
    def get_craft_model_config(self):
        return self.file['config']['OCR']
    @log_error
    def get_line_layout_config(self):
        if 'line_layout' not in self.file['config']['OCR'].keys():
            return None
        else:
            return self.file['config']['OCR']['line_layout']

    @log_error
    def get_tilt_align_config(self):
        if 'align' not in self.file['config']['OCR'].keys():
            return None
        else:
            return self.file['config']['OCR']['align']

    @log_error
    def get_file(self):
        return self.file




def get_files(application_context):
    files = copy.deepcopy(application_context['input']['inputs'])
    return files

    

def get_languages(app_context):
    languages = []
    files = get_files(app_context.application_context)
    for file in files :
        file_properties = File(file)
        languages.append(file_properties.get_language())
    return  languages
