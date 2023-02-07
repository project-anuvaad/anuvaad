from flask_restful import Resource
from flask.json import jsonify
from flask import request
from resources.response_generation import Response
from errors.error_validator import ValidationResponse
from errors.errors_exception import FormatError
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
from utilities.utils import FileOperation
from utilities.model_response import Status
import config
import time
import json

# sentence tokenisation
file_ops = FileOperation()
DOWNLOAD_FOLDER =file_ops.file_download(config.download_folder)

# rest request for tokenisation workflow service
class SenTokenisePostWF(Resource):
    
    # reading json request and reurnung final response
    def post(self):
        task_id = str("TOK-" +  str(time.time()).replace('.', '')[0:13])
        task_starttime = eval(str(time.time()).replace('.', '')[0:13])
        json_data = request.get_json(force = True)
        log_info("Resource SenTokenisePostWF : data from api request received", json_data)
        try:
            error_validator = ValidationResponse(DOWNLOAD_FOLDER)
            if error_validator.format_error(json_data) is True:
                response_gen = Response(json_data, DOWNLOAD_FOLDER)
                response = response_gen.workflow_response(task_id, task_starttime)
                log_info("Resource SenTokenisePostWF : Tokenisation api response completed", json_data)
                return jsonify(response)
        except FormatError as e:
            log_error("Resource SenTokenisePostWF : Input json format is not correct or dict_key is missing", json_data, e)
            return Status.ERR_request_input_format.value

# rest request for tokenisation individual service
class SentenceTokenise(Resource):

    # reading json request and reurnung final response
    def post(self):
        json_data = request.get_json(force=True)
        log_info("Resource SenTokenisePost : Tokenisation service started", None)
        try:
            error_validator = ValidationResponse(DOWNLOAD_FOLDER)
            if error_validator.format_error(json_data) is True:
                response_gen = Response(json_data, DOWNLOAD_FOLDER)
                response = response_gen.nonwf_response()
                log_info("Resource SenTokenisePost : Tokenisation api response completed", None)
                return jsonify(response)
        except FormatError as e:
            log_error("Resource SenTokenisePostWF : Input json format is not correct or dict_key is missing", None, e)
            return Status.ERR_request_input_format.value

class BlockTokenize(Resource):

    def post(self):
        task_id = str("TOK-" + str(time.time()).replace('.', '')[0:13])
        task_starttime = eval(str(time.time()).replace('.', '')[0:13])
        json_data = request.get_json(force = True)
        log_info("Resource BlockTokenize : data from api request received", json_data)
        try:
            error_validator = ValidationResponse(DOWNLOAD_FOLDER)
            if error_validator.format_error(json_data) is True:
                response_gen = Response(json_data, DOWNLOAD_FOLDER)
                response = response_gen.workflow_response_block_tokeniser(task_id, task_starttime)
                log_info("Resource BlockTokenize : Tokenisation api response completed", json_data)
                return jsonify(response)
        except FormatError as e:
            log_error("Resource BlockTokenize : Input json format is not correct or dict_key is missing", json_data, e)
            return Status.ERR_request_input_format.value


# class AnuvaadFeedback(Resource):
#     def post(self):
       
#         try:
#             with open ('feedbackQ.json','r') as f :
#                 res = json.load(f)
#             return(res)
#         except FormatError as e:
#             log_error("Resource BlockTokenize : Input json format is not correct or dict_key is missing", json_data, e)
#             return Status.ERR_request_input_format.value