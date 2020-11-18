from flask_restful import Resource
from flask import request
from models import CustomResponse, Status
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
import config
import json 

class FetchModelsResource(Resource):
    def get(self):
        log_info("FetchModelsResource api called",MODULE_CONTEXT)
        try:
            with open(config.FETCH_MODEL_CONFG) as f:
                confs = json.load(f)
                models = confs['data']
                out = CustomResponse(Status.SUCCESS.value, models)
            return out.getres() 
        except Exception as e:
            log_exception("Error in FetchModelsResource: {}".format(e),MODULE_CONTEXT,e)
            status = Status.SYSTEM_ERR.value
            status['why'] = str(e)
            out = CustomResponse(status, None)                  
            return out.getres()
       