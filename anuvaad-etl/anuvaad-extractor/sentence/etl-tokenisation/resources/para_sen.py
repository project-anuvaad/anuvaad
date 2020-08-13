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

# sentence tokenisation
file_ops = FileOperation()
DOWNLOAD_FOLDER =file_ops.file_download(config.download_folder)

# rest request for tokenisation workflow service
class SenTokenisePostWF(Resource):
    
    # reading json request and reurnung final response
    def post(self):
        log_info("Resource SenTokenisePostWF", "Tokenisation service started", None)
        task_id = str("TOK-" + str(time.time()).replace('.', ''))
        task_starttime = str(time.time()).replace('.', '')
        json_data = request.get_json(force = True)
        try:
            error_validator = ValidationResponse(DOWNLOAD_FOLDER)
            if error_validator.format_error(json_data) is True:
                response_gen = Response(json_data, DOWNLOAD_FOLDER)
                response = response_gen.workflow_response(task_id, task_starttime)
                log_info("Resource SenTokenisePostWF", "Tokenisation api response completed", None)
                return jsonify(response)
        except FormatError as e:
            log_error("Resource SenTokenisePostWF", "Input json format is not correct or dict_key is missing", None, e)
            return Status.ERR_request_input_format.value

# rest request for tokenisation individual service
class SentenceTokenise(Resource):

    # reading json request and reurnung final response
    def post(self):
        log_info("Resource SenTokenisePost", "Tokenisation service started", None)
        json_data = request.get_json(force=True)
        try:
            error_validator = ValidationResponse(DOWNLOAD_FOLDER)
            if error_validator.format_error(json_data) is True:
                response_gen = Response(json_data, DOWNLOAD_FOLDER)
                response = response_gen.nonwf_response()
                log_info("Resource SenTokenisePost", "Tokenisation api response completed", None)
                return jsonify(response)
        except FormatError as e:
            log_error("Resource SenTokenisePostWF", "Input json format is not correct or dict_key is missing", None, e)
            return Status.ERR_request_input_format.value