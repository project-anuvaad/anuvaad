from flask_restful import Resource
from flask.json import jsonify
from flask import request
from src.utilities.utils import FileOperation
from src.resources.response_gen import Response
from src.errors.error_validator import ValidationResponse
from src.errors.errors_exception import FormatError
from src.utilities.model_response import Status
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
import config
import time
import src.utilities.app_context as app_context

# sentence block merging
file_ops = FileOperation()
#DOWNLOAD_FOLDER =file_ops.create_file_download_dir(config.download_folder)

# rest request for block merging workflow service

# rest request for layout detection individual service
class OCR(Resource):

    # reading json request and reurnung final response
    def post(self):
        json_data = request.get_json(force=True)
        app_context.init()
        app_context.application_context = json_data
        log_info("Resource OCR service started", app_context.application_context)

        try:
            #error_validator = ValidationResponse(DOWNLOAD_FOLDER)
            #if error_validator.format_error(json_data) is True:
            response_gen = Response(json_data)
            response = response_gen.nonwf_response()
            log_info("Resource Vision_OCR api response completed", app_context.application_context)
            return jsonify(response)
        except FormatError as e:
            log_error("Resource Vision_OCR Input json format is not correct or dict_key is missing" + str(e), app_context.application_context, e)
            return Status.ERR_request_input_format.value
