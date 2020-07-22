import os
from pathlib import Path
import time
from error_manager.emservice import post_error
from error_manager.emservice import post_error_wf

class FileOperation(object):

    def __init__(self):
        self.download_folder = None

    def create_file_upload_dir(self, downloading_folder):
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
    
    def read_file(self, input_filename):
        input_filepath = self.input_path(input_filename)
        with open(input_filepath, 'r', encoding='utf-16') as f:
            input_file_data = f.readlines()
        return input_file_data

    def json_input_format(self, json_data):
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

    def one_filename_response(self, input_filename, output_filename, in_locale, in_file_type):
        file_res = {
            "inputFile" : input_filename,
            "outputFile" : output_filename,
            "outputLocale" : in_locale,
            "outputType" : "json"
        }
        return file_res

    def error_handler(self, object_in, iswf):
        if iswf:
                job_id = object_in["jobID"]
                task_id = object_in["taskID"]
                state = object_in['state']
                status = object_in['status']
                code = object_in['error']['code']
                message = object_in['error']['message']
                error = post_error_wf(code, message, job_id, task_id, state, status, None)
                return error
        else:
            code = object_in['error']['code']
            message = object_in['error']['message']
            error = post_error(code, message, None)
            return error