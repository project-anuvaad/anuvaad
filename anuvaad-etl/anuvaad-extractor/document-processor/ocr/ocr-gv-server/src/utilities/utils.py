import os
from pathlib import Path
import time
import json
from anuvaad_auditor.errorhandler import post_error
from anuvaad_auditor.errorhandler import post_error_wf

class FileOperation(object):

    def __init__(self):
        self.download_folder = None

    # creating directory if it is not existed before.
    def create_file_download_dir(self, downloading_folder):
        self.download_folder = downloading_folder
        download_dir = Path(os.path.join(os.getcwd(), self.download_folder))
        if download_dir.exists() is False:
            os.makedirs(download_dir)
        return str(download_dir)

    def accessing_files(self,files):
        try:
            filepath = files['name']
            file_type = files['type']
            identifier = files['identifier']
        except Exception as e:
            log_exception("accessing_files, keys not found ",  LOG_WITHOUT_CONTEXT, e)

        return filepath, file_type, identifier

    # generating input filepath for input filename
    def input_path(self, input_filename):
        input_filepath = os.path.join('upload', input_filename)
        return input_filepath

    # extracting data from received json input
    def json_input_format(self, json_data):
        try:
            input_data = json_data['input']['inputs']
            workflow_id = json_data['workflowCode']
            jobid = json_data['jobID']
            tool_name = json_data['tool']
            step_order = json_data['stepOrder']
        except Exception as e:
            log_exception("json_input_format, keys not found or mismatch in json inputs ",  LOG_WITHOUT_CONTEXT, e)
        return input_data, workflow_id, jobid, tool_name, step_order

    # output format for individual pdf file
    def one_filename_response(self,output_json_file,langs):
        file_res = {
            "outputFile" : output_json_file,
            "outputType" : "json",
            "outputLocale":langs
        }
        return file_res     

    # checking file extension of received file type
    def check_file_extension(self, file_type):
        allowed_extensions = ['pdf']
        if file_type in allowed_extensions:
            return True
        else:
            return False

    # checking directory exists or not
    def check_path_exists(self, dir):
        if dir is not None and os.path.exists(dir) is True:
            return True
        else:
            return False

    # generating output filepath for output filename
    def output_path(self,index, DOWNLOAD_FOLDER):
        output_filename = '%d-'%index + str(time.time()).replace('.', '') + '.json'
        output_filepath = os.path.join(DOWNLOAD_FOLDER, output_filename)
        return output_filepath , output_filename

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
                job_id = object_in["jobID"]
                task_id = object_in["taskID"]
                state = object_in['state']
                status = object_in['status']
                code = code
                message = object_in['message']
                error = post_error_wf(code, message, object_in , None)
                return error
        else:
            code = object_in['error']['code']
            message = object_in['error']['message']
            error = post_error(code, message, None)
            return error
