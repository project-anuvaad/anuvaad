from src.services.kf_service import process_merger_kf
from flask import Flask
from flask.blueprints import Blueprint
from flask_cors import CORS
from src import routes
import config
import threading
import logging
import time

log = logging.getLogger('file')
merge_app = Flask(__name__)

def start_kafka():
    try:
        t1 = threading.Thread(target=process_merger_kf, name='keep_on_running')
        t1.start()
        log.info("kafka running")
    except Exception as e:
        log.error('ERROR WHILE RUNNING CUSTOM THREADS '+str(e))

if config.ENABLE_CORS:
    cors    = CORS(merge_app, resources={r"/api/*": {"origins": "*"}})

for blueprint in vars(routes).values():
    if isinstance(blueprint, Blueprint):
        merge_app.register_blueprint(blueprint, url_prefix=config.API_URL_PREFIX)


if __name__ == "__main__":
    start_kafka()
    merge_app.run(host=config.HOST, port=config.PORT, debug=False)
    
