from flask import Blueprint
from flask_restful import Api

from resources import ModelConvertResource

MODEL_CONVERT_BLUEPRINT = Blueprint("model_convert", __name__)

Api(MODEL_CONVERT_BLUEPRINT).add_resource(
    ModelConvertResource, "/interactive-model-convert"
)
