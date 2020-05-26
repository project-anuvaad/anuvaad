from flask import jsonify
import enum

class Status(enum.Enum):
    SUCCESS = {'ok': True, 'status': {'code': 200, 
        'message' : 'Request successful, Paragraph tokenisation done successfully!!'}}
    ERR_EMPTY_FILE = {'ok': False, 
        'status': {'code': 400, 'message' : 'File empty'}}
    ERR_FILE_NOT_FOUND = {'ok': False, 
        'status': {'code': 400, 'message' : 'File not found'}}
    ERR_DIR_NOT_FOUND = {'ok': False, 
        'status': {'code': 400, 'message' : 'Upload/Download directory not found'}}
    ERR_EXT_NOT_FOUND = {'ok': False, 
        'status': {'code': 400, 'message' : 'This filetype is not allowed. Please upload .txt file.'}}

class CustomResponse():
    def __init__(self, status_code, data):
        self.status_code = status_code
        self.status_code['data'] = data

    def get_response(self):
        return jsonify(self.status_code)