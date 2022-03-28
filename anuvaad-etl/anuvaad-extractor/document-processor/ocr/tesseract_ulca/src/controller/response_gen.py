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

###################################
from src.services.main import OCR as Service

#####################################

file_ops = FileOperation()


class Response(object):
    def __init__(self, json_data):
        self.json_data = json_data

    def nonwf_response(self):
        log_info(
            "non workflow response started the response generation",
            app_context.application_context,
        )
        app_context.init()
        app_context.application_context = self.json_data
        try:

            output_json_data = Service(app_context=app_context)
            log_info(
                "non workflow_response successfully generated response for rest server",
                app_context.application_context,
            )
            return output_json_data

        except FileErrors as e:
            response_custom = Status.ERR_STATUS.value
            response_custom["message"] = e.message
            response = file_ops.error_handler(response_custom, e.code, False)
            log_exception(
                "non workflow_response some error occured while validating file",
                app_context.application_context,
                e,
            )
            response = copy.deepcopy(response)
            return response
        except ServiceError as e:
            response_custom = Status.ERR_STATUS.value
            response_custom["message"] = str(e)
            response = file_ops.error_handler(response_custom, "SERVICE_ERROR", False)
            log_exception(
                "non workflow_response Something went wrong during ocr.",
                app_context.application_context,
                e,
            )
            response = copy.deepcopy(response)
            return response

    def multi_thred_block_merger(self, task_id, task_starttime, jobid):
        thread = threading.current_thread().name
        log_info(
            "multi_thred_block_merger"
            + str(thread)
            + " | block-merger process started ===>",
            app_context.application_context,
        )
        file_value_response = self.workflow_response(task_id, task_starttime)
        if "errorID" not in file_value_response.keys():
            producer = Producer()
            producer.push_data_to_queue(
                config.output_topic, file_value_response, jobid, task_id
            )

        else:
            log_info(
                "process_merger_kf error send to error handler",
                app_context.application_context,
            )
