import os
from pathlib import Path
import time

class FileOperation(object):

    def __init__(self):
        self.download_folder = None

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

    def check_file_extension(self, file_type):
        allowed_extensions = ['txt','csv']
        if file_type in allowed_extensions:
            return True
        else:
            return False

    def input_path(self, input_filename):
        input_filepath = os.path.join('upload', input_filename)
        return input_filepath

    def output_path(self,i, DOWNLOAD_FOLDER):
        output_filename = '%d-'%i + str(time.time()).replace('.', '') + '.txt'
        output_filepath = os.path.join(DOWNLOAD_FOLDER, output_filename)
        return output_filepath , output_filename
    
    def read_file(self, input_filename):
        input_filepath = self.input_path(input_filename)
        with open(input_filepath, 'r') as f:
            input_file_data = f.readlines()
        return input_file_data

    def producer_input(self, input_filepath, in_file_type, in_locale, jobid):
        producer_feed_data = {
            "filepath": input_filepath,
            "type": in_file_type,
            "locale": in_locale,
            "jobID": jobid
        }
        return producer_feed_data

    def json_input_format(self, json_data):
        #json_data = json_data["input"]
        input_files = json_data["input"]['files']
        workflow_id = json_data['workflowCode']
        jobid = json_data['jobID']
        tool_name = json_data['tool']
        step_order = json_data['stepOrder']
        return input_files, workflow_id, jobid, tool_name, step_order

    def accessing_files(self,files):
        filepath = files['path']
        file_type = files['type']
        locale = files['locale']
        return filepath, file_type, locale

    def one_filename_response(self, input_filename, output_filename):
        file_res = {
            "input" : input_filename,
            "output" : output_filename
        }
        return file_res