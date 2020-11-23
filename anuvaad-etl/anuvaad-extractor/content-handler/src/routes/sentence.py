from flask import Blueprint
from flask_restful import Api

from resources import SaveSentenceResource, FetchSentenceResource, SentenceStatisticsCount

SENTENCE_BLUEPRINT = Blueprint("sentence", __name__)

Api(SENTENCE_BLUEPRINT).add_resource(
    FetchSentenceResource, "/v0/fetch-content-sentence"
)

Api(SENTENCE_BLUEPRINT).add_resource(
    SaveSentenceResource, "/v0/save-content-sentence"
)

Api(SENTENCE_BLUEPRINT).add_resource(
    SentenceStatisticsCount, "/v0/records/search"
)
