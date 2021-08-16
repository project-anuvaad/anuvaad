#!/bin/python
import time

from flask import Flask, jsonify, request
from service.translatorservice import TranslatorService
from service.blocktranslationservice import BlockTranslationService
from service.texttranslationservice import TextTranslationService
from validator.translatorvalidator import TranslatorValidator
from tmx.tmxservice import TMXService
from configs.translatorconfig import context_path
from configs.translatorconfig import tool_translator
from anuvaad_auditor.loghandler import log_exception, log_error

translatorapp = Flask(__name__)


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
    return jsonify(response), 200


# REST endpoint to initiate the workflow.
@translatorapp.route(context_path + '/v1/block/workflow/translate', methods=["POST"])
def block_translate():
    service = BlockTranslationService()
    validator = TranslatorValidator()
    data = request.get_json()
    error = validator.validate_block_translate(data)
    if error is not None:
        log_error("Error in Block Translate: " + str(error), data, None)
        log_error("Input: " + str(data), data, None)
        data["state"], data["status"], data["error"] = "TRANSLATED", "FAILED", error
        return data, 400
    response = service.block_translate(data)
    return jsonify(response), 200


# REST endpoint to initiate the workflow.
@translatorapp.route(context_path + '/v1/text/translate', methods=["POST"])
def interactive_translate():
    service = TextTranslationService()
    validator = TranslatorValidator()
    try:
        data = request.get_json()
        error = validator.validate_text_translate(data)
        if error is not None:
            data["status"], data["error"] = "FAILED", error
            return jsonify(data), 400
        data = add_headers(data, request)
        response = service.interactive_translate(data)
        return jsonify(response), 200
    except Exception as e:
        log_exception("Something went wrong: " + str(e), None, e)
        return {"status": "FAILED", "message": "Something went wrong"}, 400

# REST endpoint to initiate the workflow.
@translatorapp.route(context_path + '/v1/sentences/workflow/translate', methods=["POST"])
def sentence_translate():
    service = TextTranslationService()
    validator = TranslatorValidator()
    try:
        data = request.get_json()
        error = validator.validate_sentences_translate(data)
        if error is not None:
            data["status"], data["error"] = "FAILED", error
            return jsonify(data), 400
        response = service.translate_sentences(data)
        if response["status"] == "FAILED":
            return jsonify(response), 400
        else:
            return jsonify(response), 200
    except Exception as e:
        log_exception("Something went wrong: " + str(e), None, e)
        return {"status": "FAILED", "message": "Something went wrong"}, 400


@translatorapp.route(context_path + '/v1/tmx/bulk/create/xls-upload', methods=["POST"])
def tmx_create_bulk():
    service = TMXService()
    data = request.get_json()
    response = service.push_csv_to_tmx_store(data)
    if response["status"] == "FAILED":
        return jsonify(response), 400
    else:
        return jsonify(response), 200


@translatorapp.route(context_path + '/v1/tmx/create', methods=["POST"])
def tmx_create():
    service = TMXService()
    data = request.get_json()
    response = service.push_to_tmx_store(data)
    if response["status"] == "FAILED":
        return jsonify(response), 400
    else:
        return jsonify(response), 200

@translatorapp.route(context_path + '/v1/tmx/delete', methods=["POST"])
def tmx_delete():
    service = TMXService()
    data = request.get_json()
    try:
        data = add_headers(data, request)
        response = service.delete_from_tmx_store(data)
        if response["status"] == "FAILED":
            return jsonify(response), 400
        else:
            return jsonify(response), 200
    except Exception as e:
        response = {"message": "Something went wrong.", "status": "FAILED"}
        return jsonify(response), 400

@translatorapp.route(context_path + '/v1/tmx/get-all-keys', methods=["POST"])
def tmx_get_all_keys():
    service = TMXService()
    data = request.get_json()
    try:
        data = add_headers(data, request)
        return jsonify(service.get_tmx_data(data)), 200
    except Exception as e:
        response = {"message": "Something went wrong.", "status": "FAILED"}
        return jsonify(response), 400

@translatorapp.route(context_path + '/v1/glossary/create', methods=["POST"])
def glossary_create():
    service = TMXService()
    data = request.get_json()
    data["userID"] = request.headers["x-user-id"]
    response = service.glossary_create(data)
    if "errorID" in response.keys():
        return jsonify(response), 400
    else:
        return jsonify(response), 200

@translatorapp.route(context_path + '/v1/glossary/delete', methods=["POST"])
def glossary_delete():
    service = TMXService()
    data = request.get_json()
    response = service.glossary_delete(data)
    if "errorID" in response.keys():
        return jsonify(response), 400
    else:
        return jsonify(response), 200

@translatorapp.route(context_path + '/v1/glossary/get', methods=["POST"])
def glossary_get():
    service = TMXService()
    data = request.get_json()
    response = service.glossary_get(data)
    return jsonify(response), 200



# Fetches required headers from the request and adds it to the body.
def add_headers(data, api_request):
    headers = {
        "userID": api_request.headers["x-user-id"],
        "orgID": api_request.headers["x-org-id"],
        "roles": api_request.headers["x-roles"],
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