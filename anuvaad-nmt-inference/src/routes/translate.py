from flask import Blueprint
from flask_restful import Api

from resources import InteractiveTranslateResource, InteractiveMultiTranslateResource, OpenNMTTranslateResource

TRANSLATE_BLUEPRINT = Blueprint("translate", __name__)

Api(TRANSLATE_BLUEPRINT).add_resource(
    InteractiveTranslateResource, "/interactive-translation"
)

Api(TRANSLATE_BLUEPRINT).add_resource(
    InteractiveMultiTranslateResource, "/v1/interactive-translation"
)

Api(TRANSLATE_BLUEPRINT).add_resource(
    OpenNMTTranslateResource, "/translate-anuvaad"
)