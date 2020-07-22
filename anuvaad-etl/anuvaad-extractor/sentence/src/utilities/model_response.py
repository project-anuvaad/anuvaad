from flask import jsonify
import enum
from src.utilities.utils import FileOperation 
import config
from src.services.service import Tokenisation
import time
import logging

log = logging.getLogger('file')
file_ops = FileOperation()


class Status(enum.Enum):
    SUCCESS = {
        "status": "SUCCESS",
        "state": "SENTENCE-TOKENISED"
    }
    ERR_EMPTY_FILE = {
        "status": "FAILED",
        "state": "SENTENCE-TOKENISED",
        "error": {
            "code" : "EMPTY_FILE",
            "message" : "File do not have any content"
        }
    }
    ERR_EMPTY_FILE_LIST = {
        "status": "FAILED",
        "state": "SENTENCE-TOKENISED",
        "error": {
            "code" : "NO_INPUT_FILES",
            "message" : "DO not receive any input files."
        }
    }
    ERR_FILE_NOT_FOUND = {
        "status": "FAILED",
        "state": "SENTENCE-TOKENISED",
        "error": {
            "code" : "FILENAME_ERROR",
            "message" : "No Filename given in input files."
        }
    }
    ERR_DIR_NOT_FOUND = {
        "status": "FAILED",
        "state": "SENTENCE-TOKENISED",
        "error": {
            "code" : "DIRECTORY_ERROR",
            "message" : "There is no input/output Directory."
        }
    }
    ERR_EXT_NOT_FOUND = {
        "status": "FAILED",
        "state": "SENTENCE-TOKENISED",
        "error": {
            "code" : "FILE_TYPE_ERROR",
            "message" : "This file type is not allowed. Currently, support only txt file."
        }
    }
    ERR_locale_NOT_FOUND = {
        "status": "FAILED",
        "state": "SENTENCE-TOKENISED",
        "error": {
            "code" : "LOCALE_ERROR",
            "message" : "No language input or unsupported language input."
        }
    }
    ERR_jobid_NOT_FOUND = {
        "status": "FAILED",
        "state": "SENTENCE-TOKENISED",
        "error": {
            "code" : "JOBID_ERROR",
            "message" : "jobID is not given."
        }
    }
    ERR_Workflow_id_NOT_FOUND = {
        "status": "FAILED",
        "state": "SENTENCE-TOKENISED",
        "error": {
            "code" : "WORKFLOWCODE_ERROR",
            "message" : "workflowCode is not given."
        }
    }
    ERR_Tool_Name_NOT_FOUND = {
        "status": "FAILED",
        "state": "SENTENCE-TOKENISED",
        "error": {
            "code" : "TOOLNAME_ERROR",
            "message" : "toolname is not given"
        }
    }
    ERR_step_order_NOT_FOUND = {
        "status": "FAILED",
        "state": "SENTENCE-TOKENISED",
        "error": {
            "code" : "STEPORDER_ERROR",
            "message" : "step order is not given"
        }
    }
    ERR_tokenisation = {
        "status" : "FAILED",
        "state" : "SENTENCE-TOKENISED",
        "error": {
            "code" : "TOKENISATION_ERROR",
            "message" : "Tokenisation failed. Something went wrong."
        }
    }
    ERR_file_encodng = {
        "status" : "FAILED",
        "state" : "SENTENCE-TOKENISED",
        "error": {
            "code" : "ENCODING_ERROR",
            "message" : "Tokenisation failed due to encoding. Service supports only utf-16 encoded file."
        }
    }
    ERR_Consumer = {
        "status" : "FAILED",
        "state" : "SENTENCE-TOKENISED",
        "error": {
            "code" : "KAFKA_CONSUMER_ERROR",
            "message" : "can not listen from consumer."
        }
    }
    ERR_Producer = {
        "status" : "FAILED",
        "state" : "SENTENCE-TOKENISED",
        "error": {
            "code" : "KAFKA_PRODUCER_ERROR",
            "message" : "No value received from consumer."
        }
    }
    ERR_request_input_format = {
        "status" : "FAILED",
        "state" : "SENTENCE-TOKENISED",
        "error": {
            "code" : "REQUEST_FORMAT_ERROR",
            "message" : "Json provided by user is not in proper format."
        }
    }


class CustomResponse():
    def __init__(self, status_code, jobid, taskid):
        self.status_code = status_code
        self.status_code['jobID'] = jobid
        self.status_code['taskID'] = taskid

    def success_response(self, workflow_id, task_start_time, task_end_time, tool_name, step_order, filename_response):
        self.status_code['workflowCode'] = workflow_id
        self.status_code['taskStarttime'] = task_start_time
        self.status_code['taskendTime'] = task_end_time
        self.status_code['output'] = filename_response
        self.status_code['tool'] = tool_name
        self.status_code['stepOrder'] = step_order
        return self.status_code


class CheckingResponse(object):

    def __init__(self, json_data, task_id, task_starttime, DOWNLOAD_FOLDER):
        self.json_data = json_data
        self.task_id = task_id
        self.task_starttime = task_starttime
        self.DOWNLOAD_FOLDER = DOWNLOAD_FOLDER

    def wf_keyerror(self, jobid, workflow_id, tool_name, step_order):
        if jobid == "" or jobid is None:
            response_custom = CustomResponse(Status.ERR_jobid_NOT_FOUND.value, jobid, self.task_id)
            response = file_ops.error_handler(response_custom.status_code, True)
            return response
        elif workflow_id == "" or workflow_id is None:
            response_custom = CustomResponse(Status.ERR_Workflow_id_NOT_FOUND.value, jobid, self.task_id)
            response = file_ops.error_handler(response_custom.status_code, True)
            return response
        elif tool_name == "" or tool_name is None:
            response_custom = CustomResponse(Status.ERR_Tool_Name_NOT_FOUND.value, jobid, self.task_id)
            response = file_ops.error_handler(response_custom.status_code, True)
            return response
        elif step_order == "" or step_order is None:
            response_custom = CustomResponse(Status.ERR_step_order_NOT_FOUND.value, jobid, self.task_id)
            response = file_ops.error_handler(response_custom.status_code, True)
            return response
        response = False
        return response

    def file_encoding_error(self, jobid, workflow_id, tool_name, step_order, input_filename, output_file_response):
        try:
            input_file_data = file_ops.read_file(input_filename)
            if len(input_file_data) == 0:
                response_custom = CustomResponse(Status.ERR_EMPTY_FILE.value, jobid, self.task_id)
                response_error = file_ops.error_handler(response_custom.status_code, True)
                return response_error
        except Exception as e:
            log.error("service supports only utf-16 encoded file. %s"%e)
            response_custom = CustomResponse(Status.ERR_file_encodng.value, jobid, self.task_id)
            response_error = file_ops.error_handler(response_custom.status_code, True)
            return response_error
        return input_file_data

    def service_response(self, jobid, workflow_id, tool_name, step_order,input_filename, in_locale, output_file_response, index):
        tokenisation = Tokenisation()
        response_input_file_data = self.file_encoding_error(jobid, workflow_id, tool_name, step_order, input_filename, output_file_response)
        if isinstance(response_input_file_data, list):
            if in_locale == "en":
                try:
                    output_filepath , output_en_filename = file_ops.output_path(index, self.DOWNLOAD_FOLDER)
                    tokenisation.eng_tokenisation(response_input_file_data, output_filepath)
                    return output_en_filename 
                except:
                    response_custom = CustomResponse(Status.ERR_tokenisation.value, jobid, self.task_id)
                    response_error = file_ops.error_handler(response_custom.status_code, True)
                    return response_error
            elif in_locale == "hi":
                try:
                    output_filepath , output_hi_filename = file_ops.output_path(index, DOWNLOAD_FOLDER)
                    tokenisation.hin_tokenisation(response_input_file_data, output_filepath)
                    return output_hi_filename
                except:
                    response_custom = CustomResponse(Status.ERR_tokenisation.value, jobid, self.task_id)
                    response_error = file_ops.error_handler(response_custom.status_code, True)
                    return response_error
        else:
            return response_input_file_data

    def input_file_response(self, jobid, workflow_id, tool_name, step_order, input_files, output_file_response, filename_response):
        output_filename = ""
        if len(input_files) == 0 or not isinstance(input_files, list):
            response_custom = CustomResponse(Status.ERR_EMPTY_FILE_LIST.value, jobid, self.task_id)
            response_error = file_ops.error_handler(response_custom.status_code, True)
            return response_error
        else:
            for i, item in enumerate(input_files):
                input_filename, in_file_type, in_locale = file_ops.accessing_files(item)
                input_filepath = file_ops.input_path(input_filename) #
                file_res = file_ops.one_filename_response(input_filename, output_filename, in_locale, in_file_type)
                filename_response.append(file_res)
                if input_filename == "" or input_filename is None:
                    response_custom = CustomResponse(Status.ERR_FILE_NOT_FOUND.value, jobid, self.task_id)
                    response_error = file_ops.error_handler(response_custom.status_code, True)
                    return response_error
                elif file_ops.check_file_extension(in_file_type) is False:
                    response_custom = CustomResponse(Status.ERR_EXT_NOT_FOUND.value, jobid, self.task_id)
                    response_error = file_ops.error_handler(response_custom.status_code, True)
                    return response_error
                elif file_ops.check_path_exists(input_filepath) is False or file_ops.check_path_exists(self.DOWNLOAD_FOLDER) is False:
                    response_custom = CustomResponse(Status.ERR_DIR_NOT_FOUND.value, jobid, self.task_id)
                    response_error = file_ops.error_handler(response_custom.status_code, True)
                    return response_error
                elif in_locale == "" or in_locale is None:
                    response_custom = CustomResponse(Status.ERR_locale_NOT_FOUND.value, jobid, self.task_id)
                    response_error = file_ops.error_handler(response_custom.status_code, True)
                    return response_error
                else:
                    output_filename = self.service_response(jobid, workflow_id, tool_name, step_order,input_filename, in_locale, output_file_response, i)
                    if not isinstance(output_filename, str):
                        if isinstance(output_filename, dict):
                            return output_filename
                    else:
                        file_res['outputFile'] = output_filename
        task_endtime = str(time.time()).replace('.', '')
        response_true = CustomResponse(Status.SUCCESS.value, jobid, self.task_id)
        response_success = response_true.success_response(workflow_id, self.task_starttime, task_endtime, tool_name, step_order, filename_response)
        return response_success

    def only_input_file_response(self, input_files):
        output_filename = ""
        filename_response = list()
        if len(input_files) == 0 or not isinstance(input_files, list):
            response = Status.ERR_EMPTY_FILE_LIST.value
            response_error = file_ops.error_handler(response, False)
            return response_error
        else:
            for i, item in enumerate(input_files):
                input_filename, in_file_type, in_locale = file_ops.accessing_files(item)
                input_filepath = file_ops.input_path(input_filename) #
                file_res = file_ops.one_filename_response(input_filename, output_filename, in_locale, in_file_type)
                filename_response.append(file_res)
                if input_filename == "" or input_filename is None:
                    response = Status.ERR_FILE_NOT_FOUND.value
                    response_error = file_ops.error_handler(response, False)
                    return response_error
                elif file_ops.check_file_extension(in_file_type) is False:
                    response = Status.ERR_EXT_NOT_FOUND.value
                    response_error = file_ops.error_handler(response, False)
                    return response_error
                elif file_ops.check_path_exists(input_filepath) is False or file_ops.check_path_exists(self.DOWNLOAD_FOLDER) is False:
                    response = Status.ERR_DIR_NOT_FOUND.value
                    response_error = file_ops.error_handler(response, False)
                    return response_error
                elif in_locale == "" or in_locale is None:
                    response = Status.ERR_locale_NOT_FOUND.value
                    response_error = file_ops.error_handler(response, False)
                    return response_error
                else:
                    try:
                        input_file_data = file_ops.read_file(input_filename)
                        if len(input_file_data) == 0:
                            response = Status.ERR_EMPTY_FILE.value
                            response_error = file_ops.error_handler(response, False)
                            return response_error
                    except Exception as e:
                        log.error("service supports only utf-16 encoded file. %s"%e)
                        response = Status.ERR_file_encodng.value
                        response_error = file_ops.error_handler(response, False)
                        return response_error
                    tokenisation = Tokenisation()
                    if in_locale == "en":
                        try:
                            output_filepath , output_en_filename = file_ops.output_path(i, self.DOWNLOAD_FOLDER)
                            tokenisation.eng_tokenisation(input_file_data, output_filepath)
                            file_res['outputFile'] = output_en_filename
                        except:
                            log.error("tokenisation failed")
                            response = Status.ERR_tokenisation.value
                            response_error = file_ops.error_handler(response, False)
                            return response_error
                    elif in_locale == "hi":
                        try:
                            output_filepath , output_hi_filename = file_ops.output_path(i, DOWNLOAD_FOLDER)
                            tokenisation.hin_tokenisation(input_file_data, output_filepath)
                            file_res['outputFile'] = output_hi_filename
                        except:
                            log.error("tokenisation failed")
                            response = Status.ERR_tokenisation.value
                            response_error = file_ops.error_handler(response, False)
                            return response_error
            response_true = {
                "status": "SUCCESS",
                "state": "SENTENCE-TOKENISED",
                "files" : filename_response
            }
            return response_true

    def main_response_wf(self, rest_request=False):
        log.info("Response generation started")
        keys_checked = {'workflowCode','jobID','input','tool','stepOrder'}
        if self.json_data.keys() >= keys_checked:
            log.info("workflow request initiated.")
            input_files, workflow_id, jobid, tool_name, step_order = file_ops.json_input_format(self.json_data)
            filename_response = list()
            output_file_response = {"files" : filename_response}
            response_wfkey_error = self.wf_keyerror(jobid, workflow_id, tool_name, step_order)
            if response_wfkey_error is not False:
                log.error("workflow keys error")
                if rest_request is True:
                    return response_wfkey_error
            else:
                if rest_request is True:
                    log.info("file response generation started")
                    response_file = self.input_file_response(jobid, workflow_id, tool_name, step_order, input_files, output_file_response, filename_response)
                    log.info("file response for wf generated")
                    return response_file
                else:
                    response_file = self.input_file_response(jobid, workflow_id, tool_name, step_order, input_files, output_file_response, filename_response)
                    if 'errorID' in response_file.keys():
                        log.info("error returned to error queue")
                    else:
                        log.info("response for kafka queue")
                        return response_file
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