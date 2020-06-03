from flask import jsonify
import enum
from src.utilities.utils import FileOperation 
import config
from src.services.service import Tokenisation
import time

class Status(enum.Enum):
    SUCCESS = {
        "status": "SUCCESS",
        "state": "SENTENCE-TOKENISED"
    }
    ERR_EMPTY_FILE = {
        "status": "FAILED",
        "state": "SENTENCE-TOKENISED",
        "error": "File do not have any content"
    }
    ERR_EMPTY_FILE_LIST = {
        "status": "FAILED",
        "state": "SENTENCE-TOKENISED",
        "error": "DO not receiving any input files."
    }
    ERR_FILE_NOT_FOUND = {
        "status": "FAILED",
        "state": "SENTENCE-TOKENISED",
        "error": "File not found."
    }
    ERR_DIR_NOT_FOUND = {
        "status": "FAILED",
        "state": "SENTENCE-TOKENISED",
        "error": "There is no input/output Directory."
    }
    ERR_EXT_NOT_FOUND = {
        "status": "FAILED",
        "state": "SENTENCE-TOKENISED",
        "error": "This file type is not allowed."
    }
    ERR_locale_NOT_FOUND = {
        "status": "FAILED",
        "state": "SENTENCE-TOKENISED",
        "error": "No language input"
    }
    ERR_jobid_NOT_FOUND = {
        "status": "FAILED",
        "state": "SENTENCE-TOKENISED",
        "error": "jobID is not given."
    }
    ERR_Workflow_id_NOT_FOUND = {
        "status": "FAILED",
        "state": "SENTENCE-TOKENISED",
        "error": "workflowCode is not given."
    }


class CustomResponse():
    def __init__(self, status_code,jobid, workflow_id, taskid, task_start_time, task_end_time, filename_response):
        self.status_code = status_code
        self.status_code['jobID'] = jobid
        self.status_code['taskID'] = taskid
        self.status_code['workflowCode'] = workflow_id
        self.status_code['taskStarttime'] = task_start_time
        self.status_code['taskendTime'] = task_end_time
        self.filename_response = filename_response

    def get_response(self):
        self.status_code['files'] = self.filename_response
        return jsonify(self.status_code)

def checking_file_response(jobid, workflow_id, task_id, task_starttime, input_files, DOWNLOAD_FOLDER):
    file_ops = FileOperation()
    output_filename = ""
    filename_response = list()
    if len(input_files) == 0 or not isinstance(input_files, list):
        task_endtime = int(time.time())
        response = CustomResponse(Status.ERR_EMPTY_FILE_LIST.value, jobid, workflow_id, task_id, task_starttime, task_endtime, filename_response)
        return response.get_response()
    else:
        for i, item in enumerate(input_files):
            input_filename, in_file_type, in_locale = file_ops.accessing_files(item)
            input_filepath = file_ops.input_path(input_filename) #
            file_res = file_ops.one_filename_response(input_filename, output_filename)
            filename_response.append(file_res)
            if input_filename == "" or input_filename is None:
                task_endtime = int(time.time())
                response = CustomResponse(Status.ERR_FILE_NOT_FOUND.value, jobid, workflow_id, task_id, task_starttime, task_endtime, filename_response)
                return response.get_response()
            elif file_ops.check_file_extension(in_file_type) is False:
                task_endtime = int(time.time())
                response = CustomResponse(Status.ERR_EXT_NOT_FOUND.value, jobid, workflow_id, task_id, task_starttime, task_endtime, filename_response)
                return response.get_response()
            elif file_ops.check_path_exists(input_filepath) is False or file_ops.check_path_exists(DOWNLOAD_FOLDER) is False:
                task_endtime = int(time.time())
                response = CustomResponse(Status.ERR_DIR_NOT_FOUND.value, jobid, workflow_id, task_id, task_starttime, task_endtime, filename_response)
                return response.get_response()
            elif in_locale == "" or in_locale is None:
                task_endtime = int(time.time())
                response = CustomResponse(Status.ERR_locale_NOT_FOUND.value, jobid, workflow_id, task_id, task_starttime, task_endtime, filename_response)
                return response.get_response()
            elif len(file_ops.read_file(input_filename)) == 0:
                task_endtime = int(time.time())
                response = CustomResponse(Status.ERR_EMPTY_FILE.value, jobid, workflow_id, task_id, task_starttime, task_endtime, filename_response)
                return response.get_response()
            else:
                if in_locale == "en":
                    tokenisation = Tokenisation()
                    input_file_data = file_ops.read_file(input_filename)
                    output_filepath , output_en_filename = file_ops.output_path(i, DOWNLOAD_FOLDER)
                    tokenisation.eng_tokenisation(input_file_data, output_filepath)
                    file_res['output'] = output_en_filename
                elif in_locale == "hi":
                    tokenisation = Tokenisation()
                    input_file_data = file_ops.read_file(input_filename)
                    output_filepath , output_hi_filename = file_ops.output_path(i, DOWNLOAD_FOLDER)
                    tokenisation.hin_tokenisation(input_file_data, output_filepath)
                    file_res['output'] = output_hi_filename
                task_endtime = int(time.time())
        response_true = CustomResponse(Status.SUCCESS.value, jobid, workflow_id, task_id, task_starttime, task_endtime, filename_response)
        return response_true.get_response()