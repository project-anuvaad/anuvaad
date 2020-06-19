from flask import Flask
from flask.blueprints import Blueprint
from flask_cors import CORS
import routes
import config
import threading
import logging
from logging.config import dictConfig
from services.kf_services import process_pdf_kf
import time

pdf2html_app  = Flask(__name__)

log = logging.getLogger('file')

try:
    t1 = threading.Thread(target=process_pdf_kf, name='keep_on_running')
    t1.start()
    log.info("multithread started")
except Exception as e:
    log.error('ERROR WHILE RUNNING CUSTOM THREADS '+str(e))

if config.ENABLE_CORS:
    cors    = CORS(pdf2html_app, resources={r"/api/*": {"origins": "*"}})

for blueprint in vars(routes).values():
    if isinstance(blueprint, Blueprint):
        pdf2html_app.register_blueprint(blueprint, url_prefix=config.API_URL_PREFIX)

if __name__ == "__main__":
    pdf2html_app.run(host=config.HOST, port=config.PORT, debug=False)

# Log config
dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] {%(filename)s:%(lineno)d} %(threadName)s %(levelname)s in %(module)s: %(message)s',
    }},
    'handlers': {
        'info': {
            'class': 'logging.FileHandler',
            'level': 'DEBUG',
            'formatter': 'default',
            'filename': 'info.log'
        },
        'console': {
            'class': 'logging.StreamHandler',
            'level': 'DEBUG',
            'formatter': 'default',
            'stream': 'ext://sys.stdout',
        }
    },
    'loggers': {
        'file': {
            'level': 'DEBUG',
            'handlers': ['info', 'console'],
            'propagate': ''
        }
    },
    'root': {
        'level': 'DEBUG',
        'handlers': ['info', 'console']
    }
})