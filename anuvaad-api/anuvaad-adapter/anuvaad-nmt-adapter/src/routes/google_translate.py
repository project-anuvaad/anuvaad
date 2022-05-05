from flask import Blueprint
from flask_restful import Api
import config
from resources import GoogleTranslate_v3

GOOGLE_BLUEPRINT = Blueprint("translate", __name__)

Api(GOOGLE_BLUEPRINT).add_resource(
    GoogleTranslate_v3, config.MODULE_NAME + "/gnmt/v0/translate"
)


