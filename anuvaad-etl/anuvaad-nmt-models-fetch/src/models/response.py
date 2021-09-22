from flask import jsonify

class CustomResponse :
    def __init__(self, statuscode, data):
        self.statuscode = {"status":statuscode, "response_body" : data}
        self.response = {"status":statuscode, "data" : data}
        self.data_out = data
    
    def getres(self):
        return jsonify(self.statuscode)
    
    def jsonify_res(self):
        return jsonify(self.response)
    
    def jsonify_data(self):
        return jsonify(self.data_out)

    def getresjson(self):
        return self.statuscode
    
    def get_res_json(self):
        return self.response
    
    def get_res_json_data(self):
        return self.data_out
    
    @staticmethod
    def jsonify(request):
        return jsonify(request)