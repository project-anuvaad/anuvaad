from flask import Blueprint
from flask_restful import Api
from src.resources.module import Module_Name
from src.resources.module import Module_Name_WF

# end-point for independent service
Module_Name_BLUEPRINT = Blueprint("module_name", __name__)
api = Api(Module_Name_BLUEPRINT)
api.add_resource(Module_Name, "/module_name")

# end-point for workflow service
Module_Name_BLUEPRINT_WF = Blueprint("module_name workflow", __name__)
api_wf = Api(Module_Name_BLUEPRINT_WF)
api_wf.add_resource(Module_Name_WF, "/module_name-wf")