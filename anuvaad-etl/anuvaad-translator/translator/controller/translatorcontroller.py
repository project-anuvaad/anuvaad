#!/bin/python
import logging
import time

from flask import Flask, jsonify, request
from service.translatorservice import TranslatorService
from service.blocktranslationservice import BlockTranslationService
from service.texttranslationservice import TextTranslationService
from validator.translatorvalidator import TranslatorValidator
from configs.translatorconfig import context_path
from configs.translatorconfig import tool_translator

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
    if error is not None:
        data["state"], data["status"], data["error"] = "TRANSLATED", "FAILED", error
        return data, 400
    response = service.block_translate(data)
    return response


# REST endpoint to initiate the workflow.
@translatorapp.route(context_path + '/v1/text/translate', methods=["POST"])
def text_translate():
    service = TextTranslationService()
    validator = TranslatorValidator()
    data = request.get_json()
    error = validator.validate_text_translate(data)
    if error is not None:
        data["status"], data["error"] = "FAILED", error
        return data, 400
    data["metadata"] = {"userID": request.headers["ad-userid"]}
    response = service.text_translate(data)
    return response


# Fetches required headers from the request and adds it to the body.
def add_headers(data, api_request):
    headers = {
        "userID": api_request.headers["x-user-id"],
        "requestID": api_request.headers["x-request-id"],
        "sessionID": api_request.headers["x-session-id"],
        "receivedAt": eval(str(time.time()).replace('.', '')),
        "module": tool_translator
    }
    data["metadata"] = headers
    return data


# Health endpoint
@translatorapp.route('/health', methods=["GET"])
def health():
    response = {"code": "200", "status": "ACTIVE"}
    return jsonify(response)