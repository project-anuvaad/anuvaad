from flask import Blueprint
from flask_restful import Api
from src.resources.module import Vision_OCR
from src.resources.module import Vision_OCR_WF

# end-point for independent service
Vision_OCR_BLUEPRINT = Blueprint("vision_ocr", __name__)
api = Api(Vision_OCR_BLUEPRINT)
api.add_resource(Vision_OCR, "/v0/extract-text")

# end-point for workflow service
Vision_OCR_BLUEPRINT_WF = Blueprint("vision_ocr workflow", __name__)
api_wf = Api(Vision_OCR_BLUEPRINT_WF)
api_wf.add_resource(Vision_OCR_WF, "/v0/extract-text_wf")