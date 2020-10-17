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

        log_info('received request for WordSaveResource', AppContext.getContext())
        if 'words' not in body:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400

        result = wordRepo.store(body['words'])
        if result == False:
            res = CustomResponse(Status.ERR_SCHEMA_VALIDATION.value, None)
            return res.getresjson(), 400
        
        res = CustomResponse(Status.SUCCESS.value, None)
        return res.getres()


class WordSearch(Resource):
    def post(self):
        body        = request.json

        log_info('received request for WordSearch', AppContext.getContext())
        if 'word' not in body or 'locale' not in body:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400

        result = None
        if body['locale'] == 'en':
            result = wordRepo.search_english(body['word'])
        else:
            result = wordRepo.search_vernacular(body['word'], body['locale'])

        if result == None:
            res = CustomResponse(Status.SUCCESS.value, None)
            return res.getres()
        
        res = CustomResponse(Status.SUCCESS.value, result)
        return res.getres()