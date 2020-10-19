from flask import Blueprint
from flask_restful import Api

from resources import WordSaveResource

WORD_BLUEPRINT = Blueprint("word", __name__)

Api(WORD_BLUEPRINT).add_resource(
    WordSaveResource, "/dictionary/update"
)

