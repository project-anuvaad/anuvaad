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
from src.services.main import GoogleVisionOCR as Service
#####################################

file_ops = FileOperation()


class Response(object):
    def __init__(self, json_data, DOWNLOAD_FOLDER):
        self.json_data          = json_data
        self.DOWNLOAD_FOLDER    = DOWNLOAD_FOLDER

    def workflow_response(self, task_id, task_starttime, debug_flush=False):

        app_context.init()
        app_context.application_context = {}

        input_files, workflow_id, jobid, tool_name, step_order = file_ops.json_input_format(self.json_data)
        log_info("workflow_response started the response generation", app_context.application_context)
        error_validator = ValidationResponse(self.DOWNLOAD_FOLDER)
        try:
            error_validator.wf_keyerror(jobid, workflow_id, tool_name, step_order)
            error_validator.inputfile_list_error(input_files)
            output_file_response = list()
            for i, item in enumerate(input_files):
                input_filename, in_file_type, identifier     = file_ops.accessing_files(item['file'])
                self.json_data['taskID']                    = task_id
                app_context.application_context             = self.json_data
                #debug_flush = True
                if debug_flush == False:
                    ############################
                    response = Service(app_context=app_context)
                    # gv_file_response = copy.deepcopy(response)
                    ##############################
                    if response['code'] == 200:
                        
                        output_filename_json = file_ops.writing_json_file(i, response['rsp'], self.DOWNLOAD_FOLDER)
                        langs  = response['langs']
                        file_res = file_ops.one_filename_response(output_filename_json,langs)
                        output_file_response.append(file_res)
                        task_endtime = eval(str(time.time()).replace('.', '')[0:13])
                        response_true = CustomResponse(Status.SUCCESS.value, jobid, task_id)
                        response_success = response_true.success_response(workflow_id, task_starttime, task_endtime, tool_name, step_order, output_file_response)
                        response = copy.deepcopy(response_success)
                        log_info("successfully generated response for workflow", None)
                        
                        return response
                        # return ressponse, gv_file_response
                    else:
                        post_error_wf(response['code'], response['message'], app_context.app_context, None)
                        return None
                else:
                    log_info('flushing queue data, not handling file {}'.format(input_files), app_context.app_context)
                    post_error_wf(400, 'flushing queue data, not handling file {}'.format(input_files), app_context.app_context, None)
                    return None

            
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

    def nonwf_response(self):
        log_info("non workflow response started the response generation", app_context.application_context)
        input_files = self.json_data['input']['inputs']
        app_context.init()
        app_context.application_context = self.json_data
        error_validator = ValidationResponse(self.DOWNLOAD_FOLDER)
        try:
            error_validator.inputfile_list_error(input_files)
            # output_file_response = list()
            # for item in input_files:
            #     input_filename, in_file_type, identifier = file_ops.accessing_files(item['file'])
            #     output_json_data = DocumentStructure(None, input_filename)
            #     output_filename_json = file_ops.writing_json_file(i, output_json_data, self.DOWNLOAD_FOLDER)
            #     file_res = file_ops.one_filename_response(input_filename, output_filename_json, in_file_type)
            #     output_file_response.append(file_res)
            response_true = Status.SUCCESS.value
            #response_true['output'] = output_file_response

            output_json_data = Service(app_context=app_context)
            output_filename_json = file_ops.writing_json_file( 0,output_json_data, self.DOWNLOAD_FOLDER)
            response_true        =   file_ops.one_filename_response( output_filename_json,langs=' ')

            log_info("non workflow_response successfully generated response for rest server", app_context.application_context)
            response_true = copy.deepcopy(response_true)
            return response_true

        except FileErrors as e:
            response_custom = Status.ERR_STATUS.value
            response_custom['message'] = e.message
            response = file_ops.error_handler(response_custom, e.code, False)
            log_exception("non workflow_response some error occured while validating file", app_context.application_context, e)
            response = copy.deepcopy(response)
            return response
        except ServiceError as e:
            response_custom = Status.ERR_STATUS.value
            response_custom['message'] = str(e)
            response = file_ops.error_handler(response_custom, "SERVICE_ERROR", False)
            log_exception("non workflow_response Something went wrong during ocr.", app_context.application_context, e)
            response = copy.deepcopy(response)
            return response

    def multi_thred_block_merger(self,task_id, task_starttime,jobid):
        thread = threading.current_thread().name
        log_info("multi_thred_block_merger" + str(thread)+" | block-merger process started ===>",app_context.application_context)
        file_value_response = self.workflow_response(task_id, task_starttime)
        if "errorID" not in file_value_response.keys():
            producer = Producer()
            producer.push_data_to_queue(config.output_topic, file_value_response, jobid, task_id)

        else:
            log_info("process_merger_kf error send to error handler", app_context.application_context)
        