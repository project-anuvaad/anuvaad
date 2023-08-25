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
        if isinstance(input_key, list):
            if len(input_key) == 0:
                raise FileErrors("INPUT_ERROR", "Either inputText is not in list format or No data inside list.")
            elif len(input_key) != 0:
                for item in input_key:
                    if len(item['text']) == 0 or not isinstance(item['text'], list):
                        raise FileErrors("TEXT_ERROR", "Either text is not in list format or No data inside list.")
                    elif item['locale'] == "" or item['locale'] is None:
                        raise FileErrors("LOCALE_ERROR", "No language input or unsupported language input.")
        else:
            if 'files' in input_key.keys():
                input_files = input_key['files']
                if len(input_files) == 0 or not isinstance(input_files, list):
                    raise FileErrors("NO_INPUT_FILES", "No file details in the input json")
                else:
                    for i, item in enumerate(input_files):
                        try:
                            input_filename, in_file_type, in_locale = file_ops.accessing_files(item)
                        except:
                            raise FileErrors("INPUT_KEY_ERROR", "key under files are missing. Make sure you are using the correct format for files key.")
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
                            raise FileErrors("LOCALE_ERROR", "No language input or None value.")
            elif 'blocks' in input_key.keys():
                blocks_list, record_id, model_id, in_locale = file_ops.get_input_values_for_block_tokenise(input_key)
                if in_locale == "" or in_locale is None:
                    raise FileErrors("LOCALE_ERROR", "No language input or unsupported language input.")
                elif record_id == "" or record_id is None:
                    raise FileErrors("RECORD_ERROR", "No record id found for this request.")
                elif model_id == "" or model_id is None:
                    raise FileErrors("MODEL_ID_ERROR", "No model id found for this request.")
                elif not isinstance(blocks_list, list) or blocks_list == None:
                    raise FileErrors("BLOCKS_ERROR", "either blocks key isn't list type or none.")
    
    # checking support of tokeniser for languages
    def check_language(self, language):
        allowed_languages = ['en', 'hi', 'mr', 'ta', 'te', 'kn', 'ml', 'bn' , 'ne' , 'gom']
        if language not in allowed_languages:
            raise FileErrors("LOCALE_ERROR", "Currently, This language is not supported by tokeniser. \
                We support these language codes 'en', 'hi', 'mr', 'ta', 'te', 'kn', 'ml', 'bn' , 'ne' , 'gom ")
        
    # checking whether file is utf-16 encoded or not
    def file_encoding_error(self, input_file_data):
        try:
            if len(input_file_data) == 0 or not isinstance(input_file_data, list):
                raise FileErrors("EMPTY_FILE", "No Data inside txt file or it is not converted into list.")
        except:
            raise FileEncodingError( 400, "Tokenisation failed due to encoding. Service supports only utf-16 encoded file.")
    
    # checking input request format
    def format_error(self, json_data):
        keys_checked = {'workflowCode','jobID','input','tool','stepOrder','metadata'}
        if json_data.keys() == {'files'}:
            return True
        elif json_data.keys() >= keys_checked:
            return True 
        else:
            raise FormatError(400, "Wrong input format")