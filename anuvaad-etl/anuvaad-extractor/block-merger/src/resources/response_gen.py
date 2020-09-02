from src.utilities.utils import FileOperation
from src.services.main import DocumentStructure
from src.utilities.model_response import CustomResponse
from src.utilities.model_response import Status
from src.errors.errors_exception import WorkflowkeyError
from src.errors.errors_exception import FileErrors
from src.errors.errors_exception import ServiceError
from src.errors.error_validator import ValidationResponse
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
import time
import copy

file_ops = FileOperation()


class Response(object):
    def __init__(self, json_data, DOWNLOAD_FOLDER):
        self.json_data =json_data
        self.DOWNLOAD_FOLDER = DOWNLOAD_FOLDER

    def workflow_response(self, task_id, task_starttime):
        input_files, workflow_id, jobid, tool_name, step_order = file_ops.json_input_format(self.json_data)
        log_info("workflow_response", "started the response generation", jobid)
        error_validator = ValidationResponse(self.DOWNLOAD_FOLDER)
        try:
            error_validator.wf_keyerror(jobid, workflow_id, tool_name, step_order)
            error_validator.inputfile_list_error(input_files)
            output_file_response = list()
            for i, item in enumerate(input_files):
                input_filename, in_file_type, in_locale = file_ops.accessing_files(item)
                output_json_data = DocumentStructure(jobid, input_filename,in_locale)
                output_filename_json = file_ops.writing_json_file(i, output_json_data, self.DOWNLOAD_FOLDER)
                file_res = file_ops.one_filename_response(input_filename, output_filename_json, in_locale, in_file_type)
                output_file_response.append(file_res)
            task_endtime = str(time.time()).replace('.', '')
            response_true = CustomResponse(Status.SUCCESS.value, jobid, task_id)
            response_success = response_true.success_response(workflow_id, task_starttime, task_endtime, tool_name, step_order, output_file_response)
            response = copy.deepcopy(response_success)
            log_info("workflow_response", "successfully generated response for workflow", jobid)
            return response
        except WorkflowkeyError as e:
            response_custom = CustomResponse(Status.ERR_STATUS.value, jobid, task_id)
            response_custom.status_code['message'] = str(e)
            response = file_ops.error_handler(response_custom.status_code, "WORKFLOWKEY-ERROR", True)
            log_exception("workflow_response", "workflow key error: key value missing", jobid, e)
            response = copy.deepcopy(response)
            return response
        except FileErrors as e:
            response_custom = CustomResponse(Status.ERR_STATUS.value, jobid, task_id)
            response_custom.status_code['message'] = e.message
            response = file_ops.error_handler(response_custom.status_code, e.code, True)
            log_exception("workflow_response", "some error occured while validating file", jobid, e)
            response = copy.deepcopy(response)
            return response
        except ServiceError as e:
            response_custom = CustomResponse(Status.ERR_STATUS.value, jobid, task_id)
            response_custom.status_code['message'] = str(e)
            response = file_ops.error_handler(response_custom.status_code, "SERVICE_ERROR", True)
            log_exception("workflow_response", "Something went wrong during pdf to block conversion.", jobid, e)
            response = copy.deepcopy(response)
            return response

    def nonwf_response(self):
        log_info("non workflow response", "started the response generation", None)
        input_files = self.json_data['files']
        error_validator = ValidationResponse(self.DOWNLOAD_FOLDER)
        try:
            error_validator.inputfile_list_empty(input_files)
            output_file_response = list()
            for item in input_files:
                input_filename, in_file_type, in_locale = file_ops.accessing_files(item)
                output_json_data = DocumentStructure(None, input_filename)
                output_filename_json = file_ops.writing_json_file(i, output_json_data, self.DOWNLOAD_FOLDER)
                file_res = file_ops.one_filename_response(input_filename, output_filename_json, in_locale, in_file_type)
                output_file_response.append(file_res)
            response_true = Status.SUCCESS.value
            response_true['output'] = output_file_response
            log_info("non workflow_response", "successfully generated response for rest server", None)
            response_true = copy.deepcopy(response_true)
            return response_true
        except FileErrors as e:
            response_custom = Status.ERR_STATUS.value
            response_custom['message'] = e.message
            response = file_ops.error_handler(response_custom, e.code, False)
            log_exception("non workflow_response", "some error occured while validating file", None, e)
            response = copy.deepcopy(response)
            return response
        except ServiceError as e:
            response_custom = Status.ERR_STATUS.value
            response_custom['message'] = str(e)
            response = file_ops.error_handler(response_custom, "SERVICE_ERROR", False)
            log_exception("non workflow_response", "Something went wrong during pdf to block conversion.", None, e)
            response = copy.deepcopy(response)
            return response