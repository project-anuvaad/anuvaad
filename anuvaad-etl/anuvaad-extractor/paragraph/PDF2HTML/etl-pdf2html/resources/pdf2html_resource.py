from flask_restful import Resource
from flask.json import jsonify
from flask import request
from utilities.utils import FileOperation
from utilities.model_response import CheckingResponse
import config
import logging
import time

file_ops = FileOperation()
DOWNLOAD_FOLDER =file_ops.create_file_download_dir(config.download_folder)
log = logging.getLogger('file')

# rest request for pdf2html workflow service
class Pdf2HtmlConversionWF(Resource):

    # reading json request and reurnung final response
    def post(self):
        log.info("Pdf to HTML conversion started")
        task_id = str("Pdf2Html-" + str(time.time()).replace('.', ''))
        task_starttime = str(time.time()).replace('.', '')
        json_data = request.get_json(force = True)
        checking_response = CheckingResponse(json_data, task_id, task_starttime, DOWNLOAD_FOLDER)
        file_value_response = checking_response.main_response_wf(rest_request=True)
        log.info("Conversion completed")
        return jsonify(file_value_response)


# rest request for pdf2html individual service
class Pdf2HtmlConversion(Resource):

    # reading json request and reurnung final response
    def post(self):
        log.info("Individual operation of Pdf2Html service strated.")
        json_data = request.get_json(force=True)
        task_id, task_starttime = "", ""
        checking_response = CheckingResponse(json_data, task_id, task_starttime, DOWNLOAD_FOLDER)
        file_only_response = checking_response.main_response_files_only()
        log.info("response successfully generated.")
        return jsonify(file_only_response)