import os
import json
from flask_restful import Resource
from flask.json import jsonify
from flask import request
from src.services.service import Annotation
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

# NER annotation
file_ops = FileOperation()
DOWNLOAD_FOLDER =file_ops.create_file_upload_dir(config.download_folder)
log = logging.getLogger('file')

class NERresources(Resource):
    
    def post(self):
        log.info("NER service started")
        task_id = str("NER-" + str(time.time()).replace('.', ''))
        task_starttime = str(time.time()).replace('.', '')
        json_data = request.get_json(force = True)
        input_files, workflow_id, jobid, tool_name, step_order = file_ops.json_input_format(json_data)
        file_value_response = checking_file_response(jobid, workflow_id, tool_name, step_order, task_id, task_starttime, input_files, DOWNLOAD_FOLDER)
        log.info("NER response generated for rest service")
        return file_value_response.get_response()