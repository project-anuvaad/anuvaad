import os
from pathlib import Path
import time
import json
from anuvaad_auditor.errorhandler import post_error
from anuvaad_auditor.errorhandler import post_error_wf
import config

class FileOperation(object):

    def __init__(self):
        self.download_folder = None

    # creating directory if it is not existed before.
    def file_download(self, downloading_folder):
        self.download_folder = downloading_folder
        download_dir = Path(os.path.join(os.curdir,self.download_folder))
        if download_dir.exists() is False:
            os.makedirs(download_dir)
        return download_dir

    # checking directory exists or not
    def check_path_exists(self, dir):
        if dir is not None and os.path.exists(dir) is True:
            return True
        else:
            return False

    # checking file extension of received file type
    def check_file_extension(self, file_type):
        allowed_extensions = ['txt','csv']
        if file_type in allowed_extensions:
            return True
        else:
            return False

    # generating input filepath for input filename
    def input_path(self, input_filename):
        input_filepath = os.path.join('upload', input_filename)
        return input_filepath

    # generating output filepath for output filename
    def output_path(self,i, DOWNLOAD_FOLDER):
        output_filename = '%d-'%i + str(time.time()).replace('.', '') + '.json'
        output_filepath = os.path.join(DOWNLOAD_FOLDER, output_filename)
        return output_filepath , output_filename
    
    # reading content of input text file
    def read_file(self, input_filename):
        input_filepath = self.input_path(input_filename)
        with open(input_filepath, 'r', encoding='utf-16') as f:
            input_file_data = f.readlines()
        return input_file_data

    # extracting data from received json input
    def json_input_format(self, json_data):
        print(json_data)
        input_files = json_data['input']['files']
        workflow_id = json_data['workflowCode']
        jobid = json_data['jobID']
        tool_name = json_data['tool']
        step_order = json_data['stepOrder']
        return input_files, workflow_id, jobid, tool_name, step_order

    # extracting input file features
    def accessing_files(self,files):
        filepath = files['path']
        file_type = files['type']
        locale = files['locale']
        return filepath, file_type, locale

    # output format for individual pdf file
    def one_filename_response(self,output_json_file):
        file_res = {
            "outputFile" : output_json_file,
            "outputType" : "json"
        }
        return file_res

    # writing json file of service response
    def writing_json_file(self, index, json_data, DOWNLOAD_FOLDER):
        output_filepath , output_filename = self.output_path(index, DOWNLOAD_FOLDER)
        with open(output_filepath, 'w') as f:
            json_object = json.dumps(json_data)
            f.write(json_object)
        return output_filename

    # error manager integration 
    def error_handler(self, object_in, code, iswf):
        if iswf:
            object_in['status'] = "FAILED"
            object_in['state'] = config.TASK_STAT
            error = post_error_wf(code, object_in['message'], object_in, None)
            return error
        else:
            code = code
            message = ""
            error = post_error(code, message, None)
            return error