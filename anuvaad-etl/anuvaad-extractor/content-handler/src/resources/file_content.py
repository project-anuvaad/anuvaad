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
            user_id = request.headers.get('x-user-id')

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
            AppContext.addRecordID(record_id)
            log_info('Missing params in FileContentSaveResource {}, user_id:{}'.format(body, user_id), AppContext.getContext())
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value,None)
            return res.getresjson(), 400
        
        AppContext.addRecordID(record_id)
        log_info("FileContentSaveResource record_id ({}) for user ({})".format(record_id, user_id), AppContext.getContext())
        
        try:
            if fileContentRepo.store(user_id, file_locale, record_id, pages, src_lang, tgt_lang) == False:
                res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
                return res.getresjson(), 400
            AppContext.addRecordID(record_id)
            log_info("FileContentSaveResource record_id ({}) for user ({}) saved".format(record_id, user_id), AppContext.getContext())
            res = CustomResponse(Status.SUCCESS.value, None)
            return res.getres()
        except Exception as e:
            AppContext.addRecordID(record_id)
            log_exception("FileContentSaveResource ",  AppContext.getContext(), e)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400


class FileContentGetResource(Resource):
    def get(self):

        parser = reqparse.RequestParser()
        parser.add_argument('start_page', type=int, location='args', help='start_page can be 0, set start_page & end_page as 0 to get entire document', required=True)
        parser.add_argument('end_page',  type=int, location='args', help='end_page can be 0, set start_page & end_page as 0 to get entire document', required=True)
        parser.add_argument('job_id', type=str, location='args', help='Job Id is required', required=False)
        parser.add_argument('record_id', type=str, location='args', help='record_id is required', required=True)

        args    = parser.parse_args()
        AppContext.addRecordID(args['record_id'])
        log_info("FileContentGetResource record_id {} ".format(args['record_id']), AppContext.getContext())

        try:
            result  = fileContentRepo.get(args['record_id'], args['start_page'], args['end_page'])
            if result == False:
                res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
                return res.getresjson(), 400
            AppContext.addRecordID(args['record_id'])
            log_info("FileContentGetResource record_id {} has {} pages".format(args['record_id'], result['total']), AppContext.getContext())
            res = CustomResponse(Status.SUCCESS.value, result['pages'], result['total'])
            return res.getres()
        except Exception as e:
            AppContext.addRecordID(args['record_id'])
            log_exception("FileContentGetResource ",  AppContext.getContext(), e)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400
        
        
class FileContentUpdateResource(Resource):
    def post(self):
        body        = request.get_json()
        user_id     = request.headers.get('userid')
        if user_id == None:
            user_id = request.headers.get('x-user-id')
        
        modifiedSentences   = None
        if 'modifiedSentences' in body:
            modifiedSentences   = body['modifiedSentences']
    
        workflowCode= None
        record_id = None
        if 'blocks' not in body or user_id is None:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400

        if 'workflowCode' in body:
            workflowCode = body['workflowCode']
        if 'record_id' in body:
            record_id=body['record_id']

        blocks          = body['blocks']
        AppContext.addRecordID(record_id)

        log_info("FileContentUpdateResource for user ({}), \nto update ({}) blocks, \nmodified sentences: {}, \nworkflowCode: {}".format(user_id, len(blocks),modifiedSentences,workflowCode), AppContext.getContext())
        try:
            result, updated_blocks  = fileContentRepo.update(record_id,user_id, blocks, workflowCode, modifiedSentences)

            if result == False:
                res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
                return res.getresjson(), 400

            log_info("FileContentUpdateResource for user ({}) updated".format(user_id), AppContext.getContext())
            response = {
                'blocks': updated_blocks,
                'workflowCode': workflowCode
            }
            res = CustomResponse(Status.SUCCESS.value, response, len(updated_blocks))
            return res.getres()            
        except Exception as e:
            log_exception("FileContentUpdateResource ",  AppContext.getContext(), e)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400

class FileContentStoreReference(Resource):
    def post(self):
        body        = request.get_json()

        if body.get("records") == None :
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400

        records          = body['records']
        log_info("FileContentStoreReference - received {} record/s ".format(len(records)), AppContext.getContext())
        try:
            result  = fileContentRepo.store_reference(records)

            if result == False:
                log_info("Reference link storage failed ", AppContext.getContext())
                res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
                return res.getresjson(), 400
            log_info("Reference link stored succesfully ", AppContext.getContext())
            res = CustomResponse(Status.SUCCESS.value, None)
            return res.getres()            
        except Exception as e:
            log_exception("Reference link storage failed |{}".format(str(e)),  AppContext.getContext(), e)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400
        
class FileContentGetReference(Resource):
    def post(self):
        body        = request.get_json()

        if body.get("job_ids") == None or len(body["job_ids"])==0:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400

        records          = body['job_ids']
        log_info("FileContentGetReference - received {} record/s ".format(len(records)), AppContext.getContext())
        try:
            result  = fileContentRepo.get_reference(records)

            if result == False:
                log_info("Reference link fetch failed ", AppContext.getContext())
                res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
                return res.getresjson(), 400
            log_info("Reference link fetch succesfull ", AppContext.getContext())
            res = CustomResponse(Status.SUCCESS.value, result)
            return res.getres()            
        except Exception as e:
            log_exception("FileContentGetReference ",  AppContext.getContext(), e)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400
