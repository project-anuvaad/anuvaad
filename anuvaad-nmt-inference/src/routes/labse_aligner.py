from flask import Blueprint
from flask_restful import Api
import config

from resources import LabseAlignerResource

LABSE_ALIGNER_BLUEPRINT = Blueprint("labse-aligner", __name__)

Api(LABSE_ALIGNER_BLUEPRINT).add_resource(
    LabseAlignerResource, config.MODULE_NAME + "/v1/labse-aligner"
)
