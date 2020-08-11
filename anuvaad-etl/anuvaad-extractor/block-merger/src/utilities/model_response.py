from flask import jsonify
import enum
from src.utilities.utils import FileOperation 
import config
import time
import logging

log = logging.getLogger('file')
file_ops = FileOperation()


# standard error formats
class Status(enum.Enum):
    SUCCESS = {
        "status": "SUCCESS",
        "state": "BLOCK-MERGER"
    }
    ERR_EMPTY_FILE_LIST = {
        "status": "FAILED",
        "state": "BLOCK-MERGER",
        "error": {
            "code" : "NO_INPUT_DATA",
            "message" : "DO not receive any input files."
        }
    }
    ERR_jobid_NOT_FOUND = {
        "status": "FAILED",
        "state": "BLOCK-MERGER",
        "error": {
            "code" : "JOBID_ERROR",
            "message" : "jobID is not given."
        }
    }
    ERR_Workflow_id_NOT_FOUND = {
        "status": "FAILED",
        "state": "BLOCK-MERGER",
        "error": {
            "code" : "WORKFLOWCODE_ERROR",
            "message" : "workflowCode is not given."
        }
    }
    ERR_Tool_Name_NOT_FOUND = {
        "status": "FAILED",
        "state": "BLOCK-MERGER",
        "error": {
            "code" : "TOOLNAME_ERROR",
            "message" : "toolname is not given"
        }
    }
    ERR_step_order_NOT_FOUND = {
        "status": "FAILED",
        "state": "BLOCK-MERGER",
        "error": {
            "code" : "STEPORDER_ERROR",
            "message" : "step order is not given"
        }
    }
    ERR_block_merger = {
        "status" : "FAILED",
        "state" : "BLOCK-MERGER",
        "error": {
            "code" : "SERVICE_ERROR",
            "message" : "Merging failed. Something went wrong."
        }
    }
    ERR_Consumer = {
        "status" : "FAILED",
        "state" : "BLOCK-MERGER",
        "error": {
            "code" : "KAFKA_CONSUMER_ERROR",
            "message" : "can not listen from consumer."
        }
    }
    ERR_Producer = {
        "status" : "FAILED",
        "state" : "BLOCK-MERGER",
        "error": {
            "code" : "KAFKA_PRODUCER_ERROR",
            "message" : "No value received from consumer."
        }
    }
    ERR_request_input_format = {
        "status" : "FAILED",
        "state" : "BLOCK-MERGER",
        "error": {
            "code" : "REQUEST_FORMAT_ERROR",
            "message" : "Json provided by user is not in proper format."
        }
    }


# response object
class CustomResponse():
    def __init__(self, status_code, jobid, taskid):
        self.status_code = status_code
        self.status_code['jobID'] = jobid
        self.status_code['taskID'] = taskid

    def success_response(self, workflow_id, task_start_time, task_end_time, tool_name, step_order, output_json_data):
        self.status_code['workflowCode'] = workflow_id
        self.status_code['taskStarttime'] = task_start_time
        self.status_code['taskendTime'] = task_end_time
        self.status_code['output'] = output_json_data
        self.status_code['tool'] = tool_name
        self.status_code['stepOrder'] = step_order
        return self.status_code


# main class to generate success and error responses
class CheckingResponse(object):

    def __init__(self, json_data, task_id, task_starttime, block_merger):
        self.json_data = json_data
        self.task_id = task_id
        self.task_starttime = task_starttime
        self.block_merger = block_merger

    # workflow related key value errors
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

    # calling service function to merge the blocks
    def service_response(self, jobid, workflow_id, tool_name, step_order,input_data):
        try:
            output_data = self.block_merger.merge_blocks(input_data)
            return output_data 
        except:
            response_custom = CustomResponse(Status.ERR_block_merger.value, jobid, self.task_id)
            response_error = file_ops.error_handler(response_custom.status_code, True)
            return response_error

    # creating response for work flow requested list of input files
    def input_file_response(self, jobid, workflow_id, tool_name, step_order, input_data):
        if len(input_data) == 0 or not isinstance(input_data, list):
            response_custom = CustomResponse(Status.ERR_EMPTY_FILE_LIST.value, jobid, self.task_id)
            response_error = file_ops.error_handler(response_custom.status_code, True)
            return response_error
        else:
            output_result = self.service_response(jobid, workflow_id, tool_name, step_order,input_data)
            print(type(output_result))
            if not isinstance(output_result, list):
                if isinstance(output_result, dict):
                    return output_result
        task_endtime = str(time.time()).replace('.', '')
        response_true = CustomResponse(Status.SUCCESS.value, jobid, self.task_id)
        response_success = response_true.success_response(workflow_id, self.task_starttime, task_endtime, tool_name, step_order, output_result)
        print(response_success)
        return response_success

    # creating response for indiviual rest service list of files
    def only_input_file_response(self, input_data):
        if len(input_data) == 0 or not isinstance(input_data, list):
            response = Status.ERR_EMPTY_FILE_LIST.value
            response_error = file_ops.error_handler(response, False)
            return response_error
        else:
            try:
                output_result = self.block_merger.merge_blocks(input_data)
            except:
                response = Status.ERR_block_merger.value
                response_error = file_ops.error_handler(response, False)
            response_true = {
                "status": "SUCCESS",
                "state": "BLOCK-MERGER",
                "files" : output_result
            }
            return response_true

    # combining above functions of this class to gnerate final output that is used for both sync and async process.
    def main_response_wf(self, rest_request=False):
        log.info("Response generation started")
        keys_checked = {'workflowCode','jobID','input','tool','stepOrder'}
        if self.json_data.keys() >= keys_checked:
            log.info("workflow request initiated.")
            input_data, workflow_id, jobid, tool_name, step_order = file_ops.json_input_format(self.json_data)
            response_wfkey_error = self.wf_keyerror(jobid, workflow_id, tool_name, step_order)
            if response_wfkey_error is not False:
                log.error("workflow keys error")
                if rest_request is True:
                    return response_wfkey_error
            else:
                if rest_request is True:
                    log.info("file response generation started")
                    response_file = self.input_file_response(jobid, workflow_id, tool_name, step_order, input_data)
                    log.info("file response for wf generated")
                    return response_file
                else:
                    response_file = self.input_file_response(jobid, workflow_id, tool_name, step_order, input_data)
                    if 'errorID' in response_file.keys():
                        log.info("error returned to error queue")
                    else:
                        log.info("response for kafka queue")
                        return response_file
        else:
            log.error("Input format is not correct")
            return Status.ERR_request_input_format.value

    # individual service response based on "only_input_file_response" function.
    def main_response_files_only(self):
        if self.json_data.keys() == {'input'}:
            log.info("request accepted")
            input_data = self.json_data['input']
            response = self.only_input_file_response(input_data)
            log.info("request processed")
            return response
        else:
            log.error("request format is not right.")
            return Status.ERR_request_input_format.value