from flask import Blueprint
from flask_restful import Api

from resources import DigitalDocumentGetResource, DigitalDocumentSaveResource, DigitalDocumentUpdateWordResource

OCR_DOCUMENT_BLUEPRINT = Blueprint("ocr_document", __name__)

Api(OCR_DOCUMENT_BLUEPRINT).add_resource(
    DigitalDocumentSaveResource, "/v0/ocr/save-document"
)

Api(OCR_DOCUMENT_BLUEPRINT).add_resource(
    DigitalDocumentUpdateWordResource, "/v0/ocr/update-word"
)

Api(OCR_DOCUMENT_BLUEPRINT).add_resource(
    DigitalDocumentGetResource, "/v0/ocr/fetch-document"
)

