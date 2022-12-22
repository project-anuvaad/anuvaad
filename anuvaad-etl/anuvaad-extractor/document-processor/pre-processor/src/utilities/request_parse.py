from anuvaad_auditor.loghandler import log_exception
import copy
import json
import config



class File:

    def __init__(self, file):
        self.file = file

    
    def get_format(self):
        return self.file['file']['type']

    
    def get_name(self):
        return self.file['file']['path']

    
    def get_tilt_align_config(self):
        if 'align' not in self.file['config']['OCR'].keys():
            return None
        else:
            return self.file['config']['OCR']['align']

    def get_watermark_remove_config(self):
        if 'watermark' not in self.file['config']['OCR'].keys():
            return None
        else:
            return self.file['config']['OCR']['watermark']
   
    def get_file(self):
        return self.file




def get_files(application_context):
    files = copy.deepcopy(application_context['input']['inputs'])
    return files

