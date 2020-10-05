from flask_restful import Resource
from flask import request
from models.response import CustomResponse
from models.status import Status
import config
import logging
from utilities.utils import FileUtilities
from services.service import document_saving

file_ops = FileUtilities()
DOWNLOAD_FOLDER =file_ops.file_download(config.download_folder)
log = logging.getLogger()
    

class DocumentConverter(Resource):

    def post(self):
        body = request.get_json()
        log.info("request received")
        record_id = body['record_id']
        user_id = body['user_id']
        if 'record_id' not in body or record_id is None or 'user_id' not in body or user_id is None:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value,None)
            return res.getresjson(), 400
        document_saving(record_id, user_id, DOWNLOAD_FOLDER)
        log.info("document saved")
        res = CustomResponse(Status.SUCCESS.value, None)
        return res.getres()