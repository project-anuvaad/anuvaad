import enum
import config
import uuid
import imagesize
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
        self.file['pages'] = []
        self.file['page_info'] = []
        self.file['status'] = {}

    @log_error
    def set_staus(self, mode):
        if mode:
            self.file['status'] = {"code": 200,
                                   "message": "pre-processor successful"}
        else:
            self.file['status'] = {"code": 400,
                                   "message": "pre-processor failed"}
    
    def set_page_info(self, info):
        self.file['page_info'].append(info)

    def set_page(self, page):
        self.file['pages'].append(page)



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

class Page:

    def __init__(self, path):
        self.path = path

        self.page = {}
        self.page['identifier'] = str(uuid.uuid4())
        self.page['boundingBox'] = {}
        self.page['resolution'] = 0
        self.page['path'] = []

        self.set_resolution()
        self.set_vertices()
        self.set_name(path)
    @log_error
    def set_vertices(self):
        width, height = imagesize.get(self.path)
        vertices = [{'x': 0, 'y': 0}, {'x': width, 'y': 0}, {
            'x': width, 'y': height}, {'x': 0, 'y': height}]
        self.page['boundingBox']['vertices'] = vertices

    @log_error
    def set_resolution(self):
        self.page['resolution'] = config.EXRACTION_RESOLUTION

    def set_name(self, path):
        self.page['path'] = path

    def get_page(self):
        return self.page
