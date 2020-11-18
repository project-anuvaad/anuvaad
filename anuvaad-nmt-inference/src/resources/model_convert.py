from flask_restful import fields, marshal_with, reqparse, Resource
from flask import request
from services import ModelConvertService
from models import CustomResponse, Status
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception

class ModelConvertResource(Resource):
    def post(self):
        inputs = request.get_json(force=True)
        if len(inputs)>0:
            log_info("Making interactive-model-convert API call",MODULE_CONTEXT)
            out = ModelConvertService.model_conversion(inputs)
            return out.getres()
        else:
            log_info("null inputs in request in interactive-translation API",MODULE_CONTEXT)
            out = CustomResponse(Status.INVALID_API_REQUEST.value,None)
            return out.getres()
    