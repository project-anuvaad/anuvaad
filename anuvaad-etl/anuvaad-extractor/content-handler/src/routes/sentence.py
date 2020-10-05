from flask import Blueprint
from flask_restful import Api

from resources import SentenceGetResource, SentencePostResource, SentenceBlockGetResource

SENTENCE_BLUEPRINT = Blueprint("sentence", __name__)

Api(SENTENCE_BLUEPRINT).add_resource(
    SentenceGetResource, "/sentence/<user_id>/<s_id>"
)

Api(SENTENCE_BLUEPRINT).add_resource(
    SentenceBlockGetResource, "/sentence/block/<user_id>/<s_id>"
)

Api(SENTENCE_BLUEPRINT).add_resource(
    SentencePostResource, "/sentence/<user_id>"
)