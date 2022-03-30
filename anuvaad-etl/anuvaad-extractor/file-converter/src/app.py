from logging.config import dictConfig

from flask import Flask
from flask.blueprints import Blueprint
from flask_cors import CORS
from kafka_module.kf_service import process_fc_kf
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
import routes
import config
import time
import threading
from db.conmgr_mongo import connectmongo

tok_app  = Flask(__name__)

def start_kafka():
    try:
        t1 = threading.Thread(target=process_fc_kf, name='keep_on_running')
        t1.start()
        log_info("multithread : Kafka running on multithread", None)
    except Exception as e:
        log_error("multithread : Error while running custom threads", None, e)

if config.ENABLE_CORS:
    cors    = CORS(tok_app, resources={r"/api/*": {"origins": "*"}})

for blueprint in vars(routes).values():
    if isinstance(blueprint, Blueprint):
        tok_app.register_blueprint(blueprint, url_prefix=config.API_URL_PREFIX)


if __name__ == "__main__":
    start_kafka()
    connectmongo()
    tok_app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)

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
