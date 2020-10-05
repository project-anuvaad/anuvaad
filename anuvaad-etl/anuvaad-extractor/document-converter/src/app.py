from flask import Flask
from flask.blueprints import Blueprint
from flask_cors import CORS
import routes
import config
import logging
from logging.config import dictConfig

log = logging.getLogger()

doc_app  = Flask(__name__)

if config.ENABLE_CORS:
    cors    = CORS(doc_app, resources={r"/api/*": {"origins": "*"}})

for blueprint in vars(routes).values():
    if isinstance(blueprint, Blueprint):
        doc_app.register_blueprint(blueprint, url_prefix=config.API_URL_PREFIX)


if __name__ == "__main__":
    log.info("server up")
    doc_app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)