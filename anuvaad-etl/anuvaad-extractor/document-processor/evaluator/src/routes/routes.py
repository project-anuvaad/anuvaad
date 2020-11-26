from flask import Blueprint
from flask_restful import Api
from src.resources.module import Layout_Detector
from src.resources.module import Layout_Detector_WF

# end-point for independent service
Layout_Detector_BLUEPRINT = Blueprint("evaluator", __name__)
api = Api(Layout_Detector_BLUEPRINT)
api.add_resource(Layout_Detector, "/evaluator/v0/process")

# end-point for workflow service
Layout_Detector_BLUEPRINT_WF = Blueprint("evaluator workflow", __name__)
api_wf = Api(Layout_Detector_BLUEPRINT_WF)
api_wf.add_resource(Layout_Detector_WF, "/evaluator/v0/process_wf")