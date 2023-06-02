import os

import config
from errors.errors_exception import FileEncodingError
from errors.errors_exception import FileErrors
from errors.errors_exception import FormatError
from errors.errors_exception import WorkflowkeyError
from utilities.utils import FileOperation

file_ops = FileOperation()


class ValidationResponse(object):

    def __init__(self, DOWNLOAD_FOLDER, json_data=None):
        self.json_data = json_data
        self.DOWNLOAD_FOLDER = DOWNLOAD_FOLDER

    # workflow related key value errors
    def wf_keyerror(self, jobid, workflow_id, tool_name, step_order):
        if "" in (jobid, workflow_id, tool_name, step_order):
            raise WorkflowkeyError(400, "jobID/workflowCode/tool/stepOrder is missing in input json")
        elif None in (jobid, workflow_id, tool_name, step_order):
            raise WorkflowkeyError(400, "jobID/workflowCode/tool/stepOrder somehow got None value")

    def inputfile_list_empty(self, input_key):
        if isinstance(input_key, dict) and 'files' in input_key.keys():
            input_files = input_key['files']
            if len(input_files) == 0 or not isinstance(input_files, list):
                raise FileErrors("NO_INPUT_FILES", "No file details in the input json")
            else:
                for i, item in enumerate(input_files):
                    try:
                        input_filename, in_file_type, in_locale = file_ops.accessing_files(item)
                    except:
                        raise FileErrors("INPUT_KEY_ERROR",
                                         "key under files are missing. Make sure you are using the correct format for files key.")

                    input_filepath = file_ops.input_path(input_filename)

                    if input_filename == "" or input_filename is None:
                        raise FileErrors("FILENAME_ERROR", "Filename not found or its empty")

                    elif not os.path.splitext(input_filename)[1] in ['.' + ext for ext in config.ALLOWED_FILE_EXTENSION]:
                        raise FileErrors("FILE_TYPE_ERROR", "This file type is not allowed.")

                    elif file_ops.check_file_extension(in_file_type) is False:
                        raise FileErrors("FILE_TYPE_ERROR", "This file type is not allowed.")

                    elif file_ops.check_file_mime_type(file_path=input_filepath, in_file_type=in_file_type, json_data=self.json_data) is False:
                        raise FileErrors("FILE_MIME_TYPE_ERROR", "This file format is not supported - ( " + file_ops.get_mime_type(self, file_path = input_filepath, in_file_type=in_file_type) + " )")

                    elif in_file_type not in ['json'] and file_ops.check_path_exists(input_filepath) is False:
                        raise FileErrors("DIRECTORY_ERROR", "There is no file: ")

                    elif file_ops.check_path_exists(self.DOWNLOAD_FOLDER) is False:
                        raise FileErrors("DIRECTORY_ERROR", "There is no input/output Directory: ")

                    elif in_locale == "" or in_locale is None:
                        raise FileErrors("LOCALE_ERROR", "No language input or None value.")
        else:
            raise FileErrors("NO_INPUT_FILES", "No files key in the input json")

    # checking whether file is utf-16 encoded or not
    def file_encoding_error(self, input_file_data):
        try:
            if len(input_file_data) == 0 or not isinstance(input_file_data, list):
                raise FileErrors("EMPTY_FILE", "No Data inside txt file or it is not converted into list.")
        except:
            raise FileEncodingError(400,
                                    "Transform failed due to encoding. Service supports only utf-16 encoded file.")

    # checking input request format
    def format_error(self, json_data):
        keys_checked = {'workflowCode', 'jobID', 'input', 'tool', 'stepOrder', 'metadata'}
        if json_data.keys() == {'files'}:
            return True
        elif json_data.keys() >= keys_checked:
            return True
        else:
            raise FormatError(400, "Wrong input format")
