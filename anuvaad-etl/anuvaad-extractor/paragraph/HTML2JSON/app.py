from flask import Flask
from flask.blueprints import Blueprint
from flask_cors import CORS
import routes
import config
import threading
import logging
from services.kf_services import process_HTML_kf
import time

html2json_app  = Flask(__name__)

log = logging.getLogger('file')

try:
    t1 = threading.Thread(target=process_HTML_kf, name='keep_on_running')
    t1.start()
    log.info("multithread started")
except Exception as e:
    log.error('ERROR WHILE RUNNING CUSTOM THREADS %s'%e)

if config.ENABLE_CORS:
    cors    = CORS(html2json_app, resources={r"/api/*": {"origins": "*"}})

for blueprint in vars(routes).values():
    if isinstance(blueprint, Blueprint):
        html2json_app.register_blueprint(blueprint, url_prefix=config.API_URL_PREFIX)

if __name__ == "__main__":
    html2json_app.run(host=config.HOST, port=config.PORT, debug=False)
