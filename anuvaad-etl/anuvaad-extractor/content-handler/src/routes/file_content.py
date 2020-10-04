from flask import Blueprint
from flask_restful import Api

from resources import FileContentGETResource, FileContentPOSTResource

FILE_CONTENT_BLUEPRINT = Blueprint("file_content", __name__)

Api(FILE_CONTENT_BLUEPRINT).add_resource(
    FileContentGETResource, "/file-content/<user_id>/<record_id>"
)
Api(FILE_CONTENT_BLUEPRINT).add_resource(
    FileContentPOSTResource, "/file-content/<user_id>"
)