#!/bin/python
import logging
import os

from flask import Flask, jsonify, request
import datetime as dt
from logging.config import dictConfig

app = Flask(__name__)
context_path = os.environ.get('WFM_CONTEXT_PATH', '/etl-wfm')


# REST endpoint to initiate the workflow.
@app.route(context_path + '/wf-manager/initiate', methods=["POST"])
def initiate_workflow():
    response = {"status": "START"}
    return response


# REST endpoint to update the workflow.
@app.route(context_path + '/wf-manager/update', methods=["GET"])
def searchjobs(job_id):
    response = {"status": "START"}
    return jsonify(response)


# REST endpoint to fetch workflow jobs.
@app.route(context_path + '/wf-manager/update', methods=["GET"])
def searchjobs(job_id):
    response = {"status": "START"}
    return jsonify(response)


# Health endpoint
@app.route('/health', methods=["GET"])
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
