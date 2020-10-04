from flask import Blueprint
from flask_restful import Api

from resources import SentenceGETResource, SentencePOSTResource

SENTENCE_BLUEPRINT = Blueprint("sentence", __name__)

Api(SENTENCE_BLUEPRINT).add_resource(
    SentenceGETResource, "/sentence/<user_id>/<s_id>"
)

Api(SENTENCE_BLUEPRINT).add_resource(
    SentencePOSTResource, "/sentence/<user_id>"
)