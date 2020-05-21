from flask import Flask
from flask.blueprints import Blueprint
from flask_cors import CORS
from src import routes
import config

tok_app  = Flask(__name__)

if config.ENABLE_CORS:
    cors    = CORS(tok_app, resources={r"/api/*": {"origins": "*"}})

for blueprint in vars(routes).values():
    if isinstance(blueprint, Blueprint):
        tok_app.register_blueprint(blueprint, url_prefix=config.API_URL_PREFIX)

if __name__ == "__main__":
    tok_app.run(host=config.HOST, port=config.PORT, debug=True)