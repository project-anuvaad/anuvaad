from flask import Blueprint
from flask_restful import Api

from resources import FileContentGetResource, FileContentSaveResource, FileContentUpdateResource

FILE_CONTENT_BLUEPRINT = Blueprint("file_content", __name__)

Api(FILE_CONTENT_BLUEPRINT).add_resource(
    FileContentGetResource, "/fetch-content"
)

Api(FILE_CONTENT_BLUEPRINT).add_resource(
    FileContentSaveResource, "/save-content"
)

Api(FILE_CONTENT_BLUEPRINT).add_resource(
    FileContentUpdateResource, "/update-content"
)
