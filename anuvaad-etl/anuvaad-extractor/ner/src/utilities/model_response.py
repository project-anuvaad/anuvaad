from flask import jsonify
import enum
from src.utilities.utils import FileOperation 
import config
from src.services.service import Annotation
import time
import logging

class Status(enum.Enum):
    SUCCESS = {
        "status": "SUCCESS",
        "state": "NER PROCESSED"
    }
    ERR_EMPTY_FILE = {
        "status": "FAILED",
        "state": "NER PROCESSING",
        "error": {
            "code" : "EMPTY_FILE",
            "message" : "File do not have any content"
        }
    }
    ERR_EMPTY_FILE_LIST = {
        "status": "FAILED",
        "state": "NER PROCESSING",
        "error": {
            "code" : "NO_INPUT_FILES",
            "message" : "DO not receive any input files."
        }
    }
    ERR_FILE_NOT_FOUND = {
        "status": "FAILED",
        "state": "NER PROCESSING",
        "error": {
            "code" : "FILENAME_ERROR",
            "message" : "No Filename given in input files."
        }
    }
    ERR_DIR_NOT_FOUND = {
        "status": "FAILED",
        "state": "NER PROCESSING",
        "error": {
            "code" : "DIRECTORY_ERROR",
            "message" : "There is no input/output Directory."
        }
    }
    ERR_EXT_NOT_FOUND = {
        "status": "FAILED",
        "state": "NER PROCESSING",
        "error": {
            "code" : "FILE_TYPE_ERROR",
            "message" : "This file type is not allowed. Currently, support only txt file."
        }
    }
    ERR_locale_NOT_FOUND = {
        "status": "FAILED",
        "state": "NER PROCESSING",
        "error": {
            "code" : "LOCALE_ERROR",
            "message" : "No language input or unsupported language input."
        }
    }
    ERR_jobid_NOT_FOUND = {
        "status": "FAILED",
        "state": "NER PROCESSING",
        "error": {
            "code" : "JOBID_ERROR",
            "message" : "jobID is not given."
        }
    }
    ERR_Workflow_id_NOT_FOUND = {
        "status": "FAILED",
        "state": "NER PROCESSING",
        "error": {
            "code" : "WORKFLOWCODE_ERROR",
            "message" : "workflowCode is not given."
        }
    }
    ERR_Tool_Name_NOT_FOUND = {
        "status": "FAILED",
        "state": "NER PROCESSING",
        "error": {
            "code" : "TOOLNAME_ERROR",
            "message" : "toolname is not given"
        }
    }
    ERR_step_order_NOT_FOUND = {
        "status": "FAILED",
        "state": "NER PROCESSING",
        "error": {
            "code" : "STEPORDER_ERROR",
            "message" : "step order is not given"
        }
    }
    ERR_NER_annotation = {
        "status" : "FAILED",
        "state" : "NER PROCESSING",
        "error": {
            "code" : "NER_ERROR",
            "message" : "NER failed. Something went wrong."
        }
    }
    ERR_file_encodng = {
        "status" : "FAILED",
        "state" : "NER PROCESSING",
        "error": {
            "code" : "ENCODING_ERROR",
            "message" : "NER failed due to encoding. Service supports only utf-16 encoded file."
        }
    }
    ERR_Consumer = {
        "status" : "FAILED",
        "state" : "NER PROCESSING",
        "error": {
            "code" : "KAFKA_CONSUMER_ERROR",
            "message" : "can not listen from consumer."
        }
    }
    ERR_Producer = {
        "status" : "FAILED",
        "state" : "NER PROCESSING",
        "error": {
            "code" : "KAFKA_PRODUCER_ERROR",
            "message" : "No value received from consumer."
        }
    }

class CustomResponse():
    def __init__(self, status_code, jobid, workflow_id, tool_name, step_order, taskid, task_start_time, task_end_time, filename_response):
        self.status_code = status_code
        self.status_code['jobID'] = jobid
        self.status_code['taskID'] = taskid
        self.status_code['workflowCode'] = workflow_id
        self.status_code['taskStarttime'] = task_start_time
        self.status_code['taskendTime'] = task_end_time
        self.status_code['output'] = filename_response
        self.status_code['tool'] = tool_name
        self.status_code['stepOrder'] = step_order

    def get_response(self):
        return jsonify(self.status_code)

log = logging.getLogger('file')

def checking_file_response(jobid, workflow_id, tool_name, step_order, task_id, task_starttime, input_files, DOWNLOAD_FOLDER):
    file_ops = FileOperation()
    output_filename = ""
    filename_response = list()
    output_file_response = {"files" : filename_response}
    if len(input_files) == 0 or not isinstance(input_files, list):
        task_endtime = str(time.time()).replace('.', '')
        response = CustomResponse(Status.ERR_EMPTY_FILE_LIST.value, jobid, workflow_id, tool_name, step_order, task_id, task_starttime, task_endtime, output_file_response)
        return response
    elif jobid == "" or jobid is None:
        task_endtime = str(time.time()).replace('.', '')
        response = CustomResponse(Status.ERR_jobid_NOT_FOUND.value, jobid, workflow_id, tool_name, step_order, task_id, task_starttime, task_endtime, output_file_response)
        return response.get_response()
    elif workflow_id == "" or workflow_id is None:
        task_endtime = str(time.time()).replace('.', '')
        response = CustomResponse(Status.ERR_Workflow_id_NOT_FOUND.value, jobid, workflow_id, tool_name, step_order, task_id, task_starttime, task_endtime, output_file_response)
        return response.get_response()
    elif tool_name == "" or tool_name is None:
        task_endtime = str(time.time()).replace('.', '')
        response = CustomResponse(Status.ERR_Tool_Name_NOT_FOUND.value, jobid, workflow_id, tool_name, step_order, task_id, task_starttime, task_endtime, output_file_response)
        return response.get_response()
    elif step_order == "" or step_order is None:
        task_endtime = str(time.time()).replace('.', '')
        response = CustomResponse(Status.ERR_step_order_NOT_FOUND.value, jobid, workflow_id, tool_name, step_order, task_id, task_starttime, task_endtime, output_file_response)
        return response.get_response()
    else:
        for i, item in enumerate(input_files):
            input_filename, in_file_type, in_locale = file_ops.accessing_files(item)
            input_filepath = file_ops.input_path(input_filename) 
            file_res = file_ops.one_filename_response(input_filename, output_filename)
            filename_response.append(file_res)
            if input_filename == "" or input_filename is None:
                task_endtime = str(time.time()).replace('.', '')
                response = CustomResponse(Status.ERR_FILE_NOT_FOUND.value, jobid, workflow_id, tool_name, step_order, task_id, task_starttime, task_endtime, output_file_response)
                return response
            elif file_ops.check_file_extension(in_file_type) is False:
                task_endtime = str(time.time()).replace('.', '')
                response = CustomResponse(Status.ERR_EXT_NOT_FOUND.value, jobid, workflow_id, tool_name, step_order, task_id, task_starttime, task_endtime, output_file_response)
                return response
            elif file_ops.check_path_exists(input_filepath) is False or file_ops.check_path_exists(DOWNLOAD_FOLDER) is False:
                task_endtime = str(time.time()).replace('.', '')
                response = CustomResponse(Status.ERR_DIR_NOT_FOUND.value, jobid, workflow_id, tool_name, step_order, task_id, task_starttime, task_endtime, output_file_response)
                return response
            elif in_locale == "" or in_locale is None:
                task_endtime = str(time.time()).replace('.', '')
                response = CustomResponse(Status.ERR_locale_NOT_FOUND.value, jobid, workflow_id,  tool_name, step_order, task_id, task_starttime, task_endtime, output_file_response)
                return response
            else:
                try:
                    input_file_data = file_ops.read_file(input_filename)
                    if len(input_file_data) == 0:
                        task_endtime = str(time.time()).replace('.', '')
                        response = CustomResponse(Status.ERR_EMPTY_FILE.value, jobid, workflow_id,  tool_name, step_order, task_id, task_starttime, task_endtime, output_file_response)
                        return response
                except Exception as e:
                    log.error("service supports only utf-16 encoded file. %s"%e)
                    task_endtime = str(time.time()).replace('.', '')
                    response = CustomResponse(Status.ERR_file_encodng.value, jobid, workflow_id, tool_name, step_order, task_id, task_starttime, task_endtime, output_file_response)
                    return response
                try:
                    annotation = Annotation()
                    if in_locale == "en":
                        input_file_data = file_ops.read_file(input_filename)
                        output_filepath , output_en_filename = file_ops.output_path(i, DOWNLOAD_FOLDER)
                        annotation.storing_tagged_data(input_file_data, output_filepath)
                        file_res['output'] = output_en_filename
                    elif in_locale == "hi":
                        file_res['output'] = "Hindi NER facility is not available right now."
                    task_endtime = str(time.time()).replace('.', '')
                except:
                    task_endtime = str(time.time()).replace('.', '')
                    response = CustomResponse(Status.ERR_NER_annotation.value, jobid, workflow_id,  tool_name, step_order, task_id, task_starttime, task_endtime, output_file_response)
                    return response
        response_true = CustomResponse(Status.SUCCESS.value, jobid, workflow_id,  tool_name, step_order, task_id, task_starttime, task_endtime, output_file_response)
        log.info("response generated")
        return response_true