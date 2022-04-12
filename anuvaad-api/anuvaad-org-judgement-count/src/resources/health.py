from flask_restful import Resource
from flask import request
from models import CustomResponse, Status
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception

class HealthResource(Resource):
    def get(self):
        try:
            log_info("Health api called",MODULE_CONTEXT)
            out = CustomResponse(Status.SUCCESS.value,None)
            return out.jsonify_res()      
        except Exception as e:
            log_exception("Somthing errored",MODULE_CONTEXT,e)  
            out = CustomResponse(Status.SEVER_MODEL_ERR.value,[])
            return out.jsonify_res()