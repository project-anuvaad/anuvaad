from flask_restful import fields, marshal_with, reqparse, Resource
from flask import request
from services import TranslateService,OpenNMTTranslateService
from models import CustomResponse, Status
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception

class InteractiveTranslateResource(Resource):
    def post(self):
        inputs = request.get_json(force=True)
        if len(inputs)>0:
            log_info("Making interactive-translation API call",MODULE_CONTEXT)
            log_info("inputs---{}".format(inputs),MODULE_CONTEXT)
            # log_info(entry_exit_log(LOG_TAGS["input"],inputs))
            out = TranslateService.interactive_translation(inputs)
            out = out.getresjson()
            complete_response = out['response_body']
            out['response_body'] = [{"tgt": complete_response[i]['tgt'][0],"tagged_tgt":complete_response[i]['tagged_tgt'][0],
                                    "tagged_src":complete_response[i]['tagged_src'],"s_id":complete_response[i]['s_id'],
                                    "src":complete_response[i]["src"]}
                    for i in range(len(complete_response))]
            log_info("out from interactive-translation done: {}".format(out),MODULE_CONTEXT)
            # log_info(entry_exit_log(LOG_TAGS["output"],out))
            return CustomResponse.jsonify(out)
        else:
            log_info("null inputs in request in interactive-translation API",MODULE_CONTEXT)
            out = CustomResponse(Status.INVALID_API_REQUEST.value,None)
            return out.getres()
    
    
class InteractiveMultiTranslateResource(Resource):  
    def post(self):
        inputs = request.get_json(force=True)
        if len(inputs)>0:
            log_info("Making v1/interactive-translation API call",MODULE_CONTEXT)
            log_info("inputs---{}".format(inputs),MODULE_CONTEXT)
            # log_info(entry_exit_log(LOG_TAGS["input"],inputs))
            out = TranslateService.interactive_translation(inputs)
            log_info("out from v1/interactive-translation done: {}".format(out.getresjson()),MODULE_CONTEXT)
            # log_info(entry_exit_log(LOG_TAGS["output"],out))
            return out.getres()
        else:
            log_info("null inputs in request in v1/interactive-translation API",MODULE_CONTEXT)
            out = CustomResponse(Status.INVALID_API_REQUEST.value,None)
            return out.getres() 
        
class OpenNMTTranslateResource(Resource):
    def post(self):
        inputs = request.get_json(force=True)
        if len(inputs)>0:
            log_info("Making translate-anuvaad API call",MODULE_CONTEXT)
            log_info("inputs---{}".format(inputs),MODULE_CONTEXT)
            out = OpenNMTTranslateService.translate_func(inputs)
            log_info("out from translate_func-trans_util done: {}".format(out.getresjson()),MODULE_CONTEXT)
            return out.getres()
        else:
            log_info("null inputs in request in translate-anuvaad API",MODULE_CONTEXT)
            out = CustomResponse(Status.INVALID_API_REQUEST.value,None)
            return out.getres()     
        
class NMTTranslateResource(Resource):
    def post(self):
        inputs = request.get_json(force=True)
        if len(inputs)>0:
            log_info("Making v3/translate-anuvaad API call",MODULE_CONTEXT)
            log_info("inputs---{}".format(inputs),MODULE_CONTEXT)
            out = OpenNMTTranslateService.translate_func(inputs)
            log_info("Final output from v3/translate-anuvaad API: {}".format(out.getresjson()),MODULE_CONTEXT)
            return out.getres()
        else:
            log_info("null inputs in request in translate-anuvaad API",MODULE_CONTEXT)
            out = CustomResponse(Status.INVALID_API_REQUEST.value,None)
            return out.getres()             
        
class InteractiveMultiTranslateResourceNew(Resource):  
    def post(self):
        inputs = request.get_json(force=True)
        if len(inputs)>0:
            log_info("Making v2/interactive-translation API call",MODULE_CONTEXT)
            log_info("inputs---{}".format(inputs),MODULE_CONTEXT)
            # log_info(entry_exit_log(LOG_TAGS["input"],inputs))
            out = TranslateService.interactive_translation(inputs)
            log_info("out from v2/interactive-translation done: {}".format(out.getresjson()),MODULE_CONTEXT)
            # log_info(entry_exit_log(LOG_TAGS["output"],out))
            return out.getres()
        else:
            log_info("null inputs in request in v2/interactive-translation API",MODULE_CONTEXT)
            out = CustomResponse(Status.INVALID_API_REQUEST.value,None)
            return out.getres()        