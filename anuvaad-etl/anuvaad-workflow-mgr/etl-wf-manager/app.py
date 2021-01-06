#!/bin/python
import logging
import os
import threading

from logging.config import dictConfig
from controller.wfmcontroller import wfmapp
from kafkawrapper.wfmconsumer import consume
from kafkawrapper.wfmcoreconsumer import core_consume
from kafkawrapper.wfmerrorconsumer import error_consume
from anuvaad_auditor.loghandler import log_exception
from configs.wfmconfig import wfm_cons_no_of_instances
from configs.wfmconfig import wfm_core_cons_no_of_instances
from configs.wfmconfig import wfm_error_cons_no_of_instances
from configs.wfmconfig import app_host
from configs.wfmconfig import app_port



log = logging.getLogger('file')


# Starts the kafka consumer in a different thread
def start_consumer():
    with wfmapp.test_request_context():
        try:
            for instance in range(0, wfm_cons_no_of_instances):
                thread = "WFMConsumer-Instance-" + str(instance)
                wfm_consumer_thread = threading.Thread(target=consume, name=thread)
                wfm_consumer_thread.start()
            for instance in range(0, wfm_core_cons_no_of_instances):
                thread = "WFMCoreConsumer-Instance-" + str(instance)
                wfm_core_consumer_thread = threading.Thread(target=core_consume, name=thread)
                wfm_core_consumer_thread.start()
            for instance in range(0, wfm_error_cons_no_of_instances):
                thread = "WFMErrorConsumer-Instance-" + str(instance)
                wfm_error_consumer_thread = threading.Thread(target=error_consume, name=thread)
                wfm_error_consumer_thread.start()
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
