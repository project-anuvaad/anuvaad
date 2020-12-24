from flask_restful import fields, marshal_with, reqparse, Resource
from flask import request
from services import BatchNMTPerformanceService
from models import CustomResponse, Status
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
import datetime
import os
from pathlib import Path

class BatchNMTPerformanceResource(Resource):
    def post(self):
        inputs = request.get_json(force=True)
        if len(inputs) > 0:
            log_info("Making performance check API call",MODULE_CONTEXT)
            try:
                for i in inputs:
                    avg_words_per_sec, target_array = BatchNMTPerformanceService.find_performance(i['input_txt_file'],\
                        i['model_id'],i['batch_size'])

                    output_file_name = os.path.basename(i['input_txt_file']).split(".")[0] + "_" + str(i['model_id']) + \
                        "_" + str(i['batch_size']) + "_" + "output" +".txt"
                    with open(os.path.join(str(Path.home()),output_file_name),'w') as f:
                        for sentence in target_array:
                            f.write("%s\n" % sentence)
                    
                    out = {}
                    out['response_body'] = {"words_per_sec": avg_words_per_sec}
                    out = CustomResponse(Status.SUCCESS.value, out['response_body'])
                    log_info("out from performance check done: {}".format(out.getresjson()),MODULE_CONTEXT)
                    
                    return out.getres()

            except Exception as e:
                status = Status.SYSTEM_ERR.value
                status['why'] = str(e)
                out = CustomResponse(status, [])  
              
                return out.getres()
        else:
            log_info("null inputs in request in /v0/performance API",MODULE_CONTEXT)
            out = CustomResponse(Status.INVALID_API_REQUEST.value,None)
            
            return out.getres() 
