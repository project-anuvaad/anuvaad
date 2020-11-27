from flask import Blueprint
from flask_restful import Api
from src.resources.module import Word_Detector
from src.resources.module import Word_Detector_WF

# end-point for independent service
Word_Detector_BLUEPRINT = Blueprint("word_detector", __name__)
api = Api(Word_Detector_BLUEPRINT)
api.add_resource(Word_Detector, "/v0/craft/process")

# end-point for workflow service
Word_Detector_BLUEPRINT_WF = Blueprint("word_detector workflow", __name__)
api_wf = Api(Word_Detector_BLUEPRINT_WF)
api_wf.add_resource(Word_Detector_WF, " /v0/craft/process_wf")