from src.utilities.utils import FileOperation
from src.errors.errors_exception import WorkflowkeyError
from src.errors.errors_exception import FileErrors
from src.errors.errors_exception import FormatError

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

    def inputfile_list_error(self, input_files):
        if len(input_files) == 0 or not isinstance(input_files, list):
            raise FileErrors("NO_INPUT_FILES", "No file details in the input json")
        else:
            for i, item in enumerate(input_files):
                print(item)
                input_filename, in_file_type, identifier = file_ops.accessing_files(item['file'])
                print(input_filename)
                input_filepath = file_ops.input_path(input_filename)
                if input_filename == "" or input_filename is None:
                    raise FileErrors("FILENAME_ERROR", "Filename not found or its empty")
                #elif not input_filename.endswith('.pdf'):
                    #raise FileErrors("FILE_TYPE_ERROR", "This file type is not allowed. Currently, support only pdf file.")
                if in_file_type == "" or in_file_type is None:
                    raise FileErrors("FILE_TYPE_ERROR", "This file type is not allowed. Currently, support only pdf file.")
                #elif file_ops.check_file_extension(in_file_type) is False:
                    #raise FileErrors("FILE_TYPE_ERROR", "This file type is not allowed. Currently, support only pdf file.")
                elif file_ops.check_path_exists(input_filepath) is False or file_ops.check_path_exists(self.DOWNLOAD_FOLDER) is False:
                    raise FileErrors("DIRECTORY_ERROR", "There is no input/output Directory.")
                elif identifier == "" or identifier is None:
                    raise FileErrors("LOCALE_ERROR", "No language input or unsupported language input.")


    def format_error(self, json_data):
        keys_checked = {'workflowCode','jobID','input','tool','stepOrder'}
        if json_data.keys() == {'input'}:
            return True
        else:
            for check_key in keys_checked:
                if check_key in json_data.keys():
                    pass
                else:
                     raise FormatError(400, "Wrong input format")


            return True
            raise FormatError(400, "Wrong input format") 