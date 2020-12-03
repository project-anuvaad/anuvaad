#!/bin/python
import logging
import os
import threading

from controller.translatorcontroller import translatorapp
from kafkawrapper.translatorconsumer import consume
from kafkawrapper.transnmtconsumer import consume_nmt
from anuvaad_auditor.loghandler import log_exception
from configs.translatorconfig import translator_cons_no_of_instances
from configs.translatorconfig import translator_nmt_cons_no_of_instances



log = logging.getLogger('file')
app_host = os.environ.get('ANU_ETL_TRANSLATOR_HOST', 'localhost')
app_port = os.environ.get('ANU_ETL_TRANSLATOR_PORT', 5001)


# Starts the kafka consumer in a different thread
def start_consumer():
    with translatorapp.test_request_context():
        try:
            for instance in range(0, translator_cons_no_of_instances):
                thread = "TranslatorConsumer-Instance-" + str(instance)
                wfm_consumer_thread = threading.Thread(target=consume, name=thread)
                wfm_consumer_thread.start()
            for instance in range(0, translator_nmt_cons_no_of_instances):
                thread = "TranslatorNMTConsumer-Instance-" + str(instance)
                wfm_consumer_thread = threading.Thread(target=consume_nmt, name=thread)
                wfm_consumer_thread.start()
        except Exception as e:
            log_exception("Exception while starting the Translator kafka consumers: " + str(e), None, e)


if __name__ == '__main__':
    start_consumer()
    translatorapp.run(host=app_host, port=app_port)
