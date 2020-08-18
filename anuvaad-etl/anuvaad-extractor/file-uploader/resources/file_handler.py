from flask_restful import fields, marshal_with, reqparse, Resource
from models.response import CustomResponse
from models.status import Status
import werkzeug
from flask import send_file
import os
import config
import logging
import uuid
import magic

ALLOWED_FILE_TYPES = config.ALLOWED_FILE_TYPES
parser = reqparse.RequestParser(bundle_errors=True)

class FileUploader(Resource):

    def post(self):
        parse = reqparse.RequestParser()
        parse.add_argument('file', type=werkzeug.datastructures.FileStorage, location='files',help='File is required', required=True)
        args = parse.parse_args()
        f = args['file']
        filename = str(uuid.uuid4())+'_'+f.filename
        filepath = os.path.join(config.download_folder, filename)
        f.save(filepath)
        with open(filepath, 'rb') as f:
            filetype = magic.from_buffer(f.read(), mime=True)
            f.close()
            if filetype in ALLOWED_FILE_TYPES:
                res = CustomResponse(Status.SUCCESS.value, filename)
                return res.getres()
            else:
                f.close()
                os.remove(filepath)
                res = CustomResponse(Status.ERROR_UNSUPPORTED_FILE.value, None)
                return res.getresjson(), 400
        

class FileDownloader(Resource):
    def get(self):
        parse = reqparse.RequestParser()
        parse.add_argument('filename', type=str, location='args',help='Filename is required', required=True)
        args = parse.parse_args()
        filename = args['filename']
        filepath = os.path.join(config.download_folder, filename)
        if(os.path.exists(filepath)):
            result = send_file(filepath, as_attachment=True)
            result.headers["x-suggested-filename"] = filename
            return result
        else:
            res = CustomResponse(Status.ERROR_NOTFOUND_FILE.value, None)
            return res.getresjson(), 400