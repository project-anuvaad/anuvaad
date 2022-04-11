import threading

from anuvaad_auditor.loghandler import log_error
from anuvaad_auditor.loghandler import log_info
from flask import Flask
from flask.blueprints import Blueprint
from flask_cors import CORS

import config
import routes
from kafka_module.kf_service import process_transform_file_kf, process_download_file_kf

tok_app = Flask(__name__)


def start_kafka_for_transform():
    try:
        t1 = threading.Thread(target=process_transform_file_kf, name='keep_on_running')
        t1.start()
        log_info("multi thread: start_kafka_for_transform :: Kafka running on multithread", None)
    except Exception as e:
        log_error("multi thread : Error while running custom threads" + str(e), None, e)

def start_kafka_for_download():
    try:
        t1 = threading.Thread(target=process_download_file_kf, name='keep_on_running')
        t1.start()
        log_info("multi thread: start_kafka_for_download :: Kafka running on multithread", None)
    except Exception as e:
        log_error("multi thread : Error while running custom threads" + str(e), None, e)



if config.ENABLE_CORS:
    cors = CORS(tok_app, resources={r"/api/*": {"origins": "*"}})

for blueprint in vars(routes).values():
    if isinstance(blueprint, Blueprint):
        tok_app.register_blueprint(blueprint, url_prefix=config.context_path)

if __name__ == "__main__":
    start_kafka_for_transform()
    start_kafka_for_download()
    tok_app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)
