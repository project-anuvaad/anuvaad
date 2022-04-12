from flask_restful import Resource
from flask import request
from models import CustomResponse, Status
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
import config
import json 
import os
from google.cloud import translate
from google.protobuf.json_format import MessageToDict
import uuid

class GoogleTranslate_v3(Resource):
    def post(self):
        log_info("GoogleTranslate_v3 (Gnmt) api called",MODULE_CONTEXT)
        try:
            project_id = config.PROJECT_ID
            client = translate.TranslationServiceClient()
            parent = f"projects/{project_id}"
            body = request.json
            if bool(body) and bool(body['source_language_code']) and bool(body['target_language_code']):
                log_info("Complete request input: {}".format(body),MODULE_CONTEXT)
                jsn = body['src_list']
                if len(jsn)>0:
                    val_src =  [li['src'] for li in jsn]
                    response = client.translate_text(request={
                            "parent": parent,
                            "contents": val_src,
                            "mime_type": "text/plain",
                            "source_language_code": body["source_language_code"],
                            "target_language_code": body["target_language_code"]
                        })
                    res = MessageToDict(response._pb)
                    result = []
                    g_out = res['translations']
                    mod_id = [{
                            "src":jsn[i]["src"],
                            "s_id":jsn[i]["s_id"],
                            "tgt": g_out[i].get('translatedText',jsn[i]["src"])
                    }
                    for i in range(len(jsn))]
                    for j,k in enumerate(jsn):
                        k.update(mod_id[j])
                        result.append(k)
                    out = CustomResponse(Status.SUCCESS.value,result)
                    return out.getres()
            else:
                log_info("Error in Gnmt:invalid api request,either incorrect format or Mandatory input parameters missing or empty request",MODULE_CONTEXT)
                out = CustomResponse(Status.INVALID_API_REQUEST.value,request.json)
                return out.getres()
        except Exception as e:
            log_exception("Error in Gnmt adapter: {}".format(e),MODULE_CONTEXT,e)
            log_info("Error in Gnmt adapter: {}".format(g_out),MODULE_CONTEXT)
            status = Status.SYSTEM_ERR.value
            status['message'] = str(e)
            out = CustomResponse(status, request.json)                  
            return out.getres()