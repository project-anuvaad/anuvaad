from flask import jsonify
import enum


# standard error formats
class Status(enum.Enum):
    SUCCESS = {
        "status": "SUCCESS",
        "state": "BLOCK-SEGMENTER"
    }
    ERR_STATUS = {
        "status": "FAILED",
        "state": "BLOCK-SEGMENTER",
    }
    ERR_request_input_format = {
        "status" : "FAILED",
        "state" : "BLOCK-SEGMENTER",
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
        self.status_code['taskEndTime'] = task_end_time
        self.status_code['output'] = output_json_data
        self.status_code['tool'] = tool_name
        self.status_code['stepOrder'] = step_order
        return self.status_code