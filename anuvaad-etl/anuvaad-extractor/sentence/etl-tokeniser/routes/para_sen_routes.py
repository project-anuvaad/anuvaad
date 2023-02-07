from flask import Blueprint
from flask_restful import Api
from resources.para_sen import SenTokenisePostWF
from resources.para_sen import SentenceTokenise
from resources.para_sen import BlockTokenize
from resources.para_sen import AnuvaadFeedback

# end-point for independent service
TOK_BLUEPRINT = Blueprint("sentence_extraction", __name__)
api = Api(TOK_BLUEPRINT)
api.add_resource(SentenceTokenise, "/v0/tokenisation")

# end-point for workflow service
TOK_BLUEPRINT_wf = Blueprint("paragraph_sentence_extraction_wf", __name__)
api_wf = Api(TOK_BLUEPRINT_wf)
api_wf.add_resource(SenTokenisePostWF, "/v0/tokenisation-wf")

# end-point for independent blocks tokenisation
TOK_BLOCK_BLUEPRINT_wf = Blueprint("block_text_sentence_extraction_wf", __name__)
api_wf = Api(TOK_BLOCK_BLUEPRINT_wf)
api_wf.add_resource(BlockTokenize, "/v0/blocks-tokenisation-wf")

# end-point for independent blocks tokenisation
TOK_PARAGRAPH_BLUEPRINT_wf = Blueprint("paragraphs_text_sentence_extraction_wf", __name__)
api_wf = Api(TOK_PARAGRAPH_BLUEPRINT_wf)
api_wf.add_resource(SenTokenisePostWF, "/v0/paragraphs-tokenisation-wf")


# TOK_PARAGRAPH_BLUEPRINT_wf = Blueprint("feedback", __name__)
# api_wf = Api(TOK_PARAGRAPH_BLUEPRINT_wf)
# api_wf.add_resource(AnuvaadFeedback, "/v0/feedback")