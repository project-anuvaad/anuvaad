from flask_restful import Resource
from flask import request
from models.response import CustomResponse
from models.status import Status
import config
from utilities.utils import FileUtilities
from services.service import document_saving
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
from common.errors import ServiceError
from common.errors import InternalServerError

file_ops = FileUtilities()
DOWNLOAD_FOLDER =file_ops.file_download(config.download_folder)
    

class DocumentConverter(Resource):

    def post(self):
        body = request.get_json()
        log_info("request received", MODULE_CONTEXT)
        try:
            record_id = body['record_id']
            user_id = body['user_id']
            file_type = body['file_type']
            if 'record_id' not in body or record_id is None or 'user_id' not in body or user_id is None or \
                'file_type' not in body or file_type is None:
                res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value,None)
                return res.getresjson(), 400
            formated_document = document_saving(record_id, user_id, DOWNLOAD_FOLDER, file_type)
            log_info("document type %s saved successfully"%file_type, MODULE_CONTEXT)
            res = CustomResponse(Status.SUCCESS.value, formated_document)
            return res.getres()
        except ServiceError as e:
            log_exception("Error occured in at resource level due to service operation", MODULE_CONTEXT, e)
            res = CustomResponse(Status.OPERATION_NOT_PERMITTED.value,None)
            return res.getresjson(), 400
        except Exception as e:
            log_exception("Error occured at resource level due to wrong request format", MODULE_CONTEXT, e)
            res = CustomResponse(Status.OPERATION_NOT_PERMITTED.value,None)
            return res.getresjson(), 400