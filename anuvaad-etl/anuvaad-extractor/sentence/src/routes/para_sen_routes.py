from flask import Blueprint
from flask_restful import Api
from src.resources.para_sen import SenTokenisePostWF
from src.resources.para_sen import SentenceTokenise

TOK_BLUEPRINT = Blueprint("sentence_extraction", __name__)
api = Api(TOK_BLUEPRINT)
api.add_resource(SentenceTokenise, "/tokenisation")

TOK_BLUEPRINT_wf = Blueprint("paragraph_sentence_extraction_wf", __name__)
api_wf = Api(TOK_BLUEPRINT_wf)
api_wf.add_resource(SenTokenisePostWF, "/tokenisation-wf")