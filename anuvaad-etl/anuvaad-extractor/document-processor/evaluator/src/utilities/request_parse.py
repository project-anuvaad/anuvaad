import src.utilities.app_context as app_context
from anuvaad_auditor.loghandler import log_exception
import copy
import config
import json

def log_error(method):
    def wrapper(*args, **kwargs):
        try:
            output = method(*args, **kwargs)
            return output
        except Exception as e:
            log_exception('Invalid request, required key missing of {}'.format(e), app_context.application_context, e)
            return None
    return wrapper



class Evalue:
    def __init__(self,eval):
        self.eval = eval
        self.eval['pages'] = []

    def get_strategy(self):
        return self.eval['config']['strategy']

    def get_boxlevel(self):
        key_mapping = {'WORD' : 'words' ,'LINE':'lines' , 'PARAGRAPH' : 'regions' }
        return key_mapping[self.eval['config']['boxLevel']]

    def get_json(self):
        gt_file_name = self.eval['ground']['name']
        in_file_name = self.eval['input']['name']
        gt_path = config.BASE_DIR + '/' + gt_file_name
        in_path =  config.BASE_DIR + '/' + in_file_name
        with open(gt_path) as f:
            gt_json = json.load(f)
            gt_data = gt_json['rsp']['outputs']
        with open(in_path) as f:
            in_json = json.load(f)
            in_data = in_json['rsp']['outputs']
        return gt_data ,in_data

    def get_evaluation(self):
        del self.eval['ground']
        del self.eval['input']
        del self.eval['config']
        return self.eval

    def set_page(self,page):
        self.eval['pages'].append(page)

    def set_staus(self,mode):
        if mode :
            self.eval['status'] = {"code": 200, "message": "word-detector successful"}
        else:
            self.eval['status'] = {"code": 400, "message": "word-detector failed"}


class File:

    def __init__(self, file):
        self.file = file

    @log_error
    def get_format(self):
        return self.file['file']['format']

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
    def get_boxes(self,box_level,page_index):
        return self.file['pages'][page_index][box_level]


    @log_error
    def get_language(self):
        return self.file['config']['OCR']['language']

    @log_error
    def get_file(self):
        return self.file




def get_files(application_context):
    files = copy.deepcopy(application_context['inputs'])
    return files


def get_languages(app_context):
    languages = []
    files = get_files(app_context.application_context)
    for file in files :
        file_properties = File(file)
        languages.append(file_properties.get_language())
    return  languages
