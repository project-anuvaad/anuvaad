import time
import uuid
from .emproducer import push_to_queue
from .eswrapper import index_to_es


wf_error_topic = "anuvaad-etl-error"


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

    push_to_queue(error, wf_error_topic)
    index_to_es(error)
    return error


def generate_error_id():
    return uuid.uuid4()

