"""
 * @author ['aroop']
 * @email ['aroop.ghosh@tarento.com']
 * @create date 2019-06-25 12:40:01
 * @modify date 2019-06-25 12:40:01
 * @desc [description]
 """
 
from flask import jsonify

class CustomResponse :
    def __init__(self, statuscode, data):
        self.statuscode = statuscode
        self.statuscode['data'] = data
    
    def getres(self):
        return jsonify(self.statuscode)

    def getresjson(self):
        return self.statuscode
