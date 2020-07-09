from flask import jsonify
import enum
from utilities.utils import FileOperation 
from services.service import Html2JsonService
import config
import time
import logging
import os

log = logging.getLogger('file')
file_ops = FileOperation()

class Status(enum.Enum):
    SUCCESS = {
        "status": "SUCCESS",
        "state": "HTML-TO-JSON-PROCESSED"
    }
    ERR_EMPTY_FILE_LIST = {
        "status": "FAILED",
        "state": "HTML-TO-JSON-PROCESSING",
        "error": {
            "code" : "NO_INPUT_FILES",
            "message" : "DO not receive any input files."
        }
    }
    ERR_FILE_NOT_FOUND = {
        "status": "FAILED",
        "state": "HTML-TO-JSON-PROCESSING",
        "error": {
            "code" : "FILENAME_ERROR",
            "message" : "No Filename given in input files."
        }
    }
    ERR_DIR_NOT_FOUND = {
        "status": "FAILED",
        "state": "HTML-TO-JSON-PROCESSING",
        "error": {
            "code" : "DIRECTORY_ERROR",
            "message" : "There is no input/output Directory."
        }
    }
    ERR_EXT_NOT_FOUND = {
        "status": "FAILED",
        "state": "HTML-TO-JSON-PROCESSING",
        "error": {
            "code" : "INPUT_FILE_TYPE_ERROR",
            "message" : "This file type is not allowed. Currently, support only folder path which contains Html files."
        }
    }
    ERR_locale_NOT_FOUND = {
        "status": "FAILED",
        "state": "HTML-TO-JSON-PROCESSING",
        "error": {
            "code" : "LOCALE_ERROR",
            "message" : "No language input or unsupported language input."
        }
    }
    ERR_jobid_NOT_FOUND = {
        "status": "FAILED",
        "state": "HTML-TO-JSON-PROCESSING",
        "error": {
            "code" : "JOBID_ERROR",
            "message" : "jobID is not given."
        }
    }
    ERR_Workflow_id_NOT_FOUND = {
        "status": "FAILED",
        "state": "HTML-TO-JSON-PROCESSING",
        "error": {
            "code" : "WORKFLOWCODE_ERROR",
            "message" : "workflowCode is not given."
        }
    }
    ERR_Tool_Name_NOT_FOUND = {
        "status": "FAILED",
        "state": "HTML-TO-JSON-PROCESSING",
        "error": {
            "code" : "TOOLNAME_ERROR",
            "message" : "toolname is not given"
        }
    }
    ERR_step_order_NOT_FOUND = {
        "status": "FAILED",
        "state": "HTML-TO-JSON-PROCESSING",
        "error": {
            "code" : "STEPORDER_ERROR",
            "message" : "step order is not given"
        }
    }
    ERR_Html2json = {
        "status" : "FAILED",
        "state" : "HTML-TO-JSON-PROCESSING",
        "error": {
            "code" : "HTML2JSON_ERROR",
            "message" : "HTML2JSON failed. Something went wrong."
        }
    }
    ERR_Consumer = {
        "status" : "FAILED",
        "state" : "HTML-TO-JSON-PROCESSING",
        "error": {
            "code" : "KAFKA_CONSUMER_ERROR",
            "message" : "can not listen from consumer."
        }
    }
    ERR_Producer = {
        "status" : "FAILED",
        "state" : "HTML-TO-JSON-PROCESSING",
        "error": {
            "code" : "KAFKA_PRODUCER_ERROR",
            "message" : "No value received from consumer or Can not send message to producer."
        }
    }
    ERR_Empty_dir = {
        "status" : "FAILED",
        "state" : "HTML-TO-JSON-PROCESSING",
        "error": {
            "code" : "HTML_FILES_DIRECTORY_ERROR",
            "message" : "Html files are not in the given directory."
        }
    }
    ERR_request_input_format = {
        "status" : "FAILED",
        "state" : "HTML-TO-JSON-PROCESSING",
        "error": {
            "code" : "REQUEST_FORMAT_ERROR",
            "message" : "Json provided by user is not in proper format."
        }
    }


class CustomResponse():
    def __init__(self, status_code, jobid, workflow_id, tool_name, step_order, taskid, task_start_time, task_end_time, filename_response):
        self.status_code = status_code
        self.status_code['jobID'] = jobid
        self.status_code['taskID'] = taskid
        self.status_code['workflowCode'] = workflow_id
        self.status_code['taskStartTime'] = task_start_time
        self.status_code['taskEndTime'] = task_end_time
        self.status_code['output'] = filename_response
        self.status_code['tool'] = tool_name
        self.status_code['stepOrder'] = step_order


class CheckingResponse(object):

    def __init__(self, json_data, task_id, task_starttime, DOWNLOAD_FOLDER):
        self.json_data = json_data
        self.task_id = task_id
        self.task_starttime = task_starttime
        self.DOWNLOAD_FOLDER = DOWNLOAD_FOLDER

    def wf_keyerror(self, jobid, workflow_id, tool_name, step_order, output_file_response):
        if jobid == "" or jobid is None:
            task_endtime = str(time.time()).replace('.', '')
            response = CustomResponse(Status.ERR_jobid_NOT_FOUND.value, jobid, workflow_id, tool_name, step_order,
                                            self.task_id, self.task_starttime, task_endtime, output_file_response)
            return response
        elif workflow_id == "" or workflow_id is None:
            task_endtime = str(time.time()).replace('.', '')
            response = CustomResponse(Status.ERR_Workflow_id_NOT_FOUND.value, jobid, workflow_id, tool_name, step_order,
                                            self.task_id, self.task_starttime, task_endtime, output_file_response)
            return response
        elif tool_name == "" or tool_name is None:
            task_endtime = str(time.time()).replace('.', '')
            response = CustomResponse(Status.ERR_Tool_Name_NOT_FOUND.value, jobid, workflow_id, tool_name, step_order,
                                            self.task_id, self.task_starttime, task_endtime, output_file_response)
            return response
        elif step_order == "" or step_order is None:
            task_endtime = str(time.time()).replace('.', '')
            response = CustomResponse(Status.ERR_step_order_NOT_FOUND.value, jobid, workflow_id, tool_name, step_order,
                                            self.task_id, self.task_starttime, task_endtime, output_file_response)
            return response
        response = False
        return response

    def service_response(self, jobid, workflow_id, tool_name, step_order,input_filepath, output_file_response):
        html2json_service = Html2JsonService()
        try:
            html2json_response = html2json_service.html2json(self.DOWNLOAD_FOLDER, input_filepath) 
            return html2json_response
        except:
            task_endtime = str(time.time()).replace('.', '')
            response = CustomResponse(Status.ERR_Html2json.value, jobid, workflow_id,  tool_name, step_order,
                                            self.task_id, self.task_starttime, task_endtime, output_file_response)
            return response

    def input_file_response(self, jobid, workflow_id, tool_name, step_order, input_files, output_file_response, filename_response):
        output_filename = ""
        if len(input_files) == 0 or not isinstance(input_files, list):
            task_endtime = str(time.time()).replace('.', '')
            response = CustomResponse(Status.ERR_EMPTY_FILE_LIST.value, jobid, workflow_id, tool_name, step_order,
                                            self.task_id, self.task_starttime, task_endtime, output_file_response)
            return response
        else:
            for item in input_files:
                input_filename, input_image_folderpath, in_file_type, in_locale = file_ops.accessing_files(item)
                input_filepath = file_ops.input_path(input_filename) #with upload dir
                file_res = file_ops.one_filename_response(input_filename, input_image_folderpath, output_filename, in_locale)
                filename_response.append(file_res)
                if input_filename == "" or input_filename is None:
                    task_endtime = str(time.time()).replace('.', '')
                    response = CustomResponse(Status.ERR_FILE_NOT_FOUND.value, jobid, workflow_id, tool_name, step_order,
                                                    self.task_id, self.task_starttime, task_endtime, output_file_response)
                    return response
                elif file_ops.check_file_extension(in_file_type) is False:
                    task_endtime = str(time.time()).replace('.', '')
                    response = CustomResponse(Status.ERR_EXT_NOT_FOUND.value, jobid, workflow_id, tool_name, step_order,
                                                    self.task_id, self.task_starttime, task_endtime, output_file_response)
                    return response
                elif file_ops.check_path_exists(input_filepath) is False or file_ops.check_path_exists(self.DOWNLOAD_FOLDER) is False:
                    task_endtime = str(time.time()).replace('.', '')
                    response = CustomResponse(Status.ERR_DIR_NOT_FOUND.value, jobid, workflow_id, tool_name, step_order,
                                                    self.task_id, self.task_starttime, task_endtime, output_file_response)
                    return response
                elif in_locale == "" or in_locale is None:
                    task_endtime = str(time.time()).replace('.', '')
                    response = CustomResponse(Status.ERR_locale_NOT_FOUND.value, jobid, workflow_id, tool_name, step_order,
                                                    self.task_id, self.task_starttime, task_endtime, output_file_response)
                    return response
                elif len(os.listdir(input_filepath)) == 0:
                    task_endtime = str(time.time()).replace('.', '')
                    response = CustomResponse(Status.ERR_Empty_dir.value, jobid, workflow_id,  tool_name, step_order,
                                                    self.task_id, self.task_starttime, task_endtime, output_file_response)
                    return response
                else:
                    output_filepath = self.service_response(jobid, workflow_id, tool_name, step_order,input_filepath, output_file_response)
                    try:
                        if isinstance(output_filepath.status_code, dict):
                            return output_filepath
                    except:
                        file_res['outputHtml2JsonFilePath'] = output_filepath
        task_endtime = str(time.time()).replace('.', '')
        response_true = CustomResponse(Status.SUCCESS.value, jobid, workflow_id, tool_name, step_order, self.task_id, self.task_starttime,
                                                task_endtime, output_file_response)
        return response_true

    def only_input_file_response(self, input_files):
        output_filename = ""
        filename_response = list()
        if len(input_files) == 0 or not isinstance(input_files, list):
            response = Status.ERR_EMPTY_FILE_LIST.value
            return response
        else:
            for item in input_files:
                input_filename, input_image_folderpath, in_file_type, in_locale = file_ops.accessing_files(item)
                input_filepath = file_ops.input_path(input_filename) #with upload dir
                file_res = file_ops.one_filename_response(input_filename, input_image_folderpath, output_filename, in_locale)
                filename_response.append(file_res)
                if input_filename == "" or input_filename is None:
                    response = Status.ERR_FILE_NOT_FOUND.value
                    return response
                elif file_ops.check_file_extension(in_file_type) is False:
                    response = Status.ERR_EXT_NOT_FOUND.value
                    return response
                elif file_ops.check_path_exists(input_filepath) is False or file_ops.check_path_exists(self.DOWNLOAD_FOLDER) is False:
                    response = Status.ERR_DIR_NOT_FOUND.value
                    return response
                elif in_locale == "" or in_locale is None:
                    response = Status.ERR_locale_NOT_FOUND.value
                    return response
                elif len(os.listdir(input_filepath)) == 0:
                    response = Status.ERR_Empty_dir.value
                    return response
                else:
                    html2json_service = Html2JsonService()
                    try:
                        html2json_response = html2json_service.html2json(self.DOWNLOAD_FOLDER, input_filepath) 
                        file_res['outputHtml2JsonFilePath'] = html2json_response
                    except:
                        response = Status.ERR_Html2json.value
                        return response
            log.info("response generated from model response")
            response_true = {
                "status": "SUCCESS",
                "state": "HTML-TO-JSON-PROCESSED",
                "files" : filename_response
            }
            return response_true

    def main_response_wf(self):
        log.info("Response generation started")
        keys_checked = {'workflowCode','jobID','input','tool','stepOrder'}
        if self.json_data.keys() >= keys_checked:
            log.info("workflow request initiated.")
            input_files, workflow_id, jobid, tool_name, step_order = file_ops.input_format(self.json_data)
            filename_response = list()
            output_file_response = {"files" : filename_response}
            response_error = self.wf_keyerror(jobid, workflow_id, tool_name, step_order, output_file_response)
            if response_error is not False:
                log.error("workflow keys error")
                return response_error.status_code
            else:
                response_file = self.input_file_response(jobid, workflow_id, tool_name, step_order, input_files, output_file_response, filename_response)
                log.info("file response for wf generated")
                return response_file.status_code
        else:
            log.error("Input format is not correct")
            return Status.ERR_request_input_format.value

    def main_response_files_only(self):
        if self.json_data.keys() == {'files'}:
            log.info("request accepted")
            input_files = self.json_data['files']
            response = self.only_input_file_response(input_files)
            log.info("request processed")
            return response
        else:
            log.error("request format is not right.")
            return Status.ERR_request_input_format.value