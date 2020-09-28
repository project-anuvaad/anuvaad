#!/bin/python
import logging
import time

from flask import Flask, jsonify, request
from service.translatorservice import TranslatorService
from service.blocktranslationservice import BlockTranslationService
from validator.translatorvalidator import TranslatorValidator
from configs.translatorconfig import context_path
from configs.translatorconfig import anu_etl_module_name
from anuvaad_auditor.loghandler import log_info

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
@translatorapp.route(context_path + '/v1/block/workflow/translate', methods=["POST"])
def block_translate():
    service = BlockTranslationService()
    validator = TranslatorValidator()
    data = request.get_json()
    error = validator.validate_block_translate(data)
    log_info(error, data)
    if error is not None:
        data["state"], data["status"], data["error"] = "TRANSLATED", "FAILED", error
        return data, 400
    response = service.block_translate(data)
    return response


# REST endpoint to initiate the workflow.
@translatorapp.route(context_path + '/v1/text/workflow/translate', methods=["POST"])
def text_translate():
    service = BlockTranslationService()
    validator = TranslatorValidator()
    data = request.get_json()
    error = validator.validate_text_translate(data)
    log_info(error, data)
    if error is not None:
        data["state"], data["status"], data["error"] = "TRANSLATED", "FAILED", error
        return data, 400
    response = service.text_translate(data)
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