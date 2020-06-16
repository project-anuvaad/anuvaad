from flask import Flask
from flask.blueprints import Blueprint
from flask_cors import CORS
from src import routes
import config
import threading
import logging
import time

para_app  = Flask(__name__)

# try:
#     t1 = threading.Thread(target=process_tokenization_kf, name='keep_on_running')
#     t1.start()
# except Exception as e:
#     logging.info('ERROR WHILE RUNNING CUSTOM THREADS '+str(e))

if config.ENABLE_CORS:
    cors    = CORS(para_app, resources={r"/api/*": {"origins": "*"}})

for blueprint in vars(routes).values():
    if isinstance(blueprint, Blueprint):
        para_app.register_blueprint(blueprint, url_prefix=config.API_URL_PREFIX)


if __name__ == "__main__":
    para_app.run(host=config.HOST, port=config.PORT, debug=True)