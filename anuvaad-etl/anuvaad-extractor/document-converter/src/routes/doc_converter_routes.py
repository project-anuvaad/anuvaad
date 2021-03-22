from flask import Blueprint
from flask_restful import Api
from resources import DocumentExporterResource

# end-point for independent service
DOCUMENT_CONVERTER_BLUEPRINT = Blueprint("document_converter", __name__)
api = Api(DOCUMENT_CONVERTER_BLUEPRINT)
api.add_resource(DocumentExporterResource, "/v0/document-converter")