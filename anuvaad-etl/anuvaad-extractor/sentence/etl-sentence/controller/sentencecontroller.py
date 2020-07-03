#!/bin/python
import os

from flask import Flask, jsonify, request
import datetime as dt
from service.sentenceservice import SentenceService
from service.sentencewflowservice import SentenceWflowService
from validator.sentencevalidator import SentenceValidator

from logging.config import dictConfig

sentenceapp = Flask(__name__)
context_path = os.environ.get('SA_CONTEXT_PATH', '/anuvaad-etl/extractor/sentence')

# REST endpoint to align files
@sentenceapp.route(context_path + '/v1/sentences/extract', methods=["POST"])
def createalignmentjob():
    service = SentenceService()
    validator = SentenceValidator()
    data = request.get_json()
    error = validator.validate_input(data)
    if error is not None:
        return error
    return service.register_job(data)


# REST endpoint to align files through wflow
@sentenceapp.route(context_path + '/v1/sentences/wflow/align', methods=["POST"])
def createalignmentwflowjob():
    service = SentenceService()
    data = request.get_json()
    return service.wf_process(data)


# REST endpoint to fetch job status
@sentenceapp.route(context_path + '/v1/alignment/jobs/get/<job_id>', methods=["GET"])
def searchjobs(job_id):
    service = SentenceService()
    response = service.search_jobs(job_id)
    return jsonify(response)

# Health endpoint
@sentenceapp.route('/health', methods=["GET"])
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
    sentenceapp.run(host='0.0.0.0', port=5002)
