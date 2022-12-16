from flask import Blueprint
from flask_restful import Api
from src.resources.pre_processor import PreProcessor

PRE_PROCESSOR_BLUEPRINT = Blueprint("pre_processor", __name__)
api = Api(PRE_PROCESSOR_BLUEPRINT)
api.add_resource(PreProcessor, "/vo/pre-process")