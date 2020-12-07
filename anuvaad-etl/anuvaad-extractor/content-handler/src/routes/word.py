from flask import Blueprint
from flask_restful import Api

from resources import WordSaveResource, WordSearch

WORD_BLUEPRINT = Blueprint("word", __name__)

Api(WORD_BLUEPRINT).add_resource(
    WordSaveResource, "/v0/dictionary/update"
)

Api(WORD_BLUEPRINT).add_resource(
    WordSearch, "/v0/dictionary/search"
)
