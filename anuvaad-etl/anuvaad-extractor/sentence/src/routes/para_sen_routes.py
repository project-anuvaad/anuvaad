from flask import Blueprint
from flask_restful import Api

from src.resources.para_sen import SenTokenisePost

TOK_BLUEPRINT = Blueprint("paragraph_sentence_extraction", __name__)
api = Api(TOK_BLUEPRINT)
api.add_resource(SenTokenisePost, "/para_to_sen")