#!/bin/python
import logging
import os
import threading
import time
import traceback

from flask import Flask
from logging.config import dictConfig
from controller.alignmentcontroller import alignapp
from kafkawrapper.alignmentconsumer import consume


log = logging.getLogger('file')
app_host = os.environ.get('ANU_ETL_WFM_HOST', '0.0.0.0')
app_port = os.environ.get('ANU_ETL_WFM_PORT', 5002)


# Starts the kafka consumer in a different thread
def start_consumer():
    try:
        t1 = threading.Thread(target=consume, name='WFMKafkaConsumer-Thread')
        t1.start()
    except Exception as e:
        log.error("Exception while starting the kafka consumer: " + str(e))
        traceback.print_exc()


if __name__ == '__main__':
    start_consumer()
    alignapp.run(host=app_host, port=app_port)


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
