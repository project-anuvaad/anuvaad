import os
from pathlib import Path

class File_operation(object):

    def __init__(self):
        self.upload_folder = None
        self.download_folder = None

    def file_upload(self, uploading_folder):
        self.upload_folder = uploading_folder
        upload_dir = Path(os.path.join(os.curdir,self.upload_folder))
        if upload_dir.exists() is False:
            os.makedirs(upload_dir)
        return upload_dir

    def file_download(self, downloading_folder):
        self.download_folder = downloading_folder
        download_dir = Path(os.path.join(os.curdir,self.download_folder))
        if download_dir.exists() is False:
            os.makedirs(download_dir)
        return download_dir
    
    def read_file(self, input_filepath):
        with open(input_filepath, 'r') as f:
            input_file_data = f.readlines()
        return input_file_data
