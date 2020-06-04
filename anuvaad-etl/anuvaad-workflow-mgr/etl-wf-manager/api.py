#!/bin/python
import logging
import os
import threading

from flask import Flask, jsonify, request
import datetime as dt
from logging.config import dictConfig
from demo.demo import Demo
from demo.producer import Producer
from demo.consumer import consume

app = Flask(__name__)
log = logging.getLogger('file')
context_path = os.environ.get('WFM_CONTEXT_PATH', '/etl-wfm')


def start_consumer():
    print("Consumer starting")
    try:
        t1 = threading.Thread(target=consume, name='keep_on_running')
        t1.start()
    except Exception as e:
        print('ERROR WHILE RUNNING CUSTOM THREADS ' + str(e))


# REST endpoint to initiate the workflow.
@app.route(context_path + '/wf-manager/initiate', methods=["POST"])
def initiate_workflow():
    demo = Demo()
    data = request.get_json()
    response = get_response(data)
    demo.update_job_details(response, True)
    produce(response)
    return response


# REST endpoint to fetch workflow jobs.
@app.route(context_path + '/wf-manager/jobs/search/<job_id>', methods=["GET"])
def searchjobs(job_id):
    demo = Demo()
    response = demo.get_jobs(job_id)
    return jsonify(response)


# Health endpoint
@app.route('/health', methods=["GET"])
def health():
    response = {"code": "200", "status": "ACTIVE"}
    return jsonify(response)


def produce(object_in):
    producer = Producer()
    topic = "anu-etl-wf-initiate"
    print("Pushing to the queue....")
    producer.push_to_queue(object_in, topic)

def get_response(object_in):
    demo = Demo()
    jobid = demo.generate_job_id(object_in["workflowCode"])
    object_in["jobID"] = jobid
    object_in["status"] = "STARTED"
    object_in["state"] = "INITIATED"
    object_in["stepOrder"] = 0

    return object_in


if __name__ == '__main__':
    start_consumer()
    app.run(host='127.0.0.1', port=5000)




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
