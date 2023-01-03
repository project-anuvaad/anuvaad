import enum
import config
from src.utilities.request_parse import File
import src.utilities.app_context as app_context
from anuvaad_auditor.loghandler import log_exception

# standard error formats
class Status(enum.Enum):
    SUCCESS = {
        "status": "SUCCESS",
        "state": config.TASK_STAT
    }
    ERR_STATUS = {
        "status": "FAILED",
        "state": config.TASK_STAT,
    }
    ERR_request_input_format = {
        "status" : "FAILED",
        "state" : config.TASK_STAT,
        "code" : "REQUEST_FORMAT_ERROR",
        "message" : "Json provided by user is not in proper format."
    }

def log_error(method):
    def wrapper(*args, **kwargs):
        try:
            output = method(*args, **kwargs)
            return output
        except Exception as e:
            log_exception('Error in response generation {}'.format(
                e), app_context.application_context, e)
            return None
    return wrapper

class FileOutput(File):

    def __init__(self, file):
        File.__init__(self, file)
        self.file['status'] = {}

    @log_error
    def set_staus(self, mode):
        if mode:
            self.file['status'] = {"code": 200,
                                   "message": "pre-processor successful"}
        else:
            self.file['status'] = {"code": 400,
                                   "message": "pre-processor failed"}


# response object
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