from flask import Blueprint
from flask_restful import Api

from resources import FileContentResource

FILE_CONTENT_BLUEPRINT = Blueprint("file_content", __name__)

Api(FILE_CONTENT_BLUEPRINT).add_resource(
    FileContentResource, "/file-content/<user_id>"
)