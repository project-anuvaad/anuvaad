from flask import jsonify
import enum
import uuid
import copy
import lzma
from base64 import b64encode
# standard error formats
class Status(enum.Enum):
    SUCCESS = {
        "status": "SUCCESS",
        "state": 'GOOGLE-VISION-OCR-15'
    }
    ERR_STATUS = {
        "status": "FAILED",
        "state": 'GOOGLE-VISION-OCR-15',
    }
    ERR_request_input_format = {
        "status" : "FAILED",
        "state" : 'GOOGLE-VISION-OCR-15',
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


def set_bg_image(page_data,bg_image_path,page_index,file):
    bg_dic ={}
    id1 = str(uuid.uuid4())
    bg_dic['class']  = 'BGIMAGE'
    if file['schema'] != "LEGACY": 
        if bg_image_path != None:
            with open(bg_image_path,'rb') as datax:
                data = b64encode(lzma.compress(datax.read()))
        else:
            data = None
        if file['schema'] == "COMMON":
            bg_dic['id'] = id1
            bg_dic['info'] = copy.deepcopy(file['pages'][page_index]['info'])
            del bg_dic['info']['no']
            bg_dic['img'] = {
                "data": data.decode(),
                "type": None,
                "path": bg_image_path,
            }
        elif file['schema'] == "TRANSLATION":
            bg_dic['id'] = id1
            bg_dic['img'] = {
                "data": data.decode(),
                "type": None,
                "path": bg_image_path,
                # "height": None,
                # "width": None,
            }
    else:
        bg_dic['identifier'] = id1
        bg_dic['boundingBox'] = {'vertices' : copy.deepcopy(file['pages'][page_index]['boundingBox']['vertices'])}
        bg_dic['base64'] = "null"
        bg_dic['data']  = bg_image_path
    page_data.insert(0,bg_dic)
    return page_data

