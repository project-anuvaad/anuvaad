import copy
import json
import os
import re
import time
from pathlib import Path

import magic
from anuvaad_auditor import log_info
from anuvaad_auditor.errorhandler import post_error
from anuvaad_auditor.errorhandler import post_error_wf

import config
from errors.errors_exception import FileEncodingError


class FileOperation(object):

    def __init__(self):
        self.download_folder = None

    # creating directory if it is not existed before.
    def file_download(self, downloading_folder):
        self.download_folder = downloading_folder
        download_dir = Path(os.path.join(os.curdir, self.download_folder))
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
        allowed_extensions = config.ALLOWED_FILE_EXTENSION
        if file_type in allowed_extensions:
            return True
        else:
            return False

    def check_file_mime_type(self, file_path, in_file_type, json_data=None):
        if in_file_type == 'json':
            return True
        mime_type = magic.from_file(file_path, mime=True)
        log_info(f"check_file_mime_type :: FILE: {file_path}  MIME TYPE: {mime_type}", json_data)
        return mime_type in config.ALLOWED_MIME_TYPES
    
    def get_mime_type(self, mime_type, file_path, in_file_type, json_data=None):
        if in_file_type == 'json':
            return True
        mime_type = magic.from_file(file_path, mime=True)
        mime_type = config.REJECTED_MIME_TYPES[mime_type]

        return  mime_type
    # generating input filepath for input filename
    def input_path(self, input_filename):
        input_filepath = os.path.join('upload', input_filename)
        return input_filepath

    # generating output filepath for output filename
    def output_path(self, index, DOWNLOAD_FOLDER, out_filetype):
        output_filename = '%d-' % index + str(time.time()).replace('.', '') + out_filetype
        output_filepath = os.path.join(DOWNLOAD_FOLDER, output_filename)
        return output_filepath, output_filename

    # writing json file of service response
    def writing_json_file(self, index, json_data, DOWNLOAD_FOLDER):
        output_filepath, output_filename = self.output_path(index, DOWNLOAD_FOLDER, '.json')
        with open(output_filepath, 'w') as f:
            json_object = json.dumps(json_data)
            f.write(json_object)
        return output_filename

    # reading content of input text file
    def read_txt_file(self, input_filename, ):
        try:
            input_txt_filepath = self.input_path(input_filename)
            with open(input_txt_filepath, 'r', encoding='utf-16') as f:
                input_file_data = f.readlines()
            input_file_data = [' '.join([re.sub('\r\n|\n', '', text) for text in input_file_data])]
            return input_file_data
        except:
            raise FileEncodingError(400, "Transform failed due to encoding. Service supports only utf-16 encoded file.")

    # reading content from json file
    def read_json_file(self, input_filename):
        input_json_filepath = self.input_path(input_filename)
        file_write = open(input_json_filepath, 'r+', encoding='utf-8')
        data = json.loads(file_write.read())
        return data, file_write

    # extracting data from received json input
    def json_input_format(self, json_data):
        input_files = json_data["input"]
        workflow_id = json_data['workflowCode']
        jobid = json_data['jobID']
        tool_name = json_data['tool']
        step_order = json_data['stepOrder']
        user_id = json_data['metadata']['userID']
        return input_files, workflow_id, jobid, tool_name, step_order, user_id

    # extracting input file features
    def accessing_files(self, files):
        filepath = files['path']
        file_type = files['type']
        locale = files['locale']
        return filepath, file_type, locale

    # getting input key values from block tokeniser request
    def get_input_values_for_block_tokenise(self, input_data):
        record_id = input_data['record_id']
        model_id = input_data['model_id']
        blocks_list = input_data['text_blocks']
        in_locale = input_data['locale']
        return blocks_list, record_id, model_id, in_locale

    # output format for individual pdf file
    def one_filename_response(self, input_filename, output_filename, in_locale, in_file_type):
        file_res = {
            "inputFile": input_filename,
            "outputFile": output_filename,
            "outputLocale": in_locale,
            "outputType": in_file_type
        }
        return file_res

    def add_aditional_fields(self, input_file_obj, output_file_obj):
        for key, val in input_file_obj.items():
            if key not in ['locale', 'path', 'type']:
                output_file_obj[key] = val

        return output_file_obj

    # error manager integration 
    def error_handler(self, object_in, code, iswf):
        if iswf:
            object_in['status'] = "FAILED"
            object_in['state'] = "FILE-TRANSLATED"
            error = post_error_wf(code, object_in['message'], object_in, None)
            # TEMP CHANGES #TODO ADDED BECAUSE EVEN AFTER STATUS FAILED WF WAS NOT UPDATING THE STATUS
            try:
                error['error'] = copy.deepcopy(error)
                if 'errorID' in error.keys():
                    error.pop('errorID')
                if 'metadata' in error.keys():
                    error.pop('metadata')
                if 'errorType' in error.keys():
                    error.pop('errorType')
                if 'code' in error.keys():
                    error.pop('code')
                if 'message' in error.keys():
                    error.pop('message')
                if 'errorType' in error.keys():
                    error.pop('errorType')

                error["stepOrder"] = object_in["stepOrder"]
                error['tool'] = object_in['tool']
                error['taskStarttime'] = None
                error['taskEndTime'] = None
                error['output'] = None
                error['workflowCode'] = object_in['workflowCode']
            except Exception as e:
                pass
            # TEMP CHANGES #TODO
            return error
        else:
            code = code
            message = ""
            error = post_error(code, message, None)
            return error

    def create_directory(self, path):
        try:
            os.mkdir(path)
            return True
        except FileExistsError as fe_error:
            return True
        except OSError as error:
            log_info('unable to create directory : {}'.format(path), None)

        return False
