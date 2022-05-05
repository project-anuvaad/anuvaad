from flask import Blueprint
from flask_restful import Api
from resources import GenerateIdToken

EXTENSION_BLUEPRINT = Blueprint("browser-extensions", __name__)

Api(EXTENSION_BLUEPRINT).add_resource(
    GenerateIdToken, "/v1/extension/users/get/token"
)


