from logging.config import dictConfig

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
# import services.service import private_user
from datetime import datetime
from models.user_files import UserFiles
from services.service import page_restrictions_pdf
from services.service import reduce_page
from services.service import is_file_empty

ALLOWED_FILE_TYPES = config.ALLOWED_FILE_TYPES
ALLOWED_FILE_EXTENSIONS = config.ALLOWED_FILE_EXTENSIONS
parser = reqparse.RequestParser(bundle_errors=True)
log = logging.getLogger('file')


class FileUploader(Resource):

    def post(self):
        try:
            log.info("Uploading file...")
            parse = reqparse.RequestParser()
            parse.add_argument('file', type=werkzeug.datastructures.FileStorage, location='files',
                               help='File is required', required=True)
            args = parse.parse_args()
            f = args['file']
            mime_type = f.mimetype
            log.info("Filename: " + str(f.filename))
            log.info("File MIME Type: " + str(mime_type))

            file_real_name, file_extension = os.path.splitext(f.filename)
           # print(file_extension)
            fileallowed = False
            filename = str(uuid.uuid4()) + file_extension
            # filename =  filenames + file_extension
            # log.info(f"TEST-1: filename ={filename}")
            filepath = os.path.join(config.download_folder, filename)
           # print(filepath)
            for allowed_file_extension in ALLOWED_FILE_EXTENSIONS:
                if file_extension.endswith(allowed_file_extension):
              #      print(allowed_file_extension)
                    fileallowed = True
                    break
            if fileallowed is False:
                if mime_type in ALLOWED_FILE_TYPES:
                    fileallowed = True


            if fileallowed:
                f.save(filepath)
                file_size = os.stat(filepath).st_size
                # log.info(f"Test-1: filesize = {file_size}")
                file_size_in_MB = file_size / (1024 * 1024)
                # log.info(f"TEST-1: size ={file_size_in_MB}")
                if file_size_in_MB > eval(str(config.MAX_UPLOAD_SIZE)):
                    os.remove(filepath)
                    res = CustomResponse(Status.ERROR_FILE_SIZE.value, None)
                    return res.getresjson(), 400
                # if is_file_empty(f, filepath) or file_size <= 0:
                if file_size <= 0:
                    os.remove(filepath)
                    res = CustomResponse(Status.FILE_BLANK_ERROR.value, None)
                    return res.getresjson(), 400

                #print(file_extension)
                if allowed_file_extension == 'pdf' :
                    page = page_restrictions_pdf(filename)
                    if page > config.page_limit:
                        os.remove(filepath)
                        res = CustomResponse(Status.ERROR_FILE_PAGE_BREAK.value, None)
                        return res.getresjson(), 413
                    # files_pager = reduce_page(filename, filepath, file_extension)


                userfile = UserFiles(created_by=request.headers.get('x-user-id'),
                                     filename=filename, file_real_name=file_real_name + file_extension, 
                                     created_on=datetime.now())
                userfile.save()
                log.error("SUCCESS: File Uploaded -- " + str(f.filename))
                res = CustomResponse(Status.SUCCESS.value, filename)
                return res.getres()
            else:
                log.error("ERROR: Unsupported File -- " + str(f.filename))
                res = CustomResponse(Status.ERROR_UNSUPPORTED_FILE.value, None)
                return res.getresjson(), 400
        except Exception as e:
            log.exception("Exception while uploading the file: " + str(e))
            res = CustomResponse(Status.FAILURE.value, None)
            return res.getresjson(), 500


class FileDownloader(Resource):

    def get(self):
        parse = reqparse.RequestParser()
        parse.add_argument('filename', type=str, location='args', help='Filename is required', required=True)
        parse.add_argument('userid', type=str, location='args', help='UserId is required', required=True)
        args = parse.parse_args()
        filename = args['filename']
        userid = args['userid']
        filepath = os.path.join(config.download_folder, filename)
        userfiles = UserFiles.objects(filename=filename, created_by=userid)
        if userfiles is not None and len(userfiles) > 0:
            if (os.path.exists(filepath)):
                result = send_file(filepath, as_attachment=True)
                result.headers["x-suggested-filename"] = filename
                return result
            else:
                res = CustomResponse(Status.ERROR_UNSUPPORTED_FILE.value, None)
                return res.getresjson(), 400
        else:
            res = CustomResponse(Status.ERROR_NOTFOUND_FILE.value, None)
            return res.getresjson(), 400


class FileServe(Resource):

    def get(self):
        parse = reqparse.RequestParser()
        parse.add_argument('filename', type=str, location='args', help='Filename is required', required=True)
        args = parse.parse_args()
        filename = args['filename']
        filepath = os.path.join(config.download_folder, filename)
        if (os.path.exists(filepath)):
            result = send_file(filepath, as_attachment=True)
            result.headers["x-suggested-filename"] = filename
            return result
        else:
            res = CustomResponse(Status.ERROR_NOTFOUND_FILE.value, None)
            return res.getresjson(), 400


# Log config
dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] {%(filename)s:%(lineno)d} %(threadName)s %(levelname)s in %(module)s: %(message)s',
    }},
    'handlers': {
        'info': {
            'class': 'logging.FileHandler',
            'level': 'DEBUG',
            'formatter': 'default',
            'filename': 'info.log'
        },
        'console': {
            'class': 'logging.StreamHandler',
            'level': 'DEBUG',
            'formatter': 'default',
            'stream': 'ext://sys.stdout',
        }
    },
    'loggers': {
        'file': {
            'level': 'DEBUG',
            'handlers': ['info', 'console'],
            'propagate': ''
        }
    },
    'root': {
        'level': 'DEBUG',
        'handlers': ['info', 'console']
    }
})
