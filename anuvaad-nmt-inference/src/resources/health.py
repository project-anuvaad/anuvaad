from flask_restful import Resource
from flask import request
from models import CustomResponse, Status
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
import os

class HealthResource(Resource):
    def get(self):
        log_info("NMT Health api called",MODULE_CONTEXT)
        res = os.system('gpustat --json')
        out = CustomResponse(Status.SUCCESS.value,res)
        return out.getres() 
        