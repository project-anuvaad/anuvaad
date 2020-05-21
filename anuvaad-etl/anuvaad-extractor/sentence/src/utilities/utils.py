import os
from pathlib import Path

class File_operation(object):

    def __init__(self):
        self.upload_folder = 'upload_folder'
        self.download_folder = 'download_folder'

    def file_upload(self):
        upload_dir = Path(os.path.join(os.getcwd(),self.upload_folder))
        if upload_dir.exists() is False:
            os.makedirs(upload_dir)
        print(upload_dir)
        return upload_dir

    def file_download(self):
        download_dir = Path(os.path.join(os.getcwd(),self.download_folder))
        if download_dir.exists() is False:
            download_dir.mkdir()
        return download_dir
    
    def read_file(self, input_filepath):
        with open(input_filepath, 'r') as f:
            input_file_data = f.readlines()
        return input_file_data
