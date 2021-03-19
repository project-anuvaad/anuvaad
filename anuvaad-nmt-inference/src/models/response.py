from flask import jsonify

class CustomResponse :
    def __init__(self, statuscode, data):
        self.statuscode = {"status":statuscode, "response_body" : data}
        self.response = {"status":statuscode, "data" : data}
    
    def getres(self):
        return jsonify(self.statuscode)
    
    def jsonify_res(self):
        return jsonify(self.response)

    def getresjson(self):
        return self.statuscode
    
    def get_res_json(self):
        return self.response
    
    @staticmethod
    def jsonify(request):
        return jsonify(request)