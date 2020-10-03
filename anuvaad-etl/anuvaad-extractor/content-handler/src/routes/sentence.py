from flask import Blueprint
from flask_restful import Api

from resources import SentenceResource

SENTENCE_BLUEPRINT = Blueprint("sentence", __name__)

Api(SENTENCE_BLUEPRINT).add_resource(
    SentenceResource, "/sentence/<s_id>"
)