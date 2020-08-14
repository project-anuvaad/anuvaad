from utilities.utils import FileOperation
from utilities.model_response import CustomResponse
from errors.errors_exception import WorkflowkeyError
from errors.errors_exception import FileErrors
from errors.errors_exception import FileEncodingError
from errors.errors_exception import ServiceError
from utilities.model_response import Status
from errors.error_validator import ValidationResponse
from services.service import Tokenisation
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
import time

file_ops = FileOperation()

class Response(object):
    def __init__(self, json_data, DOWNLOAD_FOLDER):
        self.json_data =json_data
        self.DOWNLOAD_FOLDER = DOWNLOAD_FOLDER

    def workflow_response(self, task_id, task_starttime):
        input_files, workflow_id, jobid, tool_name, step_order = file_ops.json_input_format(self.json_data)
        log_info("workflow_response", "started the response generation", jobid)
        error_validator = ValidationResponse(self.DOWNLOAD_FOLDER)
        tokenisation = Tokenisation(self.DOWNLOAD_FOLDER)
        try:
            error_validator.wf_keyerror(jobid, workflow_id, tool_name, step_order)
            error_validator.inputfile_list_empty(input_files)
            output_file_response = list()
            for i, item in enumerate(input_files):
                input_filename, in_file_type, in_locale = file_ops.accessing_files(item)
                input_file_data = file_ops.read_file(input_filename)
                error_validator.file_encoding_error(input_file_data)
                output_filename = tokenisation.tokenisation_response(input_file_data, in_locale, i)
                file_res = file_ops.one_filename_response(input_filename, output_filename, in_locale, in_file_type)
                output_file_response.append(file_res)
            task_endtime = str(time.time()).replace('.', '')
            response_true = CustomResponse(Status.SUCCESS.value, jobid, task_id)
            response_success = response_true.success_response(workflow_id, task_starttime, task_endtime, tool_name, step_order, output_file_response)
            log_info("workflow_response", "successfully generated response for workflow", jobid)
            return response_success
        except WorkflowkeyError as e:
            response_custom = CustomResponse(Status.ERR_STATUS.value, jobid, task_id)
            response_custom.status_code['message'] = str(e)
            response = file_ops.error_handler(response_custom.status_code, "WORKFLOWKEY-ERROR", True)
            log_exception("workflow_response", "workflow key error: key value missing", jobid, e)
            return response
        except FileErrors as e:
            response_custom = CustomResponse(Status.ERR_STATUS.value, jobid, task_id)
            response_custom.status_code['message'] = e.message
            response = file_ops.error_handler(response_custom.status_code, e.code, True)
            log_exception("workflow_response", "some error occured while validating file", jobid, e)
            return response
        except FileEncodingError as e:
            response_custom = CustomResponse(Status.ERR_STATUS.value, jobid, task_id)
            response_custom.status_code['message'] = str(e)
            response = file_ops.error_handler(response_custom.status_code, "ENCODING_ERROR", True)
            log_exception("workflow_response", "service supports only utf-16 encoded file", jobid, e)
            return response
        except ServiceError as e:
            response_custom = CustomResponse(Status.ERR_STATUS.value, jobid, task_id)
            response_custom.status_code['message'] = str(e)
            response = file_ops.error_handler(response_custom.status_code, "SERVICE_ERROR", True)
            log_exception("workflow_response", "Error occured during tokenisation or file writing", jobid, e)
            return response

    def nonwf_response(self):
        log_info("non workflow response", "started the response generation", None)
        input_files = self.json_data['files']
        error_validator = ValidationResponse(self.DOWNLOAD_FOLDER)
        tokenisation = Tokenisation(self.DOWNLOAD_FOLDER)
        try:
            error_validator.inputfile_list_empty(input_files)
            output_file_response = list()
            for i, item in enumerate(input_files):
                input_filename, in_file_type, in_locale = file_ops.accessing_files(item)
                input_file_data = file_ops.read_file(input_filename)
                error_validator.file_encoding_error(input_file_data)
                output_filename = tokenisation.tokenisation_response(input_file_data, in_locale, i)
                file_res = file_ops.one_filename_response(input_filename, output_filename, in_locale, in_file_type)
                output_file_response.append(file_res)
            response_true = Status.SUCCESS.value
            response_true['output'] = output_file_response
            log_info("non workflow_response", "successfully generated response for rest server", None)
            return response_true
        except FileErrors as e:
            response_custom = Status.ERR_STATUS.value
            response_custom['message'] = e.message
            response = file_ops.error_handler(response_custom, e.code, False)
            log_exception("non workflow_response", "some error occured while validating file", None, e)
            return response
        except FileEncodingError as e:
            response_custom = Status.ERR_STATUS.value
            response_custom['message'] = str(e)
            response = file_ops.error_handler(response_custom, "ENCODING_ERROR", False)
            log_exception("non workflow_response", "service supports only utf-16 encoded file", None, e)
            return response
        except ServiceError as e:
            response_custom = Status.ERR_STATUS.value
            response_custom['message'] = str(e)
            response = file_ops.error_handler(response_custom, "SERVICE_ERROR", False)
            log_exception("non workflow_response", "Error occured during tokenisation or file writing", None, e)
            return response