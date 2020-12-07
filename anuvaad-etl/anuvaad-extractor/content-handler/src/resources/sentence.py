from flask_restful import fields, marshal_with, reqparse, Resource
from repositories import SentenceRepositories
from models import CustomResponse, Status
from utilities import AppContext
from anuvaad_auditor.loghandler import log_info, log_exception
from flask import request

sentenceRepo = SentenceRepositories()

class FetchSentenceResource(Resource):
    def post(self):
        body        = request.get_json()
        user_id     = request.headers.get('userid')
        if user_id == None:
            user_id = request.headers.get('x-user-id')

        s_ids       = None
        if 'sentences' in body:
            s_ids       = body['sentences']

        if user_id is None or s_ids is None:
            log_info('Missing params in FetchSentenceResource {}, user_id:{}'.format(body, user_id), AppContext.getContext())
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400
        
        AppContext.addRecordID(None)
        log_info("FetchSentenceResource s_ids {} for user {}".format(len(s_ids), user_id), AppContext.getContext())

        try:
            result  = sentenceRepo.get_sentence(user_id, s_ids)
            if result == False:
                res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
                return res.getresjson(), 400

            res = CustomResponse(Status.SUCCESS.value, result)
            return res.getres()
        except Exception as e:
            log_exception("FetchSentenceResource ",  AppContext.getContext(), e)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400

class SaveSentenceResource(Resource):
    def post(self):
        body        = request.get_json()
        user_id     = request.headers.get('userid')
        if user_id == None:
            user_id = request.headers.get('x-user-id')

        if 'sentences' not in body or user_id is None or 'workflowCode' not in body:
            log_info('Missing params in SaveSentenceResource {}, user_id:{}'.format(body, user_id), AppContext.getContext())
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400

        sentences       = body['sentences']
        workflowCode    = body['workflowCode']

        AppContext.addRecordID(None)
        log_info("SaveSentenceResource for user {}, number sentences to update {} request {}".format(user_id, len(sentences), body), AppContext.getContext())

        try:
            result = sentenceRepo.update_sentences(user_id, sentences, workflowCode)
            if result == False:
                res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
                return res.getresjson(), 400
            
            sentence_ids = []
            for sentence in sentences:
                sentence_ids.append(sentence['s_id'])
            
            result  = sentenceRepo.get_sentence(user_id, sentence_ids)
            if result == False:
                res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
                return res.getresjson(), 400
            res = CustomResponse(Status.SUCCESS.value, result)
            return res.getres()

        except Exception as e:
            log_exception("SaveSentenceResource ",  AppContext.getContext(), e)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400

class SentenceStatisticsCount(Resource):
    def post(self):
        body        = request.get_json()
        user_id     = request.headers.get('userid')
        if user_id == None:
            user_id = request.headers.get('x-user-id')

        if 'record_ids' not in body or user_id is None:
            log_info('Missing params in SentenceStatisticsCount {}, user_id:{}'.format(body, user_id), AppContext.getContext())
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400

        record_ids       = body['record_ids']

        AppContext.addRecordID(None)
        log_info("SentenceStatisticsCount for user {}, sentence count for record_ids {}".format(user_id, record_ids), AppContext.getContext())

        try:
            result = sentenceRepo.get_sentences_counts(record_ids)
            if result == False:
                res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
                return res.getresjson(), 400
            
            res = CustomResponse(Status.SUCCESS.value, result)
            return res.getres()
        except Exception as e:
            log_exception("SentenceStatisticsCount ",  AppContext.getContext(), e)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400

'''
    un-used method
'''
class SentenceBlockGetResource(Resource):
    def get(self, user_id, s_id):
        AppContext.addRecordID(None)
        log_info("SentenceBlockGetResource {} for user {}".format(s_id, user_id), AppContext.getContext())
        
        try:
            result  = SentenceRepositories.get_sentence_block(user_id, s_id)
            if result == False:
                res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
                return res.getresjson(), 400
            res = CustomResponse(Status.SUCCESS.value, result)
            return result, 200
        except Exception as e:
            log_exception("SentenceBlockGetResource ",  AppContext.getContext(), e)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400