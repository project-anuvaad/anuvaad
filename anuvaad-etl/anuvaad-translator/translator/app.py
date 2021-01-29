#!/bin/python
import logging
import os

from multiprocessing import Process
from controller.translatorcontroller import translatorapp
from kafkawrapper.translatorconsumer import consume
from kafkawrapper.transnmtconsumer import consume_nmt
from anuvaad_auditor.loghandler import log_exception

log = logging.getLogger('file')
app_host = os.environ.get('ANU_ETL_TRANSLATOR_HOST', '0.0.0.0')
app_port = os.environ.get('ANU_ETL_TRANSLATOR_PORT', 5001)


# Starts the kafka consumer in a different thread
def start_consumer():
    with translatorapp.test_request_context():
        try:
            trans_consumer_process = Process(target=consume)
            trans_consumer_process.start()
            trans_nmt_consumer_process = Process(target=consume_nmt)
            trans_nmt_consumer_process.start()
        except Exception as e:
            log_exception("Exception while starting the Translator kafka consumers: " + str(e), None, e)


if __name__ == '__main__':
    start_consumer()
    translatorapp.run(host=app_host, port=app_port, threaded=True)
