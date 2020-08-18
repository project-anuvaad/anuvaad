from flask_restful import fields, marshal_with, reqparse, Resource
from flask import request
from models.response import CustomResponse
from models.status import Status
import werkzeug
from flask import send_file
import os
import config
import logging
import uuid
from datetime import datetime
import magic
from models.user_files import UserFiles

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
                userfile = UserFiles(created_by=request.headers.get('ad-userid'),
                                            filename=filename, created_on=datetime.now())
                userfile.save()
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
        parse.add_argument('userid', type=str, location='args',help='UserId is required', required=True)
        args = parse.parse_args()
        filename = args['filename']
        userid = args['userid']
        filepath = os.path.join(config.download_folder, filename)
        userfiles = UserFiles.objects(filename=filename,created_by=userid)
        if userfiles is not None and len(userfiles) > 0:
            if(os.path.exists(filepath)):
                result = send_file(filepath, as_attachment=True)
                result.headers["x-suggested-filename"] = filename
                return result
            else:
                res = CustomResponse(Status.ERROR_NOTFOUND_FILE.value, None)
                return res.getresjson(), 400
        else:
            res = CustomResponse(Status.ERROR_NOTFOUND_FILE.value, None)
            return res.getresjson(), 400