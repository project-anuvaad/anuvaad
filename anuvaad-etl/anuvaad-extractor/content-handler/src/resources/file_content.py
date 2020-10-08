from flask_restful import fields, marshal_with, reqparse, Resource
from repositories import SentenceRepositories, FileContentRepositories
from models import CustomResponse, Status
import ast
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
from flask import request

class FileContentSaveResource(Resource):
    def post(self):
        body        = request.get_json()
        user_id     = request.headers.get('userid')
        pages       = body['pages']
        file_locale = ''
        
        if 'file_locale' in body:
            file_locale = body['file_locale']

        job_id = ''
        if 'job_id' in body:
            job_id = body['job_id']

        record_id = None
        if 'record_id' in body:
            record_id = body['record_id']

        src_lang = None
        if 'src_lang' in body:
            src_lang    = body['src_lang']
        tgt_lang = None
        if 'tgt_lang' in body:
            tgt_lang    = body['tgt_lang']

        if 'pages' not in body or user_id is None or record_id == None or src_lang == None or tgt_lang == None:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value,None)
            return res.getresjson(), 400
        
        log_info("FileContentSaveResource record_id {} for user {}".format(record_id, user_id), MODULE_CONTEXT)
        
        try:
            if FileContentRepositories.store(user_id, file_locale, record_id, pages, src_lang, tgt_lang) == False:
                res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
                return res.getresjson(), 400

            log_info("FileContentSaveResource record_id {} for user {} saved".format(record_id, user_id), MODULE_CONTEXT)
            res = CustomResponse(Status.SUCCESS.value, None)
            return res.getres()
        except Exception as e:
            log_exception("FileContentSaveResource ",  MODULE_CONTEXT, e)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400


class FileContentGetResource(Resource):
    def get(self):

        parser = reqparse.RequestParser()
        parser.add_argument('start_page', type=int, location='args', help='start_page can be 0, set start_page & end_page as 0 to get entire document', required=True)
        parser.add_argument('end_page',  type=int, location='args', help='end_page can be 0, set start_page & end_page as 0 to get entire document', required=True)
        parser.add_argument('ad-userid', location='headers', type=str, help='userid cannot be empty', required=True)
        parser.add_argument('job_id', type=str, location='args', help='Job Id is required', required=False)
        parser.add_argument('record_id', type=str, location='args', help='record_id is required', required=True)

        args    = parser.parse_args()
        log_info("FileContentGetResource record_id {} for user {}".format(args['record_id'], args['ad-userid']), MODULE_CONTEXT)
        try:
            result  = FileContentRepositories.get(args['ad-userid'], args['record_id'], args['start_page'], args['end_page'])
            if result == False:
                res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
                return res.getresjson(), 400
            log_info("FileContentGetResource record_id {} for user {} has {} pages".format(args['record_id'], args['ad-userid'], result['total']), MODULE_CONTEXT)
            res = CustomResponse(Status.SUCCESS.value, result['pages'], result['total'])
            return res.getres()
        except Exception as e:
            log_exception("FileContentGetResource ",  MODULE_CONTEXT, e)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400
        
        
class FileContentUpdateResource(Resource):
    def post(self):
        body        = request.get_json()
        user_id     = request.headers.get('userid')
        
        if 'blocks' not in body or user_id is None:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400
        
        blocks      = body['blocks']
        
        log_info("FileContentUpdateResource for user {}, to update {} blocks".format(user_id, len(blocks)), MODULE_CONTEXT)

        try:
            result  = FileContentRepositories.update(user_id, blocks)

            if result == False:
                res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
                return res.getresjson(), 400

            log_info("FileContentUpdateResource for user {} updated".format(user_id), MODULE_CONTEXT)
            res = CustomResponse(Status.SUCCESS.value, result, None)
            return res.getres()            
        except Exception as e:
            log_exception("FileContentGetResource ",  MODULE_CONTEXT, e)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400
        
