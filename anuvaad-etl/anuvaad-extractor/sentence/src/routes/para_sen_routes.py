from flask import Blueprint
from flask_restful import Api

from resources.para_sen import sen_tokenise

TOK_BLUEPRINT = Blueprint("paragraph_sentence_extraction", __name__)
api = Api(TOK_BLUEPRINT)
api.add_resource(sen_tokenise, "/para_to_sen")