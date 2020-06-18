import os
import json
from flask_restful import Resource
from flask.json import jsonify
from flask import Flask, request
from src.services.service import Tokenisation
from src.utilities.utils import FileOperation
from src.utilities.model_response import Status
from src.utilities.model_response import CustomResponse
from src.utilities.model_response import checking_file_response
import werkzeug
from werkzeug.utils import secure_filename
import uuid
import config
import logging
import time

# sentence tokenisation
file_ops = FileOperation()
DOWNLOAD_FOLDER =file_ops.file_download(config.download_folder)
log = logging.getLogger('file')

class SenTokenisePost(Resource):
    
    def post(self):
        task_id = str("TOK-" + str(time.time()).replace('.', ''))
        task_starttime = str(time.time()).replace('.', '')
        json_data = request.get_json(force = True)
        input_files, workflow_id, jobid, tool_name, step_order = file_ops.json_input_format(json_data)
        file_value_response = checking_file_response(jobid, workflow_id, tool_name, step_order, task_id, task_starttime, input_files, DOWNLOAD_FOLDER)
        log.info("Tokenisation completed!!!")
        return file_value_response.status_code