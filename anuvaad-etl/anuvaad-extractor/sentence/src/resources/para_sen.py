import os
import json
from flask_restful import reqparse, Resource
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

class SenTokenisePost(Resource):
    
    def post(self):
        task_id = str("TOK-" + str(int(time.time())))
        task_starttime = int(time.time())
        json_data = request.get_json(force = True)
        input_files, workflow_id, jobid = file_ops.json_input_format(json_data)
        if jobid == "" or jobid is None:
            task_endtime = int(time.time())
            response = CustomResponse(Status.ERR_jobid_NOT_FOUND.value, jobid, workflow_id, task_id, task_starttime, task_endtime, input_files)
            return response.get_response()
        elif workflow_id == "" or workflow_id is None:
            task_endtime = int(time.time())
            response = CustomResponse(Status.ERR_Workflow_id_NOT_FOUND.value, jobid, workflow_id, task_id, task_starttime, task_endtime, input_files)
            return response.get_response()
        else:
            return checking_file_response(jobid, workflow_id, task_id, task_starttime, input_files, DOWNLOAD_FOLDER)