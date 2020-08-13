import os
from pathlib import Path
import time
from anuvaad_em.emservice import post_error
from anuvaad_em.emservice import post_error_wf

class FileOperation(object):

    def __init__(self):
        pass

    # extracting data from received json input
    def json_input_format(self, json_data):
        input_data = json_data["input"]
        workflow_id = json_data['workflowCode']
        jobid = json_data['jobID']
        tool_name = json_data['tool']
        step_order = json_data['stepOrder']
        return input_data, workflow_id, jobid, tool_name, step_order

    # error manager integration 
    def error_handler(self, object_in, iswf):
        if iswf:
                job_id = object_in["jobID"]
                task_id = object_in["taskID"]
                state = object_in['state']
                status = object_in['status']
                code = object_in['error']['code']
                message = object_in['error']['message']
                error = post_error_wf(code, message, job_id, task_id, state, status, None)
                return error
        else:
            code = object_in['error']['code']
            message = object_in['error']['message']
            error = post_error(code, message, None)
            return error