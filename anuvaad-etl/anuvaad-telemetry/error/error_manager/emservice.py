import logging
import time
import uuid
import os

from .emproducer import push_to_queue
from .eswrapper import index_to_es

log = logging.getLogger('file')
anu_etl_wf_error_topic = os.environ.get('ANU_ETL_WF_ERROR_TOPIC', 'anuvaad-etl-wf-errors')


def post_error(code, message, cause):
    error = {
        "errorID": generate_error_id(),
        "code": code,
        "message": message,
        "timeStamp": eval(str(time.time()).replace('.', '')),
        "errorType": "core-error"
    }
    if cause is not None:
        error["cause"] = cause

    index_to_es(error)
    log.info("Error posted to the es index.")

    return error


def post_error_wf(code, message, jobId, taskId, state, status, cause):
    error = {
        "errorID": generate_error_id(),
        "code": code,
        "message": message,
        "timeStamp": eval(str(time.time()).replace('.', '')),
        "jobID": jobId,
        "taskID": taskId,
        "state": state,
        "status": status,
        "errorType": "wf-error"
    }
    if cause is not None:
        error["cause"] = cause
    push_to_queue(error, anu_etl_wf_error_topic)
    log.info("Error pushed to the wf error topic.")
    index_to_es(error)
    log.info("Error posted to the es index.")
    return error


def generate_error_id():
    return str(uuid.uuid4())
