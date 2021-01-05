from flask import Blueprint
from flask_restful import Api
import config

from resources import BatchNMTPerformanceResource

PERFORMANCE_BLUEPRINT = Blueprint("performance", __name__)

Api(PERFORMANCE_BLUEPRINT).add_resource(
    BatchNMTPerformanceResource, config.MODULE_NAME + "/v1/performance"
)