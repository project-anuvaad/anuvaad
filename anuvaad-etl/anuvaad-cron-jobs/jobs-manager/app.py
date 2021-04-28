#!/bin/python
import logging
import os
import threading

from flask import Flask

from wfm_jobsmanager.wfmjm import WFMJobsManager
from translator_jobsmanager.translatorjm import TranslatorJobsManger
from translator_jobsmanager.translatorjc import TranslatorJobsCleaner
from anuvaad_auditor.loghandler import log_exception


anuvaadcronjobs = Flask(__name__)

log = logging.getLogger('file')
app_host = os.environ.get('ANUVAAD_CRON_JOBS_HOST', '0.0.0.0')
app_port = os.environ.get('ANUVAAD_CRON_JOBS_PORT', 5001)


# Starts the kafka consumer in a different thread
def start_consumer():
    with anuvaadcronjobs.test_request_context():
        try:
            wfm_jm_thread = WFMJobsManager(threading.Event())
            wfm_jm_thread.start()
            tr_jm_thread = TranslatorJobsManger(threading.Event())
            tr_jm_thread.start()
            tr_jc_thread = TranslatorJobsCleaner(threading.Event())
            tr_jc_thread.start()
        except Exception as e:
            log_exception("Exception while starting the Translator kafka consumers: " + str(e), None, e)


if __name__ == '__main__':
    start_consumer()
    anuvaadcronjobs.run(host=app_host, port=app_port)
