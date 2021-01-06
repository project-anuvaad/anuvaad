import os
import json
import time
import re
from pathlib import Path
from anuvaad_auditor.errorhandler import post_error
from anuvaad_auditor.errorhandler import post_error_wf
from errors.errors_exception import FileEncodingError, FileErrors


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
        allowed_extensions = ['txt','json']
        if file_type in allowed_extensions:
            return True
        else:
            return False

    # generating input filepath for input filename
    def input_path(self, input_filename):
        input_filepath = os.path.join('upload', input_filename)
        return input_filepath

    # generating output filepath for output filename
    def output_path(self,i, DOWNLOAD_FOLDER, out_filetype):
        output_filename = '%d-'%i + str(time.time()).replace('.', '') + out_filetype
        output_filepath = os.path.join(DOWNLOAD_FOLDER, output_filename)
        return output_filepath , output_filename
    
    # reading content of input text file
    def read_txt_file(self, input_filename,):
        try:
            input_txt_filepath = self.input_path(input_filename)
            with open(input_txt_filepath, 'r', encoding='utf-16') as f:
                input_file_data = f.readlines()
            input_file_data = [' '.join([re.sub('\r\n|\n', '', text) for text in input_file_data])]
            return input_file_data
        except:
            raise FileEncodingError( 400, "Tokenisation failed due to encoding. Service supports only utf-16 encoded file.")

    #reading content from json file
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
    def accessing_files(self,files):
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
            "inputFile" : input_filename,
            "outputFile" : output_filename,
            "outputLocale" : in_locale,
            "outputType" : in_file_type
        }
        return file_res

    def add_aditional_fields(self, input_file_obj, output_file_obj):
        for key, val in input_file_obj.items():
            if key not in ['locale', 'path', 'type']:
                if val is None or val == "":
                    raise FileErrors("INPUT_VALUE_ERROR",
                                     "Value under files are missing. Make sure you are using the correct Value for files keys.")
                else:
                    output_file_obj[key] = val

        return output_file_obj

    # error manager integration 
    def error_handler(self, object_in, code, iswf):
        if iswf:
            object_in['status'] = "FAILED"
            object_in['state'] = "SENTENCE-TOKENISED"
            error = post_error_wf(code, object_in['message'], object_in, None)
            return error
        else:
            code = code
            message = ""
            error = post_error(code, message, None)
            return error