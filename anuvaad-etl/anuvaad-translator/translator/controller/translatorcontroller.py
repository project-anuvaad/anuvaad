#!/bin/python
import logging
import time

from flask import Flask, jsonify, request
from service.translatorservice import TranslatorService
from validator.translatorvalidator import TranslatorValidator
from configs.translatorconfig import context_path
from configs.translatorconfig import anu_etl_module_name

translatorapp = Flask(__name__)
log = logging.getLogger('file')


# REST endpoint to initiate the workflow.
@translatorapp.route(context_path + '/v1/doc/workflow/translate', methods=["POST"])
def doc_translate_workflow():
    service = TranslatorService()
    validator = TranslatorValidator()
    data = request.get_json()
    error = validator.validate_wf(data, False)
    if error is not None:
        return error, 400
    response = service.start_file_translation(data)
    return response


# REST endpoint to initiate the workflow.
@translatorapp.route(context_path + '/v1/text/translate', methods=["POST"])
def text_translate():
    service = TranslatorService()
    data = request.get_json()
    response = service.register_job(data)
    return response


# Fetches required headers from the request and adds it to the body.
def add_headers(data, api_request):
    bearer = api_request.headers["authorization"]
    bearer = bearer.split(" ")[1]
    headers = {
        "userID": api_request.headers["ad-userid"],
        "sessionID": api_request.headers["ad-requestID"],
        "bearer": bearer,
        "receivedAt": eval(str(time.time()).replace('.', '')),
        "module": anu_etl_module_name
    }
    data["metadata"] = headers
    return data


# Health endpoint
@translatorapp.route('/health', methods=["GET"])
def health():
    response = {"code": "200", "status": "ACTIVE"}
    return jsonify(response)