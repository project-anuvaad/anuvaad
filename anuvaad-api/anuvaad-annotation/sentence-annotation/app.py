from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
from flask import Flask
from flask.blueprints import Blueprint
from flask_cors import CORS
from src import routes

import config
import threading
import time

from src.utilities.app_context import LOG_WITHOUT_CONTEXT
import src.kafka_module.kf_service as kf_service

flask_app = Flask(__name__)

def start_kafka():
    try:
        t1 = threading.Thread(target=kf_service.process_kf_request_payload, name='sentence-grader-kafka-worker-thread')
        t1.start()
        log_info("starting kafka consumer thread", LOG_WITHOUT_CONTEXT)

    except Exception as e:
        log_error("threading ERROR WHILE RUNNING CUSTOM THREADS ", LOG_WITHOUT_CONTEXT, e)

if config.ENABLE_CORS:
    cors    = CORS(flask_app, resources={r"/api/*": {"origins": "*"}})

for blueprint in vars(routes).values():
    if isinstance(blueprint, Blueprint):
        flask_app.register_blueprint(blueprint, url_prefix=config.API_URL_PREFIX)

@flask_app.route(config.API_URL_PREFIX)
def info():
    return "Welcome to Annotation APIs"

if __name__ == "__main__":
    start_kafka()
    log_info("starting sentence-grader module", LOG_WITHOUT_CONTEXT)
    flask_app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)
