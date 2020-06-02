#!/bin/python
import logging
import os

from flask import Flask, jsonify, request
import datetime as dt
from logging.config import dictConfig
from demo import Demo
from producer import Producer

app = Flask(__name__)
context_path = os.environ.get('WFM_CONTEXT_PATH', '/etl-wfm')


# REST endpoint to initiate the workflow.
@app.route(context_path + '/wf-manager/initiate', methods=["POST"])
def initiate_workflow():
    data = request.get_json()
    response = get_response(data)
    produce(response)
    return response


# REST endpoint to fetch workflow jobs.
@app.route(context_path + '/wf-manager/jobs/search', methods=["GET"])
def searchjobs(job_id):
    response = {"status": "START"}
    return jsonify(response)


# Health endpoint
@app.route('/health', methods=["GET"])
def health():
    response = {"code": "200", "status": "ACTIVE"}
    return jsonify(response)


def produce(object_in):
    producer = Producer()
    topic = "anu-etl-wf-initiate"
    producer.push_to_queue(object_in, topic)


def get_response(object_in):
    demo = Demo()
    jobid = demo.generate_job_id(object_in["workflowCode"])
    object_in["jobID"] = jobid
    object_in["status"] = "STARTED"
    object_in["state"] = "INITIATED"
    object_in["currentStep"] = 0

    return object_in




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
