from flask import jsonify

class CustomResponse :
    def __init__(self, statuscode, data):
        self.statuscode = {"status":statuscode, "data" : data}
    
    def getres(self):
        return jsonify(self.statuscode)

    def getresjson(self):
        return self.statuscode
    
    @staticmethod
    def jsonify(request):
        return jsonify(request)