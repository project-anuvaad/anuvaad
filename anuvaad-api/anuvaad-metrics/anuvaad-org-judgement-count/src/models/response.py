from flask import jsonify


class CustomResponse:

    def __init__(self, statuscode, data):
        self.statuscode = statuscode
        self.statuscode['data'] = data

    def getres(self):
        return jsonify(self.statuscode), self.statuscode['status']