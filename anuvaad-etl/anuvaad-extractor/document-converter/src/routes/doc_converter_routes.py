from flask import Blueprint
from flask_restful import Api
from resources import DocumentExporterResource, DocumentConverter

# end-point for independent service
DOCUMENT_CONVERTER_BLUEPRINT = Blueprint("document_converter", __name__)

Api(DOCUMENT_CONVERTER_BLUEPRINT).add_resource(DocumentConverter, "/v0/document-converter")

Api(DOCUMENT_CONVERTER_BLUEPRINT).add_resource(DocumentExporterResource, "/v0/document-exporter")