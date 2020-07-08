import time
from kafkawrapper.emproducer import push_to_queue


wf_error_topic = "anuvaad-etl-error"


def post_error(code, message, cause):
    error = {
        "errorId": generate_error_id(),
        "code": code,
        "message": message,
        "timeStamp": eval(str(time.time()).replace('.', ''))
    }
    if cause is not None:
        error["cause"] = cause

    #post es error index
    return error


def post_error_wf(code, message, jobId, taskId, state, status, cause):
    error = {
        "errorId": generate_error_id(),
        "code": code,
        "message": message,
        "timeStamp": eval(str(time.time()).replace('.', '')),
        "jobID": jobId,
        "taskID": taskId,
        "state": state,
        "status": status
    }
    if cause is not None:
        error["cause"] = cause
    push_to_queue(error, wf_error_topic)
    # post es error index
    return error


def generate_error_id():
    return "error-" + str(time.time()).replace('.', '')

