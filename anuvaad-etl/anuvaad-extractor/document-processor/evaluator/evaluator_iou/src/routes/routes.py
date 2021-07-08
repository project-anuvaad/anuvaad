from flask import Blueprint
from flask_restful import Api
from src.resources.module import Evaluator
from src.resources.module import Evaluator_WF

# end-point for independent service
Evaluator_BLUEPRINT = Blueprint("evaluator", __name__)
api = Api(Evaluator_BLUEPRINT)
api.add_resource(Evaluator, "/v0/process")

# end-point for workflow service
Evaluator_BLUEPRINT_WF = Blueprint("evaluator workflow", __name__)
api_wf = Api(Evaluator_BLUEPRINT_WF)
api_wf.add_resource(Evaluator_WF, "/v0/process_wf")