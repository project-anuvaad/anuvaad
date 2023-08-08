#!/bin/python
import logging
import time
import requests 

from flask import Flask, jsonify, request
from logging.config import dictConfig
from service.wfmservice import WFMService
from validator.wfmvalidator import WFMValidator
from configs.wfmconfig import context_path, app_context
from configs.wfmconfig import module_wfm_name
from anuvaad_auditor.loghandler import log_exception, log_info

wfmapp = Flask(__name__)
log = logging.getLogger('file')

# REST endpoint to initiate the ASYNC workflow.
@wfmapp.route(context_path + '/v1/workflow/async/initiate', methods=["POST"])
def initiate_async_workflow():
    service = WFMService()
    validator = WFMValidator()
    data = request.get_json()
    try:
        error = validator.common_validate(data)
        if error is not None:
            return error, 400
        error = validator.validate_async(data, data["workflowCode"])
        if error is not None:
            return error, 400
        data = add_headers(data, request)
        response = service.register_async_job(data)
        if 'error' in response.keys():
            return jsonify(response['error']), 400
        return jsonify(response), 202
    except Exception as e:
        log_exception("Something went wrong: " + str(e), None, e)
        return {"status": "FAILED", "message": "Something went wrong"}, 400


# REST endpoint to initiate the SYNC workflow.
@wfmapp.route(context_path + '/v1/workflow/sync/initiate', methods=["POST"])
def initiate_sync_workflow():
    service = WFMService()
    validator = WFMValidator()
    data = request.get_json()
    try:
        error = validator.common_validate(data)
        if error is not None:
            return error, 400
        error = validator.validate_sync(data, data["workflowCode"])
        if error is not None:
            return error, 400
        data = add_headers(data, request)
        response = service.register_sync_job(data)
        if 'error' in response.keys():
            return jsonify(response['error']), 400
        return jsonify(response), 200
    except Exception as e:
        log_exception("Something went wrong: " + str(e), None, e)
        return {"status": "FAILED", "message": "Something went wrong"}, 400


# REST endpoint to interrupt the workflow.
@wfmapp.route(context_path + '/v1/workflow/interrupt', methods=["POST"])
def interrupt_workflow():
    service = WFMService()
    try:
        data = add_headers(request.get_json(), request)
        response = service.interrupt_job(data)
        if not response:
            return {"response": response}, 400
        return {"response": response}, 200
    except Exception as e:
        log_exception("Something went wrong: " + str(e), None, e)
        return {"status": "FAILED", "message": "Something went wrong"}, 400


# REST endpoint to fetch workflow jobs.
@wfmapp.route(context_path + '/v1/workflow/jobs/search/bulk', methods=["POST"])
def search_all_jobs():
    service = WFMService()
    req_criteria = request.get_json()
    try:
        if "userIDs" in req_criteria.keys():
            if not req_criteria["userIDs"]:
                req_criteria["userIDs"] = [request.headers["x-user-id"]]
        else:
            req_criteria["userIDs"] = [request.headers["x-user-id"]]
        if "orgIDs" in req_criteria.keys():
            if not req_criteria["orgIDs"]:
                req_criteria["orgIDs"] = [request.headers["x-org-id"]]
        else:
            req_criteria["orgIDs"] = [request.headers["x-org-id"]]
        if "isReviewer" in req_criteria.keys():
            response = service.get_job_details_bulk(req_criteria, False, req_criteria['isReviewer'])
        else:
            response = service.get_job_details_bulk(req_criteria, False)
        if "isReviewer" in req_criteria.keys():
            try:
                userSet = set()
                userDictionary = {}
                #log_info(f"BULK Response {response}",app_context)
                if 'jobs' in response.keys():
                    for each_response in response["jobs"]:
                        userSet.add(each_response["metadata"]["userID"])
                userIds = list(userSet)    
                ums_url = "http://gateway_anuvaad-user-management:5001/anuvaad/user-mgmt/v1/users/search"
                ums_input = {"userIDs":userIds}
                ums_response = requests.post(ums_url,json=ums_input)
                #log_info(f"UMS_Response :: {ums_response.status_code} :: {ums_response.json()}",app_context)
                if ums_response.status_code >=200 and ums_response.status_code<=204:
                    ums_resp = ums_response.json()
                    if "data" in ums_resp.keys():
                        for each_ums_response in ums_resp["data"]:
                            userDictionary[each_ums_response['userID']] = each_ums_response['name']
                for i in range(0,len(response["jobs"])):
                    response["jobs"][i]["metadata"]["userName"] = userDictionary[response["jobs"][i]["metadata"]["userID"]]
            except Exception as e:
                log_exception("UMS Call Exception: " + str(e), None, e)
        if response:
            return jsonify(response), 200
        else:
            return jsonify({[]}), 400
    except Exception as e:
        log_exception("Something went wrong: " + str(e), None, e)
        return {"status": "FAILED", "message": "Something went wrong"}, 400


# REST endpoint to fetch workflow jobs.
@wfmapp.route(context_path + '/v1/workflow/jobs/mark-inactive', methods=["POST"])
def mark_inactive():
    service = WFMService()
    try:
        req_criteria = request.get_json()
        req_criteria["userIDs"] = [request.headers["x-user-id"]]
        response = service.mark_inactive(req_criteria)
        if response:
            if response["status"] == "FAILED":
                return jsonify(response), 400
            return jsonify(response), 200
        else:
            return jsonify({"status": "FAILED", "message": "Something went wrong"}), 400
    except Exception as e:
        log_exception("Something went wrong: " + str(e), None, e)
        return {"status": "FAILED", "message": "Something went wrong"}, 400

#REST endpoint to set manual editing start and end time
@wfmapp.route(context_path + '/v1/workflow/setGranularity', methods=["POST"])
def set_granularity():
    service = WFMService()
    validator = WFMValidator()
    req_criteria = request.get_json()
    try:
        error = validator.validate_granularity(req_criteria)
        if error is not None:
            return error, 400        
        #data = add_headers(req_criteria, request)
        # if "userIDs" in req_criteria.keys():
        #     if not req_criteria["userIDs"]:
        #         req_criteria["userIDs"] = [request.headers["x-user-id"]]
        # else:
        #     req_criteria["userIDs"] = [request.headers["x-user-id"]]
        # if "orgIds" in req_criteria.keys():
        #     if not req_criteria["orgIds"]:
        #         req_criteria["orgIds"] = [request.headers["x-org-id"]]
        # else:
        #     req_criteria["orgIds"] = [request.headers["x-org-id"]]
        response = service.set_granularity(req_criteria)
        if response:
            return jsonify(response), 200
        else:
            return jsonify({[]}), 400
    except Exception as e:
        log_exception("Something went wrong: " + str(e), None, e)
        return {"status": "FAILED", "message": "Something went wrong"}, 400

# REST endpoint to fetch configs
@wfmapp.route(context_path + '/v1/workflow/configs/search', methods=["GET"])
def search_wf_configs():
    service = WFMService()
    response = service.get_wf_configs()
    return jsonify(response), 200


# Health endpoint
@wfmapp.route(context_path + '/health', methods=["GET"])
def health():
    response = {"code": "200", "status": "ACTIVE"}
    return jsonify(response), 200

@wfmapp.route(context_path + '/v1/active-docs', methods=["GET"])
def active_docs():
    try:
        service = WFMService()
        response = service.get_active_doc_count()
        log_info("RESPONSE FROM ACTIVE DOCS IN REDIS :: ",app_context)
        if isinstance(response,list):
            response = {"code": "200", "data": response, "count":len(response)}
            return jsonify(response), 200
        else:
            return {"status": "FAILED", "message": "Something went wrong"}, 400
    except Exception as e:
        log_exception("Something went wrong: " + str(e), None, e)
        return {"status": "FAILED", "message": "Something went wrong"}, 400

# Fetches required headers from the request and adds it to the body.
def add_headers(data, api_request):
    headers = {
        "userID": api_request.headers["x-user-id"],
        "orgID": api_request.headers["x-org-id"],
        "roles": api_request.headers["x-roles"],
        "requestID": api_request.headers["x-request-id"],
        "sessionID": api_request.headers["x-session-id"],
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
