from src.utilities.utils import FileOperation
from src.utilities.model_response import CustomResponse
from src.utilities.model_response import Status
from src.errors.errors_exception import WorkflowkeyError
from src.errors.errors_exception import FileErrors
from src.errors.errors_exception import ServiceError
from src.errors.error_validator import ValidationResponse
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.errorhandler import post_error_wf
import time
import config
import copy
import threading
from src.kafka_module.producer import Producer
import src.utilities.app_context as app_context

from src.pipeline_request_handler.request_handler import process_incoming_request

file_ops = FileOperation()
class Response(object):
    def __init__(self, json_data, DOWNLOAD_FOLDER):
        self.json_data          = json_data
        self.DOWNLOAD_FOLDER    = DOWNLOAD_FOLDER

    def workflow_response(self, task_id, task_starttime):

        app_context.init()
        app_context.application_context = self.json_data

        input_params, workflow_id, jobid, tool_name, step_order = file_ops.json_input_format(self.json_data)
        log_info("workflow_response started the response generation", app_context.application_context)
        error_validator = ValidationResponse(self.DOWNLOAD_FOLDER)
        
        try:
            error_validator.wf_keyerror(jobid, workflow_id, tool_name, step_order)

            # --------------------------

            result = process_incoming_request(app_context, input_params[0], jobid, workflow_id)
            
            # --------------------------
                
            task_endtime        = eval(str(time.time()).replace('.', '')[0:13])
            response_true       = CustomResponse(Status.SUCCESS.value, jobid, task_id)
            response_success    = response_true.success_response(workflow_id, task_starttime, task_endtime, tool_name, step_order, result)
            log_info("workflow_response : successfully generated response for workflow", app_context.application_context)
            return response_success
            
        except WorkflowkeyError as e:
            response_custom = CustomResponse(Status.ERR_STATUS.value, jobid, task_id)
            response_custom.status_code['message'] = str(e)
            response = file_ops.error_handler(response_custom.status_code, "WORKFLOWKEY-ERROR", True)
            log_exception("workflow_response workflow key error: key value missing", app_context.application_context, e)
            response = copy.deepcopy(response)
            return response
        except FileErrors as e:
            response_custom = CustomResponse(Status.ERR_STATUS.value, jobid, task_id)
            response_custom.status_code['message'] = e.message
            response = file_ops.error_handler(response_custom.status_code, e.code, True)
            log_exception("workflow_response some error occured while validating file", app_context.application_context, e)
            response = copy.deepcopy(response)
            return response
        except ServiceError as e:
            response_custom = CustomResponse(Status.ERR_STATUS.value, jobid, task_id)
            response_custom.status_code['message'] = str(e)
            response = file_ops.error_handler(response_custom.status_code, "SERVICE_ERROR", True)
            log_exception("workflow_response Something went wrong during ocr.", app_context.application_context, e)
            response = copy.deepcopy(response)
            return response