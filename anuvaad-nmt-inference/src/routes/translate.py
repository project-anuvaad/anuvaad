from flask import Blueprint
from flask_restful import Api
import config

from resources import InteractiveTranslateResource, InteractiveMultiTranslateResource, OpenNMTTranslateResource,NMTTranslateResource, \
                      InteractiveMultiTranslateResourceNew, TranslateResourceV4, InteractiveMultiTranslateResourceV3, NMTTranslateResourceULCA

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

Api(TRANSLATE_BLUEPRINT).add_resource(
    NMTTranslateResource, config.MODULE_NAME + "/v3/translate-anuvaad"
)

Api(TRANSLATE_BLUEPRINT).add_resource(
    InteractiveMultiTranslateResourceNew, config.MODULE_NAME + "/v2/interactive-translation"
)

Api(TRANSLATE_BLUEPRINT).add_resource(
    TranslateResourceV4, config.MODULE_NAME + "/v4/translate"
)

Api(TRANSLATE_BLUEPRINT).add_resource(
    InteractiveMultiTranslateResourceV3, config.MODULE_NAME + "/v3/interactive-translation"
)

Api(TRANSLATE_BLUEPRINT).add_resource(
    NMTTranslateResourceULCA, config.MODULE_NAME + "/v0/translate"
)