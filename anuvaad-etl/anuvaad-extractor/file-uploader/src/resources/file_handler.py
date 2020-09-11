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
import json

ALLOWED_FILE_TYPES = config.ALLOWED_FILE_TYPES
ALLOWED_FILE_EXTENSIONS = config.ALLOWED_FILE_EXTENSIONS
parser = reqparse.RequestParser(bundle_errors=True)

class FileUploader(Resource):

    def post(self):
        parse = reqparse.RequestParser()
        parse.add_argument('file', type=werkzeug.datastructures.FileStorage, location='files',help='File is required', required=True)
        args = parse.parse_args()
        f = args['file']
        # file_real_name, file_extension = os.path.splitext(f.filename)
        # filename = str(uuid.uuid4())+file_extension
        # filepath = os.path.join(config.download_folder, filename)
        # f.save(filepath)
        # with open(filepath, 'rb') as f:
        #     filetype = magic.from_buffer(f.read(), mime=True)
        #     f.close()
        #     if filetype in ALLOWED_FILE_TYPES:
        #         userfile = UserFiles(created_by=request.headers.get('ad-userid'),
        #                                     filename=filename,file_real_name=file_real_name+file_extension, created_on=datetime.now())
        #         userfile.save()
        #         res = CustomResponse(Status.SUCCESS.value, filename)
        #         return res.getres()
        #     else:
        #         f.close()
        #         os.remove(filepath)
        #         res = CustomResponse(Status.ERROR_UNSUPPORTED_FILE.value, None)
        #         return res.getresjson(), 400
        file_real_name, file_extension = os.path.splitext(f.filename)
        fileallowed = False
        filename = str(uuid.uuid4())+file_extension
        f.seek(0, os.SEEK_END)
        file_size = f.tell()/(1024*1024)
        filepath = os.path.join(config.download_folder, filename)
        if file_size  > 20:
            res = CustomResponse(Status.ERROR_FILE_SIZE.value, None)
            return res.getresjson(), 400
        for allowed_file_extension in ALLOWED_FILE_EXTENSIONS:
            if file_extension.endswith(allowed_file_extension):
                fileallowed = True
                break
        if fileallowed:
            f.save(filepath)
            userfile = UserFiles(created_by=request.headers.get('ad-userid'),
                                            filename=filename,file_real_name=file_real_name+file_extension, created_on=datetime.now())
            userfile.save()
            res = CustomResponse(Status.SUCCESS.value, filename)
            return res.getres()
        else:
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


class FileServe(Resource):

    def get(self):
        parse = reqparse.RequestParser()
        parse.add_argument('filename', type=str, location='args',help='Filename is required', required=True)
        args = parse.parse_args()
        filename = args['filename']
        filepath = os.path.join(config.download_folder, filename)
        if(os.path.exists(filepath)):
            with open(filepath) as json_file:
                data = json.load(json_file)
                res = CustomResponse(Status.SUCCESS.value, data)
                return res.getres()
        else:
            res = CustomResponse(Status.ERROR_NOTFOUND_FILE.value, None)
            return res.getresjson(), 400