#!/bin/python
import logging
from multiprocessing import Process

from logging.config import dictConfig
from controller.wfmcontroller import wfmapp
from kafkawrapper.wfmconsumer import consume
from kafkawrapper.wfmcoreconsumer import core_consume
from kafkawrapper.wfmerrorconsumer import error_consume
from anuvaad_auditor.loghandler import log_exception
from configs.wfmconfig import app_host
from configs.wfmconfig import app_port



log = logging.getLogger('file')


# Starts the kafka consumer in a different thread
def start_consumer():
    with wfmapp.test_request_context():
        try:
            wfm_consumer_process = Process(target=consume)
            wfm_consumer_process.start()
            wfm_core_consumer_process = Process(target=core_consume)
            wfm_core_consumer_process.start()
            wfm_error_consumer_process = Process(target=error_consume)
            wfm_error_consumer_process.start()
        except Exception as e:
            log_exception("Exception while starting the WFM kafka consumers: " + str(e), None, e)


if __name__ == '__main__':
    start_consumer()
    wfmapp.run(host=app_host, port=eval(str(app_port)), threaded=True)


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
