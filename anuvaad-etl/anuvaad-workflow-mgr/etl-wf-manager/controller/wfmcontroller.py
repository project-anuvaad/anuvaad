#!/bin/python
import logging
import time

from flask import Flask, jsonify, request
from logging.config import dictConfig
from service.wfmservice import WFMService
from validator.wfmvalidator import WFMValidator
from configs.wfmconfig import context_path
from configs.wfmconfig import module_wfm_name

wfmapp = Flask(__name__)
log = logging.getLogger('file')


# REST endpoint to initiate the workflow.
@wfmapp.route(context_path + '/v1/workflow/initiate', methods=["POST"])
def initiate_workflow():
    service = WFMService()
    validator = WFMValidator()
    data = request.get_json()
    error = validator.validate(data)
    if error is not None:
        return error, 400
    data = add_headers(data, request)
    response = service.register_job(data)
    return response


# REST endpoint to initiate the ASYNC workflow.
@wfmapp.route(context_path + '/v1/workflow/async/initiate', methods=["POST"])
def initiate_async_workflow():
    service = WFMService()
    validator = WFMValidator()
    data = request.get_json()
    error = validator.common_validate(data)
    if error is not None:
        return error, 400
    error = validator.validate_async(data, data["workflowCode"])
    if error is not None:
        return error, 400
    data = add_headers(data, request)
    response = service.register_async_job(data)
    return response


# REST endpoint to initiate the SYNC workflow.
@wfmapp.route(context_path + '/v1/workflow/sync/initiate', methods=["POST"])
def initiate_sync_workflow():
    service = WFMService()
    validator = WFMValidator()
    data = request.get_json()
    error = validator.common_validate(data)
    if error is not None:
        return error, 400
    error = validator.validate_sync(data, data["workflowCode"])
    if error is not None:
        return error, 400
    data = add_headers(data, request)
    response = service.register_sync_job(data)
    return response


# REST endpoint to interrupt the workflow.
@wfmapp.route(context_path + '/v1/workflow/interrupt', methods=["POST"])
def interrupt_workflow():
    service = WFMService()
    data = add_headers(request.get_json(), request)
    response = service.interrupt_job(data)
    if not response:
        return {"response": response}, 400
    return {"response": response}


# REST endpoint to fetch workflow jobs.
@wfmapp.route(context_path + '/v1/workflow/jobs/search/bulk', methods=["POST"])
def search_all_jobs():
    service = WFMService()
    req_criteria = request.get_json()
    req_criteria["userIDs"] = [request.headers["ad-userid"]]
    response = service.get_job_details_bulk(req_criteria, False)
    return jsonify(response), 200


# REST endpoint to fetch workflow jobs.
@wfmapp.route(context_path + '/v1/workflow/jobs/mark-inactive', methods=["POST"])
def mark_inactive():
    service = WFMService()
    req_criteria = request.get_json()
    req_criteria["userIDs"] = [request.headers["ad-userid"]]
    response = service.mark_inactive(req_criteria)
    if response:
        return jsonify(response), 200
    else:
        return jsonify({"status": "FAILED", "message": "Something went wrong"}), 400


# REST endpoint to fetch configs
@wfmapp.route(context_path + '/v1/workflow/configs/search', methods=["GET"])
def search_wf_configs():
    service = WFMService()
    response = service.get_wf_configs()
    return jsonify(response)


# Health endpoint
@wfmapp.route('/health', methods=["GET"])
def health():
    response = {"code": "200", "status": "ACTIVE"}
    return jsonify(response)


# Fetches required headers from the request and adds it to the body.
def add_headers(data, api_request):
    headers = {
        "userID": api_request.headers["ad-userid"],
        "sessionID": api_request.headers["ad-requestID"],
        "receivedAt": eval(str(time.time()).replace('.', '')[0:13]),
        "module": module_wfm_name
    }
    data["metadata"] = headers
    return data


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
