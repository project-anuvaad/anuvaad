from flask_restful import fields, marshal_with, reqparse, Resource
from anuvaad_auditor.errorhandler import post_error
from repositories import DigitalDocumentRepositories
from models import CustomResponse, Status
from utilities import AppContext
from anuvaad_auditor.loghandler import log_info, log_exception
from flask import request

digitalRepo=DigitalDocumentRepositories()

class DigitalDocumentSaveResource(Resource):

    def post(self):
        body        = request.get_json()
         
        if 'files' not in body or not body['files']:
            return post_error("Data Missing","files is required",None), 400
        
        if 'recordID' not in body or not body['recordID']:
            return post_error("Data Missing","recordID is required",None), 400

        # if 'jobID' not in body or not body['jobID']:
        #     return post_error("Data Missing","jobID is required",None), 400

        files = body['files']
        userID = body['metadata']['userID']
        recordID = body['recordID']

        if  not userID:
            return post_error("Data Missing","userID is required",None), 400

            AppContext.addRecordID(recordID)
            log_info('Missing params in DigitalDocumentSaveResource {}, user_id:{}, record_id:{}'.format(body, userID, recordID), AppContext.getContext())
               
        try:
            AppContext.addRecordID(recordID)
            log_info('DigitalDocumentSaveResource request received, user_id:{}, record_id:{}'.format(userID, recordID), AppContext.getContext())

            result = digitalRepo.store(userID, recordID, files)
            if result == False:
                log_info('Missing params in DigitalDocumentSaveResource {}, user_id:{}, record_id:{}'.format(body, userID, recordID), AppContext.getContext())
                return post_error("Data Missing","Failed to store doc since data is missing",None), 400
            elif result is None:
                AppContext.addRecordID(recordID)
                log_info('DigitalDocumentSaveResource request completed, user_id:{}, record_id:{}'.format(userID, recordID), AppContext.getContext())
                res = CustomResponse(Status.SUCCESS.value, None)
                return res.getres()
            else:
                log_info('Missing params in DigitalDocumentSaveResource {}, user_id:{}, record_id:{}'.format(body, userID, recordID), AppContext.getContext())
                return result, 400
        except Exception as e:
            AppContext.addRecordID(recordID)
            log_exception("Exception on save document | DigitalDocumentSaveResource :{}".format(str(e)),  AppContext.getContext(), e)
            return post_error("Data Missing","Failed to store doc since data is missing",None), 400


class DigitalDocumentUpdateWordResource(Resource):

    def post(self):
        userID     = request.headers.get('userID')
        if userID == None:
            userID = request.headers.get('x-user-id')
        body        = request.get_json()

        if 'words' not in body and not body['words']:
            return post_error("Data Missing","words are required",None), 400

        words = body['words']
        AppContext.adduserID(userID)
        log_info("DigitalDocumentUpdateWordResource for user {}, number words to update {} request {}".format(userID, len(words), body), AppContext.getContext())

        try:
            result = digitalRepo.update_words(userID, words)
            if result == True:
                res = CustomResponse(Status.SUCCESS.value, words)
                return res.getres()
            # return post_error("Data Missing","Failed to update word since data is missing",None), 400
            return result, 400

        except Exception as e:
            log_exception("Exception in DigitalDocumentUpdateWordResource |{}".format(str(e)),  AppContext.getContext(), e)
            return post_error("Data Missing","Failed to update word since data is missing",None), 400



class DigitalDocumentGetResource(Resource):

    def get(self):

        parser = reqparse.RequestParser()
        parser.add_argument('start_page', type=int, location='args', help='start_page can be 0, set start_page & end_page as 0 to get entire document', required=True)
        parser.add_argument('end_page',  type=int, location='args', help='end_page can be 0, set start_page & end_page as 0 to get entire document', required=True)
        parser.add_argument('recordID', type=str, location='args', help='record_id is required', required=True)

        args    = parser.parse_args()
        AppContext.addRecordID(args['recordID'])
        log_info("DigitalDocumentGetResource record_id {} ".format(args['recordID']), AppContext.getContext())

        try:
            result  = digitalRepo.get_pages(args['recordID'], args['start_page'], args['end_page'])
            if result == False:
                return post_error("Data Missing","Failed to get pages since data is missing",None), 400

            AppContext.addRecordID(args['recordID'])
            log_info("DigitalDocumentGetResource record_id {} has {} pages".format(args['recordID'], result['total']), AppContext.getContext())
            res = CustomResponse(Status.SUCCESS.value, result['pages'], result['total'])
            return res.getres()

        except Exception as e:
            AppContext.addRecordID(args['recordID'])
            log_exception("Exception in DigitalDocumentGetResource |{}".format(str(e)),  AppContext.getContext(), e)
            return post_error("Data Missing","Failed to get pages since data is missing",None), 400
    

