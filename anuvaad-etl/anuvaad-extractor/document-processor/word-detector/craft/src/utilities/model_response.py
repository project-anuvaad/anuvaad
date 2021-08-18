from flask import jsonify
import enum
import uuid
import config
import imagesize
import src.utilities.app_context as app_context
from anuvaad_auditor.loghandler import log_exception


from src.utilities.request_parse import File
# standard error formats

class Status(enum.Enum):
    SUCCESS = {
        "status": "SUCCESS",
        "state": "WORD-DETECTOR-CRAFT"
    }
    ERR_STATUS = {
        "status": "FAILED",
        "state": "WORD-DETECTOR-CRAFT",
    }
    ERR_request_input_format = {
        "status" : "FAILED",
        "state" : "WORD-DETECTOR-CRAFT",
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
            self.file['status'] = {"code": 200, "message": "word-detector successful"}
        else:
            self.file['status'] = {"code": 400, "message": "word-detector failed"}


class Page:

    def __init__(self,words,lines,path):
        self.words = words
        self.lines = lines
        self.path  = path

        self.page = {}
        self.page['identifier'] = str( uuid.uuid4())
        self.page['boundingBox']   = {}
        self.page['resolution'] = 0
        self.page['regions']    = []
        self.page['words']      = []
        self.page['lines']      = []

        self.set_resolution()
        self.set_vertices()
        self.set_words()
        self.set_lines()

    @log_error
    def set_vertices(self):
        width, height = imagesize.get(self.path)
        vertices = [ {'x':0 ,'y':0},{'x':width ,'y':0},{'x':width ,'y':height},{'x':0,'y':height}]
        self.page['boundingBox']['vertices'] = vertices

    @log_error
    def set_resolution(self):
        self.page['resolution'] = config.EXRACTION_RESOLUTION

    @log_error
    def set_words(self):
        if len(self.words) > 0 :
            for index,  word_corrd in self.words.iterrows():
                word = Box(word_corrd)
                word.set_size(word_corrd['y4'] - word_corrd['y1'])
                self.page['words'].append(word.get_box())

    @log_error
    def set_lines(self):
        if len(self.lines) > 0 :
            if type(self.lines) is not list :
                for index, line_corrd in self.lines.iterrows():
                    line = Box(line_corrd)
                    line.set_size(line_corrd['y4'] - line_corrd['y1'])
                    self.page['lines'].append(line.get_box())
            else :
                self.page['lines'] = self.lines


    def get_page(self):
        return self.page


class Box:

    def __init__(self,coordinates):
        self.coords = coordinates
        self.box= {}
        self.box['boundingBox'] = {}
        self.box['identifier'] = str(uuid.uuid4())
        self.box['text'] = ''
        self.box['class']  ='TEXT'
        self.box['font'] = {'family':'Arial Unicode MS', 'size':0, 'style':'REGULAR'}
        self.get_coords()

    @log_error
    def get_coords(self):
        vertices = [{'x': self.coords['x1'], 'y': self.coords['y1']}, \
                    {'x': self.coords['x2'], 'y': self.coords['y2']},\
                    {'x': self.coords['x3'], 'y': self.coords['y3']},\
                    {'x': self.coords['x4'], 'y': self.coords['y4']},]
        self.box['boundingBox']['vertices'] = vertices

    @log_error
    def set_size(self,height):
        self.box['font']['size'] = height

    @log_error
    def set_class(self,text_class):
        self.box['class'] = text_class

    @log_error
    def set_style(self,style):
        self.box['font']['style'] = style

    def get_box(self):
        return self.box



