import time

from anuvaad_auditor.loghandler import log_error
from anuvaad_auditor.loghandler import log_info
from flask import request
from flask.json import jsonify
from flask_restful import Resource

import config
from errors.error_validator import ValidationResponse
from errors.errors_exception import FormatError
from resources.response_generation import Response
from utilities.model_response import Status
from utilities.utils import FileOperation

# sentence tokenisation
file_ops = FileOperation()
DOWNLOAD_FOLDER = file_ops.file_download(config.download_folder)


# rest request for Transform workflow service
class TransformFile(Resource):

    # reading json request and reurnung final response
    def post(self):
        task_id = str("TOK-" + str(time.time()).replace('.', '')[0:13])
        task_starttime = eval(str(time.time()).replace('.', '')[0:13])
        json_data = request.get_json(force=True)
        log_info("Resource SenTokenisePostWF : data from api request received", json_data)
        try:
            error_validator = ValidationResponse(DOWNLOAD_FOLDER)
            if error_validator.format_error(json_data) is True:
                response_gen = Response(json_data, DOWNLOAD_FOLDER)
                response = response_gen.workflow_response(task_id, task_starttime, transform_flow=True)
                log_info("TransformFile :: Transform api response completed", json_data)
                return jsonify(response)
        except FormatError as e:
            log_error("TransformFile :: Input json format is not correct or dict_key is missing", json_data,
                      e)
            return Status.ERR_request_input_format.value

# rest request for Transform workflow service
class DownloadFile(Resource):

    # reading json request and reurnung final response
    def post(self):
        task_id = str("TOK-" + str(time.time()).replace('.', '')[0:13])
        task_starttime = eval(str(time.time()).replace('.', '')[0:13])
        json_data = request.get_json(force=True)
        log_info("DownloadFile :: data from api request received", json_data)
        try:
            error_validator = ValidationResponse(DOWNLOAD_FOLDER)
            if error_validator.format_error(json_data) is True:
                response_gen = Response(json_data, DOWNLOAD_FOLDER)
                response = response_gen.workflow_response(task_id, task_starttime, download_flow=True)
                log_info("DownloadFile :: DownloadFile api response completed", json_data)
                return jsonify(response)
        except FormatError as e:
            log_error("DownloadFile :: Input json format is not correct or dict_key is missing", json_data,
                      e)
            return Status.ERR_request_input_format.value



