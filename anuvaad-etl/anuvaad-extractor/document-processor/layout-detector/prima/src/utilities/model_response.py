from flask import jsonify
import enum
import uuid


# standard error formats
class Status(enum.Enum):
    SUCCESS = {
        "status": "SUCCESS",
        "state": "LAYOUT-DETECTOR-PRIMA"
    }
    ERR_STATUS = {
        "status": "FAILED",
        "state": "LAYOUT-DETECTOR-PRIMA",
    }
    ERR_request_input_format = {
        "status" : "FAILED",
        "state" : "LAYOUT-DETECTOR-PRIMA",
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
        self.status_code['taskStartTime'] = int(task_start_time)
        self.status_code['taskEndTime'] = task_end_time
        self.status_code['output'] = output_json_data
        self.status_code['tool'] = tool_name
        self.status_code['stepOrder'] = step_order
        return self.status_code





class Box:

    def __init__(self):
        self.box= {}
        self.box['boundingBox'] = {'vertices':[{'x':0,'y':0} ,{'x':0,'y':0},{'x':0,'y':0},{'x':0,'y':0}]}
        self.box['identifier'] = str(uuid.uuid4())
        self.box['text'] = ''
        self.box['class']  ='TEXT'
        self.box['font'] = {'family':'Arial Unicode MS', 'size':0, 'style':'REGULAR'}

    def set_class(self,region_class):
        self.box['class'] = region_class

    def set_coords(self,region):
        self.box['boundingBox']['vertices']  = [ { 'x' : region['x'] ,'y': region['y']} ,\
                                          { 'x' : region['x'] + region['w'] ,'y': region['y']}, \
                                           {'x': region['x'] + region['w'], 'y': region['y'] + region['h']}, \
                                           {'x': region['x'], 'y': region['y'] + region['h']}
                                          ]

    def get_box(self):
        return  self.box

def get_coord(bboxs):
    coord = []
    if len(bboxs) > 0:
        for bbox in bboxs:
            temp_box = []
            temp_box.append(bbox["boundingBox"]['vertices'][0]['x'])
            temp_box.append(bbox["boundingBox"]['vertices'][0]['y'])
            temp_box.append(bbox["boundingBox"]['vertices'][2]['x'])
            temp_box.append(bbox["boundingBox"]['vertices'][2]['y'])
            coord.append(temp_box)
    return coord
