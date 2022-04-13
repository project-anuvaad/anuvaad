from flask_restful import Resource
from flask.json import jsonify
from flask import request
from models.response import CustomResponse
from models.status import Status
from services.libre_converter import LibreOfficeError, convert_to
from common.errors import RestAPIError, InternalServerErrorError
from models.user_files import UserFiles
from subprocess import TimeoutExpired
import config
import time
import os
from uuid import uuid4
from datetime import datetime
from shutil import copyfile
import magic

# rest request for block merging individual service
class FileConverter(Resource):

    # reading json request and reurnung final response
    def post(self):
        body = request.get_json()
        upload_id = str(uuid4())
        filename = body['filename']
        filepath = os.path.join(config.download_folder, filename)
        # if filename.endswith('.pdf'):
        mime = magic.Magic(mime=True)
        if mime.from_file(filepath) == 'application/pdf':
            res = CustomResponse(Status.SUCCESS.value, filename)
            return res.getres()
        try:
            result = convert_to(os.path.join(config.download_folder, 'pdf', upload_id), filepath, timeout=60)
            copyfile(result, os.path.join(config.download_folder, upload_id+'.pdf'))
            userfile = UserFiles(created_by=request.headers.get('x-user-id'),
                                            filename=upload_id+'.pdf', created_on=datetime.now())
            userfile.save()
        except LibreOfficeError as e:
            raise InternalServerErrorError({'message': 'Error when converting file to PDF'})
        except TimeoutExpired:
            raise InternalServerErrorError({'message': 'Timeout when converting file to PDF'})
        res = CustomResponse(Status.SUCCESS.value, upload_id+'.pdf')
        return res.getres()
