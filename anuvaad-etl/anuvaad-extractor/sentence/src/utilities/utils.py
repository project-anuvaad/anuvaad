import os
from pathlib import Path
import uuid

class FileOperation(object):

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

    def check_path_exists(self, dir):
        if dir is not None and os.path.exists(dir) is True:
            return True
        else:
            return False

    def check_file_extension(self, filename):
        allowed_extensions = ['.txt']
        ext = os.path.splitext(filename)[-1].lower()
        if ext in allowed_extensions:
            return True
        else:
            return False

    def output_path(self, DOWNLOAD_FOLDER):
        output_filenname = 'tokenised_file_' + str(uuid.uuid1()) + '.txt'
        output_filepath = os.path.join(DOWNLOAD_FOLDER, output_filenname)
        return output_filepath
    
    def read_file(self, input_filepath):
        with open(input_filepath, 'r') as f:
            input_file_data = f.readlines()
        return input_file_data
