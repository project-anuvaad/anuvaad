from flask import Blueprint
from flask_restful import Api
from src.resources.module import Tesseract_OCR
from src.resources.module import Tesseract_OCR_WF

# end-point for independent service
Tesseract_OCR_BLUEPRINT = Blueprint("tesseract_ocr", __name__)
api = Api(Tesseract_OCR_BLUEPRINT)
api.add_resource(Tesseract_OCR, "/v0/extract-text")

# end-point for workflow service
Tesseract_OCR_BLUEPRINT_WF = Blueprint("tesseract_ocr workflow", __name__)
api_wf = Api(Tesseract_OCR_BLUEPRINT_WF)
api_wf.add_resource(Tesseract_OCR_WF, "/v0/extract-text_wf")