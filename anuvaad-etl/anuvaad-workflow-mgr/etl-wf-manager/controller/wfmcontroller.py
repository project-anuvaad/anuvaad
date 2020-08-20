#!/bin/python
import logging
import os
import threading
import time
import traceback

import flask
from flask import Flask, jsonify, request
import datetime as dt
from logging.config import dictConfig
from service.wfmservice import WFMService
from validator.wfmvalidator import WFMValidator
from configs.wfmconfig import context_path

wfmapp = Flask(__name__)
log = logging.getLogger('file')



# REST endpoint to initiate the workflow.
@wfmapp.route(context_path + '/v1/workflow/initiate', methods=["POST"])
def initiate_workflow():
    service = WFMService()
    validator = WFMValidator()
    data = request.get_json()
    error = validator.validate_input(data)
    if error is not None:
        return error, 400
    data = add_headers(data, request)
    response = service.register_job(data)
    return response


# REST endpoint to fetch workflow jobs.
@wfmapp.route(context_path + '/v1/workflow/jobs/search/<job_id>', methods=["GET"])
def search_jobs(job_id):
    service = WFMService()
    response = service.get_job_details(job_id)
    return jsonify(response)

# REST endpoint to fetch workflow jobs.
@wfmapp.route(context_path + '/v1/workflow/jobs/search/bulk', methods=["GET"])
def search_all_jobs():
    service = WFMService()
    req_criteria = request.get_json()
    response = service.get_job_details_bulk(req_criteria)
    return jsonify(response)


# Health endpoint
@wfmapp.route('/health', methods=["GET"])
def health():
    response = {"code": "200", "status": "ACTIVE"}
    return jsonify(response)


# Fetches required headers from the request and adds it to the body.
def add_headers(data, api_request):
    log.info(api_request.headers)
    headers = {
        "userID": api_request.headers["ad-userid"],
        "sessionID": api_request.headers["ad-requestID"],
        "receivedAt": eval(str(time.time()).replace('.', ''))
    }
    data["metadata"] = headers
    return data


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