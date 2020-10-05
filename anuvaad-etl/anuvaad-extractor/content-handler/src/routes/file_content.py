from flask import Blueprint
from flask_restful import Api

from resources import FileContentGetResource, FileContentSaveResource, FileContentUpdateResource

FILE_CONTENT_BLUEPRINT = Blueprint("file_content", __name__)

Api(FILE_CONTENT_BLUEPRINT).add_resource(
    FileContentGetResource, "/ch/fetch-content"
)

Api(FILE_CONTENT_BLUEPRINT).add_resource(
    FileContentSaveResource, "/ch/save-content"
)

Api(FILE_CONTENT_BLUEPRINT).add_resource(
    FileContentUpdateResource, "/ch/update-content"
)
