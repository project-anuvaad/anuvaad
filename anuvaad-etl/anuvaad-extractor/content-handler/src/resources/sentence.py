from flask_restful import fields, marshal_with, reqparse, Resource
from repositories import SentenceRepositories
from models import CustomResponse, Status
from utilities import AppContext
from anuvaad_auditor.loghandler import log_info, log_exception
from flask import request
from config import USER_TRANSLATION_ENABLED
sentenceRepo = SentenceRepositories()

class FetchSentenceResource(Resource):
    def post(self):
        body        = request.get_json()
        user_id     = request.headers.get('userid')
        if user_id == None:
            user_id = request.headers.get('x-user-id')

        sentences       = None
        if 'sentences' in body:
            sentences       = body['sentences']

        if user_id is None or sentences is None:
            log_info('Missing params in FetchSentenceResource {}, user_id:{}'.format(body, user_id), AppContext.getContext())
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400
        
        AppContext.addRecordID(None)
        log_info("FetchSentenceResource s_ids {} for user {}".format(len(sentences), user_id), AppContext.getContext())

        try:
            result  = sentenceRepo.get_sentence(user_id, sentences)
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
        log_info("SaveSentenceResource for user {}, number of sentences to update : {}, workflowCode :{} ".format(user_id, len(sentences),workflowCode), AppContext.getContext())

        try:
            result = sentenceRepo.update_sentences(user_id, sentences, workflowCode)
            if result == False:
                res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
                return res.getresjson(), 400
            
            if USER_TRANSLATION_ENABLED:
                try:
                    result=sentenceRepo.save_sentences(user_id, sentences) 
                except Exception as e:
                    log_exception("SaveSentenceResource",  AppContext.getContext(), e)

            res = CustomResponse(Status.SUCCESS.value, sentences)
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

        bleu_return=None
        if 'bleu_score' in body:
            bleu_return=body['bleu_score']
        else:
            bleu_return=False
        AppContext.addRecordID(None)
        log_info("SentenceStatisticsCount for user {}, sentence count for record_ids {}".format(user_id, record_ids), AppContext.getContext())

        try:
            result = sentenceRepo.get_sentences_counts(record_ids,bleu_return)
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

class GetSentencesResource(Resource):
    def post(self):
        body        = request.get_json()

        if "keys" not in body or not body["keys"]:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400

        keys = body["keys"]

        log_info("Fetching sentences from redis store", AppContext.getContext())

        try:
            result = sentenceRepo.get_sentences_from_store(keys)
            if result == None:
                res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
                return res.getresjson(), 400
            
            res = CustomResponse(Status.SUCCESS.value, result)
            return res.getres()
        except Exception as e:
            log_exception("Exception while fetching sentences from redis store ",  AppContext.getContext(), e)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400
