from utilities.utils import FileOperation
from services.service import Pdf2HtmlService
from utilities.model_response import CustomResponse
from utilities.model_response import Status
from errors.errors_exception import WorkflowkeyError
from errors.errors_exception import FileErrors
from errors.errors_exception import ServiceError
from errors.error_validator import ValidationResponse
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
        pdf_html_service = Pdf2HtmlService(self.DOWNLOAD_FOLDER)
        try:
            error_validator.wf_keyerror(jobid, workflow_id, tool_name, step_order)
            error_validator.inputfile_list_error(input_files)
            output_file_response = list()
            for item in input_files:
                input_filename, in_file_type, in_locale = file_ops.accessing_files(item)
                input_filepath = file_ops.input_path(input_filename)
                output_htmlfiles_path, output_pngfiles_path = pdf_html_service.pdf2html(input_filepath, jobid)
                file_res = file_ops.one_filename_response(input_filename, output_htmlfiles_path, output_pngfiles_path, in_locale, in_file_type)
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
            log_exception("workflow_response", "Something went wrong during pdf to html conversion.", jobid, e)
            response = copy.deepcopy(response)
            return response

    def nonwf_response(self):
        log_info("non workflow response", "started the response generation", None)
        input_files = self.json_data['files']
        error_validator = ValidationResponse(self.DOWNLOAD_FOLDER)
        pdf_html_service = Pdf2HtmlService(self.DOWNLOAD_FOLDER)
        try:
            error_validator.inputfile_list_empty(input_files)
            output_file_response = list()
            for item in input_files:
                input_filename, in_file_type, in_locale = file_ops.accessing_files(item)
                output_htmlfiles_path, output_pngfiles_path = pdf_html_service.pdf2html(self.DOWNLOAD_FOLDER, input_filepath)
                file_res = file_ops.one_filename_response(input_filename, output_htmlfiles_path, output_pngfiles_path, in_locale, in_file_type)
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
        except ServiceError as e:
            response_custom = Status.ERR_STATUS.value
            response_custom['message'] = str(e)
            response = file_ops.error_handler(response_custom, "SERVICE_ERROR", False)
            log_exception("non workflow_response", "Something went wrong during pdf to html conversion.", None, e)
            return response