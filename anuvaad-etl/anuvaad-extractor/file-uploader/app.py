from flask import Flask
from flask.blueprints import Blueprint
from flask_cors import CORS
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
import routes
import config
import logging
import time

log = logging.getLogger('file')
tok_app  = Flask(__name__)


if config.ENABLE_CORS:
    cors    = CORS(tok_app, resources={r"/api/*": {"origins": "*"}})

for blueprint in vars(routes).values():
    if isinstance(blueprint, Blueprint):
        tok_app.register_blueprint(blueprint, url_prefix=config.API_URL_PREFIX)


if __name__ == "__main__":
    tok_app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)
    
