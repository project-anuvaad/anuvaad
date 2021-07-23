from flask_restful import fields, marshal_with, reqparse, Resource
from flask import request
from services import TranslateService,OpenNMTTranslateService, NMTTranslateService
from models import CustomResponse, Status
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
import datetime

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
            log_info("1: {}".format(datetime.datetime.now() ),MODULE_CONTEXT)
            # log_info(entry_exit_log(LOG_TAGS["input"],inputs))
            out = TranslateService.interactive_translation(inputs)
            log_info("out from v1/interactive-translation done: {}".format(out.getresjson()),MODULE_CONTEXT)
            log_info("11: {}".format(datetime.datetime.now() ),MODULE_CONTEXT)
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
        
class TranslateResourceV4(Resource):
    def post(self):
        translation_batch = {}
        src_list, response_body = list(), list()
        inputs = request.get_json(force=True)
        if len(inputs)>0 and all(v in inputs for v in ['src_list','model_id']):
            try:  
                log_info("Making v4/translate-anuvaad API call",MODULE_CONTEXT)
                log_info("inputs---{}".format(inputs),MODULE_CONTEXT)
                input_src_list = inputs.get('src_list')
                log_info("***********Input length:{}".format(len(input_src_list)),MODULE_CONTEXT)
                src_list = [i.get('src') for i in input_src_list]
                translation_batch = {'id':inputs.get('model_id'),'src_list': src_list}
                output_batch = NMTTranslateService.batch_translator(translation_batch)
                output_batch_dict_list = [{'tgt': output_batch['tgt_list'][i],
                                                    'tagged_tgt':output_batch['tagged_tgt_list'][i],'tagged_src':output_batch['tagged_src_list'][i]}
                                                    for i in range(len(input_src_list))]
                for j,k in enumerate(input_src_list):
                    k.update(output_batch_dict_list[j])
                    response_body.append(k)
                out = CustomResponse(Status.SUCCESS.value,response_body) 
                log_info("Final output from v4/translate-anuvaad API: {}".format(out.getresjson()),MODULE_CONTEXT)        
            except Exception as e:
                status = Status.SYSTEM_ERR.value
                status['message'] = str(e)
                log_exception("Exception caught in batch_translator child block: {}".format(e),MODULE_CONTEXT,e) 
                out = CustomResponse(status, inputs)
            return out.jsonify_res()    
        else:
            log_info("API input missing mandatory data ('src_list','model_id')",MODULE_CONTEXT)
            status = Status.INVALID_API_REQUEST.value
            status['message'] = "Missing mandatory data ('src_list','model_id')"
            out = CustomResponse(status,inputs)
            return out.jsonify_res()          
        
class InteractiveMultiTranslateResourceV3(Resource):  
    def post(self):
        inputs = request.get_json(force=True)
        if len(inputs)>0:
            log_info("Making v3/interactive-translation API call",MODULE_CONTEXT)
            log_info("inputs---{}".format(inputs),MODULE_CONTEXT)
            out = TranslateService.interactive_translation(inputs)
            log_info("out from v3/interactive-translation done: {}".format(out.getresjson()),MODULE_CONTEXT)
            return out.jsonify_res()
        else:
            log_info("null inputs in request in v3/interactive-translation API",MODULE_CONTEXT)
            out = CustomResponse(Status.INVALID_API_REQUEST.value,None)
            return out.jsonify_res()        