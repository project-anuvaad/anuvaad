from flask import jsonify
import enum
from utilities.utils import FileOperation 
from services.service import Html2JsonService
import config
import time
import logging

log = logging.getLogger('file')

class Status(enum.Enum):
    SUCCESS = {
        "status": "SUCCESS",
        "state": "HTML-TO-JSON-PROCESSED"
    }
    ERR_EMPTY_FILE_LIST = {
        "status": "FAILED",
        "state": "HTML-TO-JSON-PROCESSING",
        "code" : "Input file list error",
        "error": "DO not receive any input files."
    }
    ERR_FILE_NOT_FOUND = {
        "status": "FAILED",
        "state": "HTML-TO-JSON-PROCESSING",
        "code" : "File error",
        "error": "File not found."
    }
    ERR_DIR_NOT_FOUND = {
        "status": "FAILED",
        "state": "HTML-TO-JSON-PROCESSING",
        "code" : "Directory error",
        "error": "There is no input/output Directory."
    }
    ERR_EXT_NOT_FOUND = {
        "status": "FAILED",
        "state": "HTML-TO-JSON-PROCESSING",
        "code" : "File type error",
        "error": "This file type is not allowed. Currently, support only txt file."
    }
    ERR_locale_NOT_FOUND = {
        "status": "FAILED",
        "state": "HTML-TO-JSON-PROCESSING",
        "code" : "locale error",
        "error": "No language input"
    }
    ERR_jobid_NOT_FOUND = {
        "status": "FAILED",
        "state": "HTML-TO-JSON-PROCESSING",
        "code" : "jobID error",
        "error": "jobID is not given."
    }
    ERR_Workflow_id_NOT_FOUND = {
        "status": "FAILED",
        "state": "HTML-TO-JSON-PROCESSING",
        "code" : "workflowCode error",
        "error": "workflowCode is not given."
    }
    ERR_Tool_Name_NOT_FOUND = {
        "status": "FAILED",
        "state": "HTML-TO-JSON-PROCESSING",
        "code" : "Toolname error",
        "error": "toolname is not given"
    }
    ERR_step_order_NOT_FOUND = {
        "status": "FAILED",
        "state": "HTML-TO-JSON-PROCESSING",
        "code" : "step order error",
        "error": "step order is not given."
    }
    ERR_Html2json = {
        "status" : "FAILED",
        "state" : "HTML-TO-JSON-PROCESSING",
        "code" : "Html to Json error",
        "error" : "Html to Json conversion failed due to wrong entry"
    }
    ERR_Consumer = {
        "status" : "FAILED",
        "state" : "HTML-TO-JSON-PROCESSING",
        "code" : "Kafka consumer error",
        "error" : "can not listen from consumer."
    }
    ERR_Producer = {
        "status" : "FAILED",
        "state" : "HTML-TO-JSON-PROCESSING",
        "code" : "Kafka consumer error",
        "error" : "error occured while listening message from consumer or flushing data to another queue"
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
        return response
    elif workflow_id == "" or workflow_id is None:
        task_endtime = str(time.time()).replace('.', '')
        response = CustomResponse(Status.ERR_Workflow_id_NOT_FOUND.value, jobid, workflow_id, tool_name, step_order, task_id, task_starttime, task_endtime, output_file_response)
        return response
    elif tool_name == "" or tool_name is None:
        task_endtime = str(time.time()).replace('.', '')
        response = CustomResponse(Status.ERR_Tool_Name_NOT_FOUND.value, jobid, workflow_id, tool_name, step_order, task_id, task_starttime, task_endtime, output_file_response)
        return response
    elif step_order == "" or step_order is None:
        task_endtime = str(time.time()).replace('.', '')
        response = CustomResponse(Status.ERR_step_order_NOT_FOUND.value, jobid, workflow_id, tool_name, step_order, task_id, task_starttime, task_endtime, output_file_response)
        return response
    else:
        for item in input_files:
            input_filename, in_file_type, in_locale = file_ops.accessing_files(item)
            input_filepath = file_ops.input_path(input_filename) #
            file_res = file_ops.one_filename_response(input_filename, output_filename, in_locale)
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
                html2json_service = Html2JsonService()
                try:
                    html2json_response = html2json_service.html2json(DOWNLOAD_FOLDER, input_filepath) 
                    file_res['outputHtmlFilePath'] = html2json_response
                except:
                        task_endtime = str(time.time()).replace('.', '')
                        response = CustomResponse(Status.ERR_Html2json.value, jobid, workflow_id,  tool_name, step_order, task_id, task_starttime, task_endtime, output_file_response)
                        return response
                task_endtime = str(time.time()).replace('.', '')
        response_true = CustomResponse(Status.SUCCESS.value, jobid, workflow_id,  tool_name, step_order, task_id, task_starttime, task_endtime, output_file_response)
        log.info("response generated from model response")
        return response_true