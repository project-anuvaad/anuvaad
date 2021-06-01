from flask import Blueprint
from flask_restful import Api
import config

from resources import CreateModelResource,UpdateModelsResource,DeleteModelResource,FetchModelsResource,FetchSingleModelResource,FetchModelsResource_v2,FetchSingleModelIDResource

CREATE_MODELS_BLUEPRINT = Blueprint("create-models",__name__)

Api(CREATE_MODELS_BLUEPRINT).add_resource(
    CreateModelResource, config.MODULE_NAME + "/v1/create-models"
)

Api(CREATE_MODELS_BLUEPRINT).add_resource(
    UpdateModelsResource, config.MODULE_NAME + "/v1/update-models/<string:id>"
)

Api(CREATE_MODELS_BLUEPRINT).add_resource(
    DeleteModelResource, config.MODULE_NAME + "/v1/delete-models/<string:id>"
)

FETCH_MODELS_BLUEPRINT = Blueprint("fetch-models", __name__)

Api(FETCH_MODELS_BLUEPRINT).add_resource(
    FetchModelsResource, config.MODULE_NAME + "/v1/fetch-models"
)

Api(FETCH_MODELS_BLUEPRINT).add_resource(
    FetchModelsResource_v2, config.MODULE_NAME + "/v2/fetch-models"
)

Api(FETCH_MODELS_BLUEPRINT).add_resource(
    FetchSingleModelResource, config.MODULE_NAME + "/v2/fetch-models/<string:id>"
)

Api(FETCH_MODELS_BLUEPRINT).add_resource(
    FetchSingleModelIDResource, config.MODULE_NAME + "/v2/fetch-models/<int:model_id>"
)