from flask_restful import Resource
from flask import request
from services import LabseAlignerService
from models import CustomResponse, Status
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception

class LabseAlignerResource(Resource):
    def post(self):
        inputs = request.get_json(force=True)
        response_list = list()
        if len(inputs)>0:
            log_info("Making labse-aligner(Resource) API call",MODULE_CONTEXT)
            log_info("Complete request input: {}".format(inputs),MODULE_CONTEXT)
            try:
                for i in inputs:
                    if all(v in i for v in ["src_phrases","tgt"]):
                        log_info("Making labse-aligner service call",MODULE_CONTEXT)
                        res = LabseAlignerService.phrase_aligner(i)
                        response_list.append(res)
                        out = CustomResponse(Status.SUCCESS.value, response_list)                    
                    else:
                        log_info("Missing mandatory Parameters for labse-aligner:src_phrases or tgt",MODULE_CONTEXT) 
                        out = CustomResponse(Status.MANDATORY_PARAM_MISSING.value, []) 
                        return out.getres()
            except Exception as e:
                status = Status.SYSTEM_ERR.value
                status['message'] = str(e)
                out = CustomResponse(status, [])  
              
            return out.getres()
        else:
            log_info("null inputs in request in labse-aligner API",MODULE_CONTEXT)
            out = CustomResponse(Status.INVALID_API_REQUEST.value,None)
            return out.getres()
    