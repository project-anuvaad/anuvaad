from flask import jsonify
import enum
import uuid

# standard error formats
class Status(enum.Enum):
    SUCCESS = {
        "status": "SUCCESS",
        "state": "BLOCK-MERGER"
    }
    ERR_STATUS = {
        "status": "FAILED",
        "state": "BLOCK-MERGER",
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
        self.status_code['taskEndTime'] = task_end_time
        self.status_code['output'] = output_json_data
        self.status_code['tool'] = tool_name
        self.status_code['stepOrder'] = step_order
        return self.status_code


class FileResponse:
    def __init__(self,file):
        self.file= file
        self.file['pages'] = []
        self.file['page_info'] = []
        self.file['status'] = { }

    def set_page(self,page):
        self.file['pages'].append(page)

    def set_page_info(self,info):
        self.file['page_info'].append(info)

    def set_staus(self,mode):
        if mode :
            self.file['status'] = {"code": 200, "message": "word-detector successful"}
        else:
            self.file['status'] = {"code": 400, "message": "word-detector failed"}


class Page:
    def __int__(self):
        self.page = {}
        self.page['identifier'] = uuid.uuid4().hex
        self.page['vertices']   = []
        self.page['resolution'] = 0
        self.page['regions']    = []
        self.page['words']      = []
        self.page['lines']      = []


    def set_vertices(self,vertices):
        self.page['vertices'] = vertices

    def set_resolution(self,resolution):
        self.page['resolution'] = resolution

    def set_region(self, region):
        self.page['regions'].append(region)

    def set_word(self, word):
        self.page['words'].append(word)

    def set_line(self, line):
        self.page['lines'].append(line)
