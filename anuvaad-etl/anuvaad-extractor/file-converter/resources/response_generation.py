from utilities.utils import FileOperation
from utilities.model_response import CustomResponse
from common.errors import WorkflowkeyError
from common.errors import FileErrors
from common.errors import FileEncodingError
from common.errors import ServiceError
from utilities.model_response import Status
from common.error_validator import ValidationResponse
from services.libre_converter import LibreOfficeError, convert_to
from common.errors import RestAPIError, InternalServerErrorError
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from subprocess import TimeoutExpired
import time
import os
import config

from uuid import uuid4
from shutil import copyfile

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
            error_validator.inputfile_list_empty(input_files)
            output_file_response = list()
            for i, item in enumerate(input_files):
                upload_id = str(uuid4())
                input_filename, in_file_type, in_locale = file_ops.accessing_files(item)
                filepath = os.path.join(config.download_folder, input_filename)
                result = convert_to(os.path.join(config.download_folder, 'pdf', upload_id), filepath, timeout=15)
                copyfile(result, os.path.join(config.download_folder, upload_id+'.pdf'))
                file_res = file_ops.one_filename_response(input_filename, upload_id+'.pdf', in_locale, 'pdf')
                output_file_response.append(file_res)
            task_endtime = str(time.time()).replace('.', '')
            response_true = CustomResponse(Status.SUCCESS.value, jobid, task_id)
            response_success = response_true.success_response(workflow_id, task_starttime, task_endtime, tool_name, step_order, output_file_response)
            log_info("workflow_response", "successfully generated response for workflow", jobid)
            return response_success
        except LibreOfficeError:
            response_custom = CustomResponse(Status.ERR_STATUS.value, jobid, task_id)
            response_custom.status_code['message'] = str(e)
            response = file_ops.error_handler(response_custom.status_code, "SERVICE_ERROR", True)
            log_exception("workflow_response", "Error when converting file to PDF", jobid, e)
            return response
        except TimeoutExpired:
            response_custom = CustomResponse(Status.ERR_STATUS.value, jobid, task_id)
            response_custom.status_code['message'] = str(e)
            response = file_ops.error_handler(response_custom.status_code, "SERVICE_ERROR", True)
            log_exception("workflow_response", "Timeout when converting file to PDF", jobid, e)
            return response
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
