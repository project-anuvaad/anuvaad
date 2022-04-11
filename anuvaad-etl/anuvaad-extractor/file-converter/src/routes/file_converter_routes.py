from flask import Blueprint
from flask_restful import Api
from resources.file_converter import FileConverter

# end-point for independent service
FILE_CONVERTER_BLUEPRINT = Blueprint("file_converter", __name__)
api = Api(FILE_CONVERTER_BLUEPRINT)
api.add_resource(FileConverter, "/v0/convert-pdf")
