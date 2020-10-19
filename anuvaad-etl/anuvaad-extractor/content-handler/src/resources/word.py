from flask_restful import fields, marshal_with, reqparse, Resource
from repositories import WordRepo
from models import CustomResponse, Status
from utilities import AppContext
from anuvaad_auditor.loghandler import log_info, log_exception
from flask import request

wordRepo = WordRepo()

class WordSaveResource(Resource):
    def post(self):
        body        = request.json
        user_id     = request.headers.get('userid')

        log_info('received request for WordSaveResource', AppContext.getContext())
        if 'words' not in body or user_id == None:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400

        if wordRepo.store(body['words']) == False:
            res = CustomResponse(Status.ERR_SCHEMA_VALIDATION.value, None)
            return res.getresjson(), 400
        
        res = CustomResponse(Status.SUCCESS.value, None)
        return res.getres()
