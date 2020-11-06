from flask_restful import fields, marshal_with, reqparse, Resource
from repositories import FileContentRepositories
from models import CustomResponse, Status
import ast
from utilities import AppContext
from anuvaad_auditor.loghandler import log_info, log_exception
from flask import request

fileContentRepo = FileContentRepositories()

class FileContentSaveResource(Resource):
    def post(self):
        body        = request.get_json()
        user_id     = request.headers.get('userid')
        if user_id == None:
            user_id = request.headers.get('ad-userid')

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
            log_info('Missing params in FileContentSaveResource {}, user_id:{}'.format(body, user_id), AppContext.getContext())
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value,None)
            return res.getresjson(), 400
        
        AppContext.addRecordID(record_id)
        log_info("FileContentSaveResource record_id ({}) for user ({})".format(record_id, user_id), AppContext.getContext())
        
        try:
            if fileContentRepo.store(user_id, file_locale, record_id, pages, src_lang, tgt_lang) == False:
                res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
                return res.getresjson(), 400

            log_info("FileContentSaveResource record_id ({}) for user ({}) saved".format(record_id, user_id), AppContext.getContext())
            res = CustomResponse(Status.SUCCESS.value, None)
            return res.getres()
        except Exception as e:
            log_exception("FileContentSaveResource ",  AppContext.getContext(), e)
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
        AppContext.addRecordID(args['record_id'])
        log_info("FileContentGetResource record_id {} for user {}".format(args['record_id'], args['ad-userid']), AppContext.getContext())

        try:
            result  = fileContentRepo.get(args['ad-userid'], args['record_id'], args['start_page'], args['end_page'])
            if result == False:
                res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
                return res.getresjson(), 400
            log_info("FileContentGetResource record_id {} for user {} has {} pages".format(args['record_id'], args['ad-userid'], result['total']), AppContext.getContext())
            res = CustomResponse(Status.SUCCESS.value, result['pages'], result['total'])
            return res.getres()
        except Exception as e:
            log_exception("FileContentGetResource ",  AppContext.getContext(), e)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400
        
        
class FileContentUpdateResource(Resource):
    def post(self):
        body        = request.get_json()
        user_id     = request.headers.get('userid')
        if user_id == None:
            user_id = request.headers.get('ad-userid')
            
        workflowCode= None
        
        if 'blocks' not in body or user_id is None:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400

        if 'workflowCode' in body:
            workflowCode = body['workflowCode']

        blocks          = body['blocks']
        AppContext.addRecordID(None)
        log_info("FileContentUpdateResource for user ({}), to update ({}) blocks".format(user_id, len(blocks)), AppContext.getContext())

        try:
            result, updated_blocks  = fileContentRepo.update(user_id, blocks, workflowCode)

            if result == False:
                res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
                return res.getresjson(), 400

            log_info("FileContentUpdateResource for user ({}) updated".format(user_id), AppContext.getContext())
            response = {
                'blocks': updated_blocks
            }
            res = CustomResponse(Status.SUCCESS.value, response, len(updated_blocks))
            return res.getres()            
        except Exception as e:
            log_exception("FileContentGetResource ",  AppContext.getContext(), e)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400
        
