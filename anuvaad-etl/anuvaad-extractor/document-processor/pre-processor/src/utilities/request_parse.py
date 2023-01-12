from anuvaad_auditor.loghandler import log_exception
import copy
import json
import config



class File:

    def __init__(self, file):
        self.file = file

    
    def get_format(self):
        return self.file['type']

    
    def get_name(self):
        return self.file['path']

    
    def get_tilt_align_config(self):
        print(self.file)
        if 'align' not in self.file.keys():
            return None
        else:
            return self.file['align']

    def get_watermark_remove_config(self):
        if 'watermark' not in self.file.keys():
            return None
        else:
            return self.file['watermark']
   
    def get_file(self):
        return self.file




def get_files(application_context):
    files = copy.deepcopy(application_context['input']['files'])
    return files

