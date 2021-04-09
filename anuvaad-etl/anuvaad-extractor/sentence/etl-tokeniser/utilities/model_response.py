import enum

# standard error formats
class Status(enum.Enum):
    SUCCESS = {
        "status": "SUCCESS",
        "state": "SENTENCE-TOKENISED"
    }
    ERR_STATUS = {
        "status": "FAILED",
        "state": "SENTENCE-TOKENISED",
    }
    ERR_request_input_format = {
        "status" : "FAILED",
        "state" : "SENTENCE-TOKENISED",
        "code" : "REQUEST_FORMAT_ERROR",
        "message" : "Json provided by user is not in proper format."
    }


# response object
class CustomResponse():
    def __init__(self, status_code, jobid, taskid):
        self.status_code = status_code
        self.status_code['jobID'] = jobid
        self.status_code['taskID'] = taskid

    def success_response(self, workflow_id, task_start_time, task_end_time, tool_name, step_order, filename_response):
        self.status_code['workflowCode'] = workflow_id
        self.status_code['taskStarttime'] = task_start_time
        self.status_code['taskEndTime'] = task_end_time
        self.status_code['output'] = filename_response
        self.status_code['tool'] = tool_name
        self.status_code['stepOrder'] = step_order
        return self.status_code