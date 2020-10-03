from flask import Flask
from flask.blueprints import Blueprint
from flask_cors import CORS
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
import routes
import config
import logging
import time
from db.conmgr_mongo import connectmongo

log = logging.getLogger('file')
tok_app  = Flask(__name__)

if config.ENABLE_CORS:
    cors    = CORS(tok_app, resources={r"/api/*": {"origins": "*"}})

for blueprint in vars(routes).values():
    if isinstance(blueprint, Blueprint):
        tok_app.register_blueprint(blueprint, url_prefix=config.API_URL_PREFIX)

from models.sentence import Sentence
s = Sentence()
sent = s.get_block_by_s_id('1d35c8f8-b833-45a7-9f6a-62e432b83939--')
print(sent)

# sent['pred_score'] = 100
# print(s.update_sentence_by_s_id(sent, sent['s_id']))


# if __name__ == "__main__":
#     connectmongo()
#     tok_app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)
    
