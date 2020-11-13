from flask import Blueprint
from flask_restful import Api
from resources.doc_converter_resources import DocumentConverter

# end-point for independent service
DOCUMENT_CONVERTER_BLUEPRINT = Blueprint("document_converter", __name__)
api = Api(DOCUMENT_CONVERTER_BLUEPRINT)
api.add_resource(DocumentConverter, "/document-converter")