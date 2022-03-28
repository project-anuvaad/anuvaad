from flask import Blueprint
from flask_restful import Api
import config
from resources import HealthResource

HEALTH_BLUEPRINT = Blueprint("health", __name__)

Api(HEALTH_BLUEPRINT).add_resource(
    HealthResource, config.MODULE_NAME + "/health"
)
