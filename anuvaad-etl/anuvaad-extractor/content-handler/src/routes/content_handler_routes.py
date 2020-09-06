from flask import Blueprint
from flask_restful import Api
from resources.content_handler import ContentHandler, FetchContentHandler, UpdateContentHandler

# end-point for independent service
CONTENT_HANDLER_BLUEPRINT = Blueprint("content_handler", __name__)
api = Api(CONTENT_HANDLER_BLUEPRINT)
api.add_resource(ContentHandler, "/save-content")
api.add_resource(FetchContentHandler, "/fetch-content")
api.add_resource(UpdateContentHandler, "/update-content")
