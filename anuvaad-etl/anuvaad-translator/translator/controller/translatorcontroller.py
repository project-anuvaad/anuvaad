#!/bin/python
import logging

from flask import Flask, jsonify, request
from service.translatorservice import TranslatorService
from validator.translatorvalidator import TranslatorValidator
from configs.wfmconfig import context_path

translatorapp = Flask(__name__)
log = logging.getLogger('file')



# REST endpoint to initiate the workflow.
@translatorapp.route(context_path + '/v1/workflow/translate', methods=["POST"])
def initiate_workflow():
    service = TranslatorService()
    validator = TranslatorValidator()
    data = request.get_json()
    error = validator.validate(data)
    if error is not None:
        return error, 400
    response = service.register_job(data)
    return response


# REST endpoint to initiate the workflow.
@translatorapp.route(context_path + '/v1/translate', methods=["POST"])
def initiate_workflow():
    service = TranslatorService()
    validator = TranslatorValidator()
    data = request.get_json()
    error = validator.validate(data)
    if error is not None:
        return error, 400
    response = service.register_job(data)
    return response


# REST endpoint to fetch workflow jobs.
@translatorapp.route(context_path + '/v1/workflow/jobs/search/<job_id>', methods=["GET"])
def search_jobs(job_id):
    service = TranslatorService()
    response = service.get_job_details(job_id)
    return jsonify(response)


# Health endpoint
@translatorapp.route('/health', methods=["GET"])
def health():
    response = {"code": "200", "status": "ACTIVE"}
    return jsonify(response)