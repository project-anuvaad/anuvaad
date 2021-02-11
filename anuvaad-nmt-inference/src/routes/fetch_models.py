from flask import Blueprint
from flask_restful import Api
import config

from resources import FetchModelsResource

FETCH_MODELS_BLUEPRINT = Blueprint("fetch-models", __name__)

Api(FETCH_MODELS_BLUEPRINT).add_resource(
    FetchModelsResource, config.MODULE_NAME + "/v1/fetch-models"
)
