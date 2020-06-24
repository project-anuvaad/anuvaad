#!/bin/python
import logging
import os
import threading
import time
import traceback

from flask import copy_current_request_context
from logging.config import dictConfig
from controller.alignmentcontroller import alignapp
from kafkawrapper.alignmentconsumer import Consumer


log = logging.getLogger('file')
app_host = os.environ.get('ANU_ETL_WFM_HOST', '0.0.0.0')
app_port = os.environ.get('ANU_ETL_WFM_PORT', 5003)


#@copy_current_request_context
def context_consume():
    consumer = Consumer()
    consumer.consume()


# Starts the kafka consumer in a different thread
def start_consumer():
    with alignapp.app_context():
        consumer = Consumer()
        try:
            t1 = threading.Thread(target=consumer.consume, name='AlignerKafka-Thread')
            t1.start()
        except Exception as e:
            log.exception("Exception while starting the kafka consumer: " + str(e))



if __name__ == '__main__':
    alignapp.run(host=app_host, port=app_port)
    start_consumer()


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
