from utilities.model_response import Status
from utilities.utils import FileOperation
from errors.errors_exception import WorkflowkeyError
from errors.errors_exception import FileErrors
from errors.errors_exception import FileEncodingError
from errors.errors_exception import FormatError

file_ops = FileOperation()

class ValidationResponse(object):

    def __init__(self, DOWNLOAD_FOLDER):
        self.DOWNLOAD_FOLDER = DOWNLOAD_FOLDER

    # workflow related key value errors
    def wf_keyerror(self, jobid, workflow_id, tool_name, step_order):
        if "" in (jobid, workflow_id, tool_name, step_order):
            raise WorkflowkeyError(400, "jobID/workflowCode/tool/stepOrder is missing in input json")
        elif None in (jobid, workflow_id, tool_name, step_order):
            raise WorkflowkeyError(400, "jobID/workflowCode/tool/stepOrder somehow got None value")

    def inputfile_list_empty(self, input_key):
        if 'files' in input_key.keys():
            input_files = input_key['files']
            if len(input_files) == 0 or not isinstance(input_files, list):
                raise FileErrors("NO_INPUT_FILES", "No file details in the input json")
            else:
                for i, item in enumerate(input_files):
                    input_filename, in_file_type, in_locale = file_ops.accessing_files(item)
                    input_filepath = file_ops.input_path(input_filename)
                    if input_filename == "" or input_filename is None:
                        raise FileErrors("FILENAME_ERROR", "Filename not found or its empty")
                    elif not input_filename.endswith('.txt') and not input_filename.endswith('.json'):
                        raise FileErrors("FILE_TYPE_ERROR", "This file type is not allowed. Currently, support txt and json files.")
                    elif file_ops.check_file_extension(in_file_type) is False:
                        raise FileErrors("FILE_TYPE_ERROR", "This file type is not allowed. Currently, support only txt file.")
                    elif file_ops.check_path_exists(input_filepath) is False or file_ops.check_path_exists(self.DOWNLOAD_FOLDER) is False:
                        raise FileErrors("DIRECTORY_ERROR", "There is no input/output Directory.")
                    elif in_locale == "" or in_locale is None:
                        raise FileErrors("LOCALE_ERROR", "No language input or unsupported language input.")
        else:
            if not isinstance(input_key, dict):
                raise FileErrors("INPUT_KEY_ERROR", "Input key is not in dict format")
            elif not input_key.keys() >= {'text', 'locale'}:
                raise FileErrors("INPUT_KEY_ERROR", "keys missing in this dictionary.Desired keys: text, locale.")
            elif len(input_key['text']) == 0 or not isinstance(input_key['text'], list):
                raise FileErrors("TEXT_ERROR", "Either text is not in list format or No data inside list.")
            elif input_key['locale'] == "" or input_key['locale'] is None:
                raise FileErrors("LOCALE_ERROR", "No language input or unsupported language input.")

    # checking whether file is utf-16 encoded or not
    def file_encoding_error(self, input_file_data):
        try:
            if len(input_file_data) == 0 or not isinstance(input_file_data, list):
                raise FileErrors("EMPTY_FILE", "No Data inside txt file or it is not converted into list.")
        except:
            raise FileEncodingError( 400, "Tokenisation failed due to encoding. Service supports only utf-16 encoded file.")

    def format_error(self, json_data):
        keys_checked = {'workflowCode','jobID','input','tool','stepOrder'}
        if json_data.keys() == {'files'}:
            return True
        elif json_data.keys() >= keys_checked:
            return True 
        else:
            raise FormatError(400, "Wrong input format")