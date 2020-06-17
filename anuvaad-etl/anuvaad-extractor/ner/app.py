from src.services.kf_service import process_annotation_kf
from src.utilities.model_response import checking_file_response
from flask import Flask
from flask.blueprints import Blueprint
from flask_cors import CORS
from src import routes
import config
import threading
import logging
import time
from logging.config import dictConfig

ner_app  = Flask(__name__)
log = logging.getLogger('file')
try:
    t1 = threading.Thread(target=process_annotation_kf, name='keep_on_running')
    t1.start()
    log.info("kafka thread started ")
except Exception as e:
    log.error('ERROR WHILE RUNNING CUSTOM THREADS '+str(e))

if config.ENABLE_CORS:
    cors    = CORS(ner_app, resources={r"/api/*": {"origins": "*"}})

for blueprint in vars(routes).values():
    if isinstance(blueprint, Blueprint):
        ner_app.register_blueprint(blueprint, url_prefix=config.API_URL_PREFIX)


if __name__ == "__main__":
    ner_app.run(host=config.HOST, port=config.PORT, debug=False)

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