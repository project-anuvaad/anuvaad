from flask_restful import Resource
from flask.json import jsonify
from flask import request
from src.utilities.utils import FileOperation
from src.utilities.model_response import CustomResponse
from src.utilities.model_response import CheckingResponse
import config
import logging
import time

# sentence tokenisation
file_ops = FileOperation()
DOWNLOAD_FOLDER =file_ops.file_download(config.download_folder)
log = logging.getLogger('file')

class SenTokenisePostWF(Resource):
    
    def post(self):
        log.info("Tokenisation service started")
        task_id = str("TOK-" + str(time.time()).replace('.', ''))
        task_starttime = str(time.time()).replace('.', '')
        json_data = request.get_json(force = True)
        checking_response = CheckingResponse(json_data, task_id, task_starttime, DOWNLOAD_FOLDER)
        file_value_response = checking_response.main_response_wf(rest_request=True)
        log.info("Tokenisation completed!!!")
        return jsonify(file_value_response)


class SentenceTokenise(Resource):

    def post(self):
        log.info("Individual operation of tokenisation service strated.")
        json_data = request.get_json(force=True)
        task_id, task_starttime = "", ""
        checking_response = CheckingResponse(json_data, task_id, task_starttime, DOWNLOAD_FOLDER)
        file_only_response = checking_response.main_response_files_only()
        log.info("response successfully generated.")
        return jsonify(file_only_response)
