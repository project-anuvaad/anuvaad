from flask import Blueprint
from flask_restful import Api

from resources import FileContentGetResource

MODEL_CONVERT_BLUEPRINT = Blueprint("model_convert", __name__)

Api(MODEL_CONVERT_BLUEPRINT).add_resource(
    FileContentGetResource, "/interactive-model-convert"
)
