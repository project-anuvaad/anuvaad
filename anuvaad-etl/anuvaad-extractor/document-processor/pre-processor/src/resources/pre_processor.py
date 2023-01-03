from flask_restful import Resource
from flask.json import jsonify
from flask import request
from src.services.remove_watermark import clean_image
import config
import os
from src.resources.response_generation import Response
import json
from src.utilities import app_context
from uuid import uuid4
from src.utilities.request_parse import get_files, File
from shutil import copyfile
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception, log_error
from src.errors.error_validator import ValidationResponse
from src.errors.errors_exception import FormatError
from src.utilities.model_response import Status
import time
from src.errors.error_validator import ValidationResponse 
from src.utilities.utils import FileOperation


file_ops = FileOperation()
DOWNLOAD_FOLDER =file_ops.file_download(config.download_folder)

class PreProcessor(Resource):


    # reading json request and reurnung final response
    def post(self):
        json_data = request.get_json()
        # with open('data.json', 'w') as f:
        #     json.dump(body, f)
        upload_id = str(uuid4())
        filename = json_data['input']['inputs'][0]['file']['path']
        app_context.init()
        app_context.application_context = json_data
        log_info("pre-processor service started", app_context.application_context)
        task_id = str("BM-" + str(time.time()).replace('.', '')[0:13])
        task_starttime  =  eval(str(time.time()).replace('.', '')[0:13])
        #json_data = request.get_json(force = True)
        try:
            error_validator = ValidationResponse(DOWNLOAD_FOLDER)
            if error_validator.format_error(json_data) is True:
                response_gen = Response(json_data, DOWNLOAD_FOLDER)
                response = response_gen.workflow_response(task_id, task_starttime)
                log_info("pre-process api response completed", app_context.application_context)
                return jsonify(response)
        except FormatError as e:
            log_error("pre-process Input json format is not correct or dict_key is missing", app_context.application_context, e)
            return Status.ERR_request_input_format.value
        # print(filename,"filename")
        # filepath = os.path.join(config.download_folder, filename)
        # return jsonify({'msg':"working"})