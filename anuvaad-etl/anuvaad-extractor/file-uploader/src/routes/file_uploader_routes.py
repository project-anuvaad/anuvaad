from flask import Blueprint
from flask_restful import Api
from resources.file_handler import FileUploader, FileDownloader

# end-point for independent service
FILE_UPLOADER_BLUEPRINT = Blueprint("file_uploader", __name__)
api = Api(FILE_UPLOADER_BLUEPRINT)
api.add_resource(FileUploader, "/upload-file")
api.add_resource(FileDownloader, "/download-file")
