#!/bin/python
import logging
import os
import threading

from logging.config import dictConfig
from controller.alignmentcontroller import alignapp
from kafkawrapper.alignmentconsumer import Consumer
from kafkawrapper.alignmentwflowconsumer import WflowConsumer

from kafkawrapper.jsonalignmentconsumer import JsonConsumer
from kafkawrapper.jsonalignmentwflowconsumer import JsonWflowConsumer


log = logging.getLogger('file')
app_host = os.environ.get('ANU_ETL_WFM_HOST', '0.0.0.0')
app_port = os.environ.get('ANU_ETL_WFM_PORT', 5001)


# Starts the kafka consumer in a different thread
def start_consumer():
    with alignapp.app_context():
        consumer = Consumer()
        wflowconsumer = WflowConsumer()

        jsonconsumer  = JsonConsumer()
        jsonwflowconsumer = JsonWflowConsumer()
        
        try:
            align_consumer_thread = threading.Thread(target=consumer.consume, name='AlignerConsumer-Thread')
            align_wflow_consumer_thread = threading.Thread(target=wflowconsumer.consume, name='AlignerWflowConsumer-Thread')
            align_consumer_thread.start()
            align_wflow_consumer_thread.start()

            #json implementation
            json_align_consumer_thread = threading.Thread(target=jsonconsumer.consume, name='Json-AlignerConsumer-Thread')
            json_align_wflow_consumer_thread = threading.Thread(target=jsonwflowconsumer.consume, name='Json-AlignerWflowConsumer-Thread')
            json_align_consumer_thread.start()
            json_align_wflow_consumer_thread.start()

        except Exception as e:
            log.exception("Exception while starting the kafka consumer: " + str(e))


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
