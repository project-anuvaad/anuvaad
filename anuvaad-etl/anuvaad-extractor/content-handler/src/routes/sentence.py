from flask import Blueprint
from flask_restful import Api

from resources import SaveSentenceResource, FetchSentenceResource

SENTENCE_BLUEPRINT = Blueprint("sentence", __name__)

Api(SENTENCE_BLUEPRINT).add_resource(
    FetchSentenceResource, "/fetch-content-sentence"
)

Api(SENTENCE_BLUEPRINT).add_resource(
    SaveSentenceResource, "/save-content-sentence"
)