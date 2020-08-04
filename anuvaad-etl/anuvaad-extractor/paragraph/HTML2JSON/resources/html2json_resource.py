import os
import json
from flask_restful import Resource
from flask.json import jsonify
from flask import request
from utilities.utils import FileOperation
from utilities.model_response import CheckingResponse
import werkzeug
from werkzeug.utils import secure_filename
import config
import logging
import time

file_ops = FileOperation()
DOWNLOAD_FOLDER =file_ops.create_file_download_dir(config.download_folder)
log = logging.getLogger('file')

# rest request for html2json workflow service
class Html2JsonConversionWF(Resource):

    # reading json request and reurnung final response
    def post(self):
        log.info("HTML to JSON conversion started")
        task_id = str("Html2Json-" + str(time.time()).replace('.', ''))
        task_starttime = str(time.time()).replace('.', '')
        json_data = request.get_json(force = True)
        checking_response = CheckingResponse(json_data, task_id, task_starttime, DOWNLOAD_FOLDER)
        file_value_response = checking_response.main_response_wf(rest_request=True)
        log.info("Conversion completed")
        return file_value_response

# rest request for html2json individual service
class Html2JsonConversion(Resource):

    # reading json request and reurnung final response
    def post(self):
        log.info("Individual operation of Html2Json service strated.")
        json_data = request.get_json(force=True)
        task_id, task_starttime = "", ""
        checking_response = CheckingResponse(json_data, task_id, task_starttime, DOWNLOAD_FOLDER)
        file_only_response = checking_response.main_response_files_only()
        log.info("response successfully generated.")
        return file_only_response
        