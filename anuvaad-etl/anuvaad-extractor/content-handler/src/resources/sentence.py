from flask_restful import fields, marshal_with, reqparse, Resource
from repositories import SentenceRepositories
from models import CustomResponse, Status
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
from flask import request

class FetchSentenceResource(Resource):
    def post(self):
        body        = request.get_json()
        user_id     = request.headers.get('userid')
        s_ids       = None
        if 'sentences' in body:
            s_ids       = body['sentences']

        if user_id is None or s_ids is None:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400

        log_info("FetchSentenceResource s_ids {} for user {}".format(len(s_ids), user_id), MODULE_CONTEXT)

        try:
            result  = SentenceRepositories.get_sentence(user_id, s_ids)
            if result == False:
                res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
                return res.getresjson(), 400

            res = CustomResponse(Status.SUCCESS.value, result)
            return res.getres()
        except Exception as e:
            log_exception("SentenceGetResource ",  MODULE_CONTEXT, e)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400
        

class SaveSentenceResource(Resource):
    def post(self):
        body        = request.get_json()
        user_id     = request.headers.get('userid')
        sentences   = None
        if 'sentences' in body:
            sentences = body['sentences']

        if user_id is None or sentences is None:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400

        log_info("SaveSentenceResource for user {}, number sentences to update {}".format(user_id, len(sentences)), MODULE_CONTEXT)
        try:
            result = SentenceRepositories.update_sentences(user_id, sentences)
            if result == False:
                res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
                return res.getresjson(), 400

            res = CustomResponse(Status.SUCCESS.value, result)
            return res.getres()
        except Exception as e:
            log_exception("SentencePostResource ",  MODULE_CONTEXT, e)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400


'''
    un-used method
'''
class SentenceBlockGetResource(Resource):
    def get(self, user_id, s_id):
        log_info("SentenceBlockGetResource {} for user {}".format(s_id, user_id), MODULE_CONTEXT)
        try:
            result  = SentenceRepositories.get_sentence_block(user_id, s_id)
            if result == False:
                res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
                return res.getresjson(), 400
            res = CustomResponse(Status.SUCCESS.value, result)
            return result, 200
        except Exception as e:
            log_exception("SentenceBlockGetResource ",  MODULE_CONTEXT, e)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400