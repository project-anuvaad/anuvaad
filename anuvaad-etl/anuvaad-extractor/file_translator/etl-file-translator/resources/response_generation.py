import copy
import time

from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_info

from errors.error_validator import ValidationResponse
from errors.errors_exception import FileEncodingError
from errors.errors_exception import FileErrors
from errors.errors_exception import ServiceError
from errors.errors_exception import WorkflowkeyError
from services.service import DocxTransform, FetchContent, PptxTransform
from utilities.model_response import CustomResponse
from utilities.model_response import Status
from utilities.utils import FileOperation
import config

file_ops = FileOperation()


class Response(object):
    def __init__(self, json_data, DOWNLOAD_FOLDER):
        self.json_data = json_data
        self.DOWNLOAD_FOLDER = DOWNLOAD_FOLDER

    # Generating response for a workflow request coming from kafka consumer or flask server
    def workflow_response(self, task_id, task_starttime, transform_flow=False, download_flow=False):
        input_key, workflow_id, jobid, tool_name, step_order, user_id = file_ops.json_input_format(self.json_data)
        log_info("workflow_response : started the response generation for %s" % jobid, self.json_data)
        error_validator = ValidationResponse(self.DOWNLOAD_FOLDER)
        try:
            error_validator.wf_keyerror(jobid, workflow_id, tool_name, step_order)  # Validating Workflow key-values
            error_validator.inputfile_list_empty(input_key)  # Validating Input key for files input and only text input
            output_file_response = list()
            # input key is a dictionary data for files input, "files" as a key
            if isinstance(input_key, dict) and 'files' in input_key.keys():
                for i, item in enumerate(input_key['files']):
                    input_filename, in_file_type, in_locale = file_ops.accessing_files(item)
                    if in_file_type == "docx" and transform_flow:
                        docx_transform_obj = DocxTransform(input_filename)
                        docx_obj = docx_transform_obj.read_docx_file(input_filename)
                        transformed_obj = docx_transform_obj.generate_json_structure(docx_obj)
                        out_json_filepath = docx_transform_obj.write_json_file(transformed_obj)
                        output_filename = out_json_filepath
                        out_file_type = 'json'
                    elif in_file_type == "pptx" and transform_flow:
                        pptx_transform_obj = PptxTransform(input_filename)
                        pptx_obj = pptx_transform_obj.read_pptx_file(input_filename)
                        transformed_obj = pptx_transform_obj.generate_json_structure(pptx_obj)
                        out_json_filepath = pptx_transform_obj.write_json_file(transformed_obj)
                        output_filename = out_json_filepath
                        out_file_type = 'json'

                    elif in_file_type == "json" and download_flow:
                        if config.DOCX_FILE_PREFIX in input_filename:
                            json_file_name = input_filename.split(config.DOCX_FILE_PREFIX)[-1]
                            json_file_name = json_file_name.replace('.json', '.docx')

                            docx_transform_obj = DocxTransform(json_file_name)
                            docx_obj = docx_transform_obj.read_docx_file(input_filename)

                            fc_obj = FetchContent(input_filename)
                            fc_obj.generate_map_from_fetch_content_response()

                            translated_docx = docx_transform_obj.translate_docx_file(docx_obj, fc_obj.block_trans_map)
                            translated_docx_file_name = docx_transform_obj.write_docx_file(translated_docx)

                            output_filename = translated_docx_file_name
                            out_file_type = 'docx'

                        if config.PPTX_FILE_PREFIX in input_filename:
                            json_file_name = input_filename.split(config.PPTX_FILE_PREFIX)[-1]
                            json_file_name = json_file_name.replace('.json', '.pptx')

                            pptx_transform_obj = PptxTransform(json_file_name)
                            pptx_obj = pptx_transform_obj.read_pptx_file(input_filename)

                            fc_obj = FetchContent(input_filename)
                            fc_obj.generate_map_from_fetch_content_response()

                            translated_pptx = pptx_transform_obj.translate_pptx_file(pptx_obj, fc_obj.block_trans_map)
                            translated_pptx_file_name = pptx_transform_obj.write_pptx_file(translated_pptx)

                            output_filename = translated_pptx_file_name
                            out_file_type = 'pptx'

                    file_res = file_ops.one_filename_response(input_filename,
                                                              output_filename=output_filename,
                                                              in_locale=in_locale,
                                                              in_file_type=out_file_type)
                    file_req_obj = copy.deepcopy(item)
                    file_res = file_ops.add_aditional_fields(file_req_obj, file_res)
                    output_file_response.append(file_res)
            # input key is a list data of objects, object contain text and language code
            else:
                raise WorkflowkeyError(400, "files key is missing in the input keys")

            task_endtime = eval(str(time.time()).replace('.', '')[0:13])
            response_true = CustomResponse(Status.SUCCESS.value, jobid, task_id)
            response_success = response_true.success_response(workflow_id, task_starttime, task_endtime, tool_name,
                                                              step_order, output_file_response)
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
