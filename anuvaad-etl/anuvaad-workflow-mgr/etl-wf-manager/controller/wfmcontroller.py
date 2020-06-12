#!/bin/python
import logging
import os
import threading
import time
import traceback

import flask
from flask import Flask, jsonify, request
from kafkawrapper.wfmconsumer import consume
import datetime as dt
from logging.config import dictConfig
from service.wfmservice import WFMService
from validator.wfmvalidator import WFMValidator
from utilities.wfmutils import WFMUtils

wfmapp = Flask(__name__)
log = logging.getLogger('file')
context_path = os.environ.get('ANU_ETL_WFM_CONTEXT_PATH', '/anuvaad-etl/wf-manager')


# Starts the kafka consumer in a different thread
def start_consumer():
    wfmutils = WFMUtils()
    configs = wfmutils.get_configs()
    if len(configs.keys()) > 0:
        return
    try:
        t1 = threading.Thread(target=consume, name='WFMKafkaConsumer-Thread')
        t1.start()
    except Exception as e:
        log.error("Exception while starting the kafka consumer: " + str(e))
        traceback.print_exc()
    finally:
        time.sleep(2)


# REST endpoint to initiate the workflow.
@wfmapp.route('/v1/workflow/initiate', methods=["POST"])
def initiate_workflow():
    start_consumer()
    service = WFMService()
    validator = WFMValidator()
    data = request.get_json()
    error = validator.validate_input(data)
    if error is not None:
        return error, 400
    response = service.register_job(data)
    return response


# REST endpoint to fetch workflow jobs.
@wfmapp.route('/v1/workflow/jobs/search/<job_id>', methods=["GET"])
def searchjobs(job_id):
    start_consumer()
    service = WFMService()
    response = service.get_job_details(job_id)
    return jsonify(response)


# Health endpoint
@wfmapp.route('/health', methods=["GET"])
def health():
    response = {"code": "200", "status": "ACTIVE"}
    return jsonify(response)


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