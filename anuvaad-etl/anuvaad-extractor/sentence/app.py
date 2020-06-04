from src.services.kf_service import process_tokenization_kf
from src.utilities.model_response import checking_file_response
from flask import Flask
from flask.blueprints import Blueprint
from flask_cors import CORS
from src import routes
import config
import threading
import logging
import time

tok_app  = Flask(__name__)

# with tok_app.app_context():
#     try:
#         kf_service = KafkaService()
#         t1 = threading.Thread(target=kf_service.process_tokenization_kf(), name='keep_on_running')
#         t1.start()
#     except Exception as e:
#         logging.info('ERROR WHILE RUNNING CUSTOM THREADS '+str(e))
# try:
#     t1 = threading.Thread(target=process_tokenization_kf(), name='keep_on_running')
#     t1.start()
# except Exception as e:
#     logging.info('ERROR WHILE RUNNING CUSTOM THREADS '+str(e))

if config.ENABLE_CORS:
    cors    = CORS(tok_app, resources={r"/api/*": {"origins": "*"}})

for blueprint in vars(routes).values():
    if isinstance(blueprint, Blueprint):
        tok_app.register_blueprint(blueprint, url_prefix=config.API_URL_PREFIX)


if __name__ == "__main__":
    tok_app.run(host=config.HOST, port=config.PORT, debug=False)