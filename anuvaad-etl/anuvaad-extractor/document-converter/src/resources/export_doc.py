from flask_restful import Resource
from flask import request
from models.response import CustomResponse
from models.status import Status
import config
from utilities.utils import FileUtilities
from services import DocumentExporterService
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
from common.errors import ServiceError,DataEmptyError
from common.errors import InternalServerError

file_ops = FileUtilities()
exportService=DocumentExporterService()

class DocumentExporterResource(Resource):

    def post(self):
        body = request.get_json()
        log_info("request received", MODULE_CONTEXT)
        try:
            if 'record_id' not in body or not body['record_id'] or 'user_id' not in body or not body['user_id'] or 'file_type' not in body or not body['file_type']:
                res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value,None)
                return res.getresjson(), 400
            record_id = body['record_id']
            user_id = body['user_id']
            file_type = body['file_type']

            log_info("DocumentExporterResource request received | {}".format(body),MODULE_CONTEXT)

            formated_document = exportService.export_document(record_id, user_id, file_type)
            if formated_document ==False:
                log_info("Error occured at resource level due to service operation", MODULE_CONTEXT)
                res = CustomResponse(Status.DATA_NOT_FOUND.value,None)
                return res.getresjson(), 400

            log_info("document type %s saved successfully"%file_type, MODULE_CONTEXT)
            res = CustomResponse(Status.SUCCESS.value, formated_document)
            return res.getres()
        except ServiceError as e:
            log_exception("Error occured at resource level due to service operation", MODULE_CONTEXT, e)
            res = CustomResponse(Status.OPERATION_NOT_PERMITTED.value,None)
            return res.getresjson(), 400
        except Exception as e:
            log_exception("Error occured at resource level due to {}".format(str(e)), MODULE_CONTEXT, e)
            res = CustomResponse(Status.OPERATION_NOT_PERMITTED.value,None)
            return res.getresjson(), 400