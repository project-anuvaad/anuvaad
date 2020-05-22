import os
from pathlib import Path

class File_operation(object):

    def __init__(self):
        pass

    def file_upload(self):
        upload_dir = Path(os.path.join(os.curdir,'upload_folder'))
        if upload_dir.exists() is False:
            os.makedirs(upload_dir)
        return upload_dir

    def file_download(self):
        download_dir = Path(os.path.join(os.curdir,'download_folder'))
        if download_dir.exists() is False:
            os.makedirs(download_dir)
        return download_dir
    
    def read_file(self, input_filepath):
        with open(input_filepath, 'r') as f:
            input_file_data = f.readlines()
        return input_file_data
