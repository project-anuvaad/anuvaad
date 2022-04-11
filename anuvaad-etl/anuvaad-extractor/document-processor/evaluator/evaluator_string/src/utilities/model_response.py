from flask import jsonify
import enum
import uuid
import config
import src.utilities.app_context as app_context
from anuvaad_auditor.loghandler import log_exception


from src.utilities.request_parse import File
# standard error formats

class Status(enum.Enum):
    SUCCESS = {
        "status": "SUCCESS",
        "state": "evaluator"
    }
    ERR_STATUS = {
        "status": "FAILED",
        "state": "evaluator",
    }
    ERR_request_input_format = {
        "status" : "FAILED",
        "state" : "evaluator",
        "error": {
            "code" : "REQUEST_FORMAT_ERROR",
            "message" : "Json provided by user is not in proper format."
        }
    }



def log_error(method):
    def wrapper(*args, **kwargs):
        try:
            output = method(*args, **kwargs)
            return output
        except Exception as e:
            log_exception('Error in response generation {}'.format(e), app_context.application_context, e)
            return None
    return wrapper


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


class FileOutput(File):

    def __init__(self,file):
        File.__init__(self,file)
        self.file['pages'] = []
        self.file['page_info'] = []
        self.file['status'] = { }
    @log_error
    def set_page(self,page):
        self.file['pages'].append(page)
    @log_error
    def set_page_info(self,info):
        self.file['page_info'].append(info)


    @log_error
    def set_staus(self,mode):
        if mode :
            self.file['status'] = {"code": 200, "message": "evaluator successful"}
        else:
            self.file['status'] = {"code": 400, "message": "evaluator failed"}

