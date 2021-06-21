from flask import Blueprint
from flask_restful import Api

from resources import FileContentGetResource, FileContentSaveResource, FileContentUpdateResource, FileContentStoreReference, FileContentGetReference

FILE_CONTENT_BLUEPRINT = Blueprint("file_content", __name__)

Api(FILE_CONTENT_BLUEPRINT).add_resource(
    FileContentGetResource, "/v0/fetch-content"
)

Api(FILE_CONTENT_BLUEPRINT).add_resource(
    FileContentSaveResource, "/v0/save-content"
)

Api(FILE_CONTENT_BLUEPRINT).add_resource(
    FileContentUpdateResource, "/v0/update-content"
)

Api(FILE_CONTENT_BLUEPRINT).add_resource(
    FileContentStoreReference, "/v0/ref-link/store"
)

Api(FILE_CONTENT_BLUEPRINT).add_resource(
    FileContentGetReference, "/v0/ref-link/fetch"
)