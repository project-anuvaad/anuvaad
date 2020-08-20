from flask_restful import Resource
from flask.json import jsonify
from flask import request
from utilities.utils import FileOperation
from resources.response_generation import Response
from errors.error_validator import ValidationResponse
from errors.errors_exception import FormatError
from utilities.model_response import Status
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
import config
import time

file_ops = FileOperation()
DOWNLOAD_FOLDER =file_ops.create_file_download_dir(config.download_folder)

# rest request for pdf2html workflow service
class Pdf2HtmlConversionWF(Resource):

    # reading json request and reurnung final response
    def post(self):
        log_info("Resource Pdf2HtmlConversionWF", "pdf2html service started", None)
        task_id = str("PDF2HTML-" + str(time.time()).replace('.', ''))
        task_starttime = str(time.time()).replace('.', '')
        json_data = request.get_json(force = True)
        try:
            error_validator = ValidationResponse(DOWNLOAD_FOLDER)
            if error_validator.format_error(json_data) is True:
                response_gen = Response(json_data, DOWNLOAD_FOLDER)
                response = response_gen.workflow_response(task_id, task_starttime)
                log_info("Resource Pdf2HtmlConversionWF", "pdf2html api response completed", None)
                return jsonify(response)
        except FormatError as e:
            log_error("Resource Pdf2HtmlConversionWF", "Input json format is not correct or dict_key is missing", None, e)
            return Status.ERR_request_input_format.value


# rest request for pdf2html individual service
class Pdf2HtmlConversion(Resource):

    # reading json request and reurnung final response
    def post(self):
        log_info("Resource Pdf2HtmlConversion", "pdf2html service started", None)
        json_data = request.get_json(force=True)
        try:
            error_validator = ValidationResponse(DOWNLOAD_FOLDER)
            if error_validator.format_error(json_data) is True:
                response_gen = Response(json_data, DOWNLOAD_FOLDER)
                response = response_gen.nonwf_response()
                log_info("Resource Pdf2HtmlConversion", "pdf2html api response completed", None)
                return jsonify(response)
        except FormatError as e:
            log_error("Resource Pdf2HtmlConversion", "Input json format is not correct or dict_key is missing", None, e)
            return Status.ERR_request_input_format.value