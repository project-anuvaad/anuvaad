#!/bin/python
import os

from flask import Flask, jsonify, request
import datetime as dt
from service.alignmentservice import AlignmentService
from service.alignwflowservice import AlignWflowService
from validator.alignmentvalidator import AlignmentValidator

from logging.config import dictConfig

alignapp = Flask(__name__)
context_path = os.environ.get('SA_CONTEXT_PATH', '/anuvaad-etl/extractor/aligner')

# REST endpoint to align files
@alignapp.route(context_path + '/sentences/align', methods=["POST"])
def createalignmentjob():
    service = AlignmentService()
    validator = AlignmentValidator()
    data = request.get_json()
    error = validator.validate_input(data)
    if error is not None:
        return error
    return service.register_job(data)


# REST endpoint to align files through wflow
@alignapp.route(context_path + '/sentences/wflow/align', methods=["POST"])
def createalignmentjob():
    service = AlignWflowService()
    data = request.get_json()
    return service.wf_process(data)


# REST endpoint to fetch job status
@alignapp.route(context_path + '/alignment/jobs/get/<job_id>', methods=["GET"])
def searchjobs(job_id):
    service = AlignmentService()
    response = service.search_jobs(job_id)
    return jsonify(response)

# Health endpoint
@alignapp.route('/health', methods=["GET"])
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
