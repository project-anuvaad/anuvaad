from flask import Blueprint
from flask_restful import Api

from resources import SentenceGetResource, SentencePostResource, SentenceBlockGetResource

TRANSLATE_BLUEPRINT = Blueprint("translate", __name__)

Api(TRANSLATE_BLUEPRINT).add_resource(
    SentenceGetResource, "/v1/interactive-translation"
)

Api(TRANSLATE_BLUEPRINT).add_resource(
    SentenceBlockGetResource, "/interactive-translation"
)

Api(TRANSLATE_BLUEPRINT).add_resource(
    SentencePostResource, "/translate-anuvaad"
)