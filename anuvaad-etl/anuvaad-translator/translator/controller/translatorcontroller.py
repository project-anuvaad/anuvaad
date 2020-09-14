#!/bin/python
import logging

from flask import Flask, jsonify, request
from service.translatorservice import TranslatorService
from configs.translatorconfig import context_path

translatorapp = Flask(__name__)
log = logging.getLogger('file')



# REST endpoint to initiate the workflow.
@translatorapp.route(context_path + '/v1/doc/wf/translate', methods=["POST"])
def doc_translate_workflow():
    service = TranslatorService()
    data = request.get_json()
    '''
    error = validator.validate(data)
    if error is not None:
        return error, 400
    '''
    response = service.start_file_translation(data)
    return response


# REST endpoint to initiate the workflow.
@translatorapp.route(context_path + '/v1/doc/translate', methods=["POST"])
def doc_translate():
    service = TranslatorService()
    data = request.get_json()
    '''
    error = validator.validate(data)
    if error is not None:
        return error, 400
    '''
    response = service.start_file_translation(data)
    return response


# REST endpoint to initiate the workflow.
@translatorapp.route(context_path + '/v1/text/translate', methods=["POST"])
def text_translate():
    service = TranslatorService()
    data = request.get_json()
    response = service.register_job(data)
    return response


# Health endpoint
@translatorapp.route('/health', methods=["GET"])
def health():
    response = {"code": "200", "status": "ACTIVE"}
    return jsonify(response)