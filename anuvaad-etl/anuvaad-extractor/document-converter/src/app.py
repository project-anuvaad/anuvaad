from flask import Flask
from flask.blueprints import Blueprint
from flask_cors import CORS
import routes
import config
from anuvaad_auditor.loghandler import log_info
from utilities import MODULE_CONTEXT

doc_app  = Flask(__name__)

if config.ENABLE_CORS:
    cors    = CORS(doc_app, resources={r"/api/*": {"origins": "*"}})

for blueprint in vars(routes).values():
    if isinstance(blueprint, Blueprint):
        doc_app.register_blueprint(blueprint, url_prefix=config.context_path)


if __name__ == "__main__":
    log_info("starting server at {} at port {}".format(config.HOST, config.PORT), MODULE_CONTEXT)
    doc_app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)