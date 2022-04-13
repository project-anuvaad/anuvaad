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
import copy
import json

file_ops = FileOperation()

class Response(object):
    def __init__(self, json_data, DOWNLOAD_FOLDER):
        self.json_data =json_data
        self.DOWNLOAD_FOLDER = DOWNLOAD_FOLDER
    
    # Generating response for a workflow request coming from kafka consumer or flask server
    def workflow_response(self, task_id, task_starttime):
        log_info("process_tokenization_OCR : received input : %s" %self.json_data, self.json_data)
        input_key, workflow_id, jobid, tool_name, step_order, user_id = file_ops.json_input_format(self.json_data)
        log_info("workflow_response : started the response generation for %s"%jobid, self.json_data)
        error_validator = ValidationResponse(self.DOWNLOAD_FOLDER)
        tokenisation = Tokenisation(self.DOWNLOAD_FOLDER, self.json_data)
        try:
            error_validator.wf_keyerror(jobid, workflow_id, tool_name, step_order)    # Validating Workflow key-values
            error_validator.inputfile_list_empty(input_key)                           # Validating Input key for files input and only text input
            # input key is a dictionary data for files input, "files" as a key
            if not isinstance(input_key, list):
                if 'files' in input_key.keys():
                    output_file_response = list()
                    for i, item in enumerate(input_key['files']):
                        input_filename, in_file_type, in_locale = file_ops.accessing_files(item)
                        log_info("::tokenization_ocr : received Language: %s" %in_locale, self.json_data)
                        error_validator.check_language(in_locale)
                        if in_file_type == "txt":
                            input_file_data = file_ops.read_txt_file(input_filename)
                            error_validator.file_encoding_error(input_file_data)
                            output_filename = tokenisation.tokenisation_response(input_file_data, in_locale, i)
                        elif in_file_type == "json":
                            input_jsonfile_data, file_write = file_ops.read_json_file(input_filename)
                            pages = tokenisation.get_all_the_paragraphs(input_jsonfile_data)
                            pages = [tokenisation.adding_tokenised_text_blockmerger(item, in_locale, page_id)
                                                                for page_id, item in enumerate(pages)]
                            pages = tokenisation.getting_incomplete_text_merging_blocks(pages)
                            input_jsonfile_data['outputs'][0]['pages'] = pages
                            # input_jsonfile_data['file_locale'] = in_locale
                            json_data_write = json.dumps(input_jsonfile_data)
                            file_write.seek(0)
                            file_write.truncate()
                            file_write.write(json_data_write)
                            output_filename = input_filename
                        file_res = file_ops.one_filename_response(input_filename, output_filename, in_locale, in_file_type)
                        file_req_obj = copy.deepcopy(item)
                        file_res = file_ops.add_aditional_fields(file_req_obj, file_res)
                        output_file_response.append(file_res)
                        tokenisation.save_page_res(input_jsonfile_data, output_filename)
            # input key is a list data of objects, object contain text and language code
            else:
                output_file_response = []
                for paragraph in input_key:
                    input_paragraphs = paragraph['text']
                    input_locale = paragraph['locale']
                    error_validator.check_language(input_locale)
                    tokenised_sentences = [tokenisation.tokenisation_core([input_paragraph], input_locale) for input_paragraph in input_paragraphs]  
                    output_list_text = [{"inputText" : x, "tokenisedSentences" : y} for x, y in zip(input_paragraphs, tokenised_sentences)]
                    output_per_para = {'tokenisedText' : output_list_text, 'locale':input_locale}
                    output_file_response.append(output_per_para)
            task_endtime =  eval(str(time.time()).replace('.', '')[0:13])
            response_true = CustomResponse(Status.SUCCESS.value, jobid, task_id)
            response_success = response_true.success_response(workflow_id, task_starttime, task_endtime, tool_name, step_order, output_file_response)
            response = copy.deepcopy(response_success)
            log_info("workflow_response : successfully generated response for workflow", self.json_data)
            return response
        # exceptions for workflow key error
        except WorkflowkeyError as e:
            response_custom = self.json_data
            response_custom['taskID'] = task_id
            response_custom['message'] = str(e)
            response = file_ops.error_handler(response_custom, "WORKFLOWKEY-ERROR", True)
            log_exception("workflow_response : workflow key error: key value missing", self.json_data, e)
            response = copy.deepcopy(response)
            return response
        # exceptions for input key data validation
        except FileErrors as e:
            response_custom = self.json_data
            response_custom['taskID'] = task_id
            response_custom['message'] = e.message
            response = file_ops.error_handler(response_custom, e.code, True)
            log_exception("workflow_response : some error occured while validating file", self.json_data, e)
            response = copy.deepcopy(response)
            return response
        # checking filedata unicodes and null data
        except FileEncodingError as e:
            response_custom = self.json_data
            response_custom['taskID'] = task_id
            response_custom['message'] = str(e)
            response = file_ops.error_handler(response_custom, "ENCODING_ERROR", True)
            log_exception("workflow_response : service supports only utf-16 encoded file", self.json_data, e)
            response = copy.deepcopy(response)
            return response
        # exceptions for tokenisation core logic and file writing of tokenised output
        except ServiceError as e:
            response_custom = self.json_data
            response_custom['taskID'] = task_id
            response_custom['message'] = str(e)
            response = file_ops.error_handler(response_custom, "SERVICE_ERROR", True)
            log_exception("workflow_response : Error occured during tokenisation or file writing", self.json_data, e)
            response = copy.deepcopy(response)
            return response
        # any other exception i.e. not covered in above exceptions
        except Exception as e:
            response_custom = self.json_data
            response_custom['taskID'] = task_id
            response_custom['message'] = str(e)
            response = file_ops.error_handler(response_custom, "SERVICE_ERROR", True)
            log_exception("workflow_response : Any random exception", self.json_data, e)
            response = copy.deepcopy(response)
            return response

    # text block data as a input data.
    def workflow_response_block_tokeniser(self, task_id, task_starttime):
        input_key, workflow_id, jobid, tool_name, step_order, user_id = file_ops.json_input_format(self.json_data)
        log_info("workflow_response : started the block tokenisation response generation", self.json_data)
        error_validator = ValidationResponse(self.DOWNLOAD_FOLDER)
        tokenisation = Tokenisation(self.DOWNLOAD_FOLDER, self.json_data)
        try:
            error_validator.wf_keyerror(jobid, workflow_id, tool_name, step_order)    # Validating Workflow key-values
            error_validator.inputfile_list_empty(input_key)                           # Validating Input key for text block input
            blocks_list, record_id, model_id, in_locale = file_ops.get_input_values_for_block_tokenise(input_key)
            error_validator.check_language(in_locale)
            input_key = tokenisation.adding_tokenised_text_blockmerger(input_key, in_locale, 0)
            task_endtime = eval(str(time.time()).replace('.', '')[0:13])
            response_true = CustomResponse(Status.SUCCESS.value, jobid, task_id)
            response_success = response_true.success_response(workflow_id, task_starttime, task_endtime, tool_name, step_order, input_key)
            response = copy.deepcopy(response_success)
            log_info("workflow_response : successfully generated response for workflow", self.json_data)
            return response
        # exceptions for workflow key error
        except WorkflowkeyError as e:
            response_custom = self.json_data
            response_custom['taskID'] = task_id
            response_custom['message'] = str(e)
            response = file_ops.error_handler(response_custom, "WORKFLOWKEY-ERROR", True)
            log_exception("workflow_response : workflow key error: key value missing", self.json_data, e)
            response = copy.deepcopy(response)
            return response
        # exceptions for input key data 
        except FileErrors as e:
            response_custom = self.json_data
            response_custom['taskID'] = task_id
            response_custom['message'] = e.message
            response = file_ops.error_handler(response_custom, e.code, True)
            log_exception("workflow_response : some error occured while validating file", self.json_data, e)
            response = copy.deepcopy(response)
            return response
        # exceptions for tokenisation core logic
        except ServiceError as e:
            response_custom = self.json_data
            response_custom['taskID'] = task_id
            response_custom['message'] = str(e)
            response = file_ops.error_handler(response_custom, "SERVICE_ERROR", True)
            log_exception("workflow_response : Error occured during tokenisation or file writing", self.json_data, e)
            response = copy.deepcopy(response)
            return response
        # any other exceptions
        except Exception as e:
            response_custom = self.json_data
            response_custom['taskID'] = task_id
            response_custom['message'] = str(e)
            response = file_ops.error_handler(response_custom, "SERVICE_ERROR", True)
            log_exception("workflow_response : Any random exception", self.json_data, e)
            response = copy.deepcopy(response)
            return response
        
    # generating response for api requests other than workflow
    def nonwf_response(self):
        log_info("non workflow response : started the response generation", None)
        error_validator = ValidationResponse(self.DOWNLOAD_FOLDER)
        tokenisation = Tokenisation(self.DOWNLOAD_FOLDER, self.json_data)
        try:
            if 'files' in self.json_data.keys():
                input_files = self.json_data['files']
                error_validator.inputfile_list_empty(input_files)                      # Validation of input key data
                output_file_response = list()
                for i, item in enumerate(input_files):
                    input_filename, in_file_type, in_locale = file_ops.accessing_files(item)
                    error_validator.check_language(in_locale)
                    input_file_data = file_ops.read_txt_file(input_filename)
                    error_validator.file_encoding_error(input_file_data)
                    output_filename = tokenisation.tokenisation_response(input_file_data, in_locale, i)
                    file_res = file_ops.one_filename_response(input_filename, output_filename, in_locale, in_file_type)
                    output_file_response.append(file_res)
            else:
                input_paragraphs = self.json_data['text']
                input_locale = self.json_data['locale']
                error_validator.check_language(input_locale)
                tokenised_sentences = [tokenisation.tokenisation_core([input_paragraph], input_locale) for input_paragraph in input_paragraphs]  
                output_list_text = [{"inputText" : x, "tokenisedSentences" : y} for x, y in zip(input_paragraphs, tokenised_sentences)]
                output_file_response = {'tokenisedText' : output_list_text, 'locale':input_locale}
            response_true = Status.SUCCESS.value
            response_true['output'] = output_file_response
            log_info("non workflow_response : successfully generated response for rest server", None)
            return response_true
        except FileErrors as e:
            response_custom = Status.ERR_STATUS.value
            response_custom['message'] = e.message
            response = file_ops.error_handler(response_custom, e.code, False)
            log_exception("non workflow_response : some error occured while validating file", None, e)
            return response
        except FileEncodingError as e:
            response_custom = Status.ERR_STATUS.value
            response_custom['message'] = str(e)
            response = file_ops.error_handler(response_custom, "ENCODING_ERROR", False)
            log_exception("non workflow_response : service supports only utf-16 encoded file", None, e)
            return response
        except ServiceError as e:
            response_custom = Status.ERR_STATUS.value
            response_custom['message'] = str(e)
            response = file_ops.error_handler(response_custom, "SERVICE_ERROR", False)
            log_exception("non workflow_response : Error occured during tokenisation or file writing", None, e)
            return response