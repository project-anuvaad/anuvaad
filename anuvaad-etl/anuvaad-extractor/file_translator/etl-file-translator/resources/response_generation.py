import copy
import time

from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_info

import config
from errors.error_validator import ValidationResponse
from errors.errors_exception import FileEncodingError
from errors.errors_exception import FileErrors
from errors.errors_exception import ServiceError
from errors.errors_exception import WorkflowkeyError
from services.docx_transform import DocxTransform
from services.html_transform import HTMLTransform
from services.fetch_content import FetchContent
from services.html_converter import HtmlConvert
from services.pptx_transform import PptxTransform
from utilities.model_response import CustomResponse
from utilities.model_response import Status
from utilities.utils import FileOperation
file_ops = FileOperation()

class Response(object):
    def __init__(self, json_data, DOWNLOAD_FOLDER):
        self.json_data = json_data
        self.DOWNLOAD_FOLDER = DOWNLOAD_FOLDER

    # Generating response for a workflow request coming from kafka consumer or flask server
    def workflow_response(self, task_id, task_starttime, transform_flow=False, download_flow=False):
        input_key, workflow_id, jobid, tool_name, step_order, user_id = file_ops.json_input_format(self.json_data)
        log_info(f"Test31: user_id = {user_id}",None)
        log_info("workflow_response : started the response generation for %s" % jobid, self.json_data)
        error_validator = ValidationResponse(DOWNLOAD_FOLDER=self.DOWNLOAD_FOLDER, json_data=self.json_data)
        try:
            error_validator.wf_keyerror(jobid, workflow_id, tool_name, step_order)  # Validating Workflow key-values
            error_validator.inputfile_list_empty(input_key)  # Validating Input key for files input and only text input
            output_file_response = list()
            # input key is a dictionary data for files input, "files" as a key
            if isinstance(input_key, dict) and 'files' in input_key.keys():
                for i, item in enumerate(input_key['files']):
                    input_filename, in_file_type, in_locale = file_ops.accessing_files(item)
                    #
                    log_info(f"Test31: in_file_type = {in_file_type}", None)
                    log_info(f"Test31: transform_flow = {transform_flow}", None)
                    if in_file_type == "docx" and transform_flow:
                        docx_transform_obj = DocxTransform(input_filename=input_filename, json_data=self.json_data)
                        #
                        log_info(f"Test31: docx_transform_object = {docx_transform_obj}",None)
                        docx_obj = docx_transform_obj.read_docx_file(input_filename)
                        # if in_locale != config.LOCALE_ENGLISH and config.DOCX_FONT_VALIDATION_ENABLED:
                        #     docx_transform_obj.check_if_valid_fonts_used(in_locale=in_locale)
                        
                        transformed_obj = docx_transform_obj.generate_json_structure(docx_obj)
                        #
                        # log_info(f"Test31: transformed_obj = {transformed_obj}",None)
                        out_json_filepath = docx_transform_obj.write_json_file(transformed_obj)
                        output_filename = out_json_filepath
                        out_file_type = 'json'

                        #read modified docx

                        html_convert_obj = HtmlConvert(input_filename=input_filename, file_type=config.TYPE_DOCX, json_data=self.json_data)
                        #
                        log_info(f"Test31: html_convert_obj = {html_convert_obj}",None)

                        out_files_url = html_convert_obj.generate_html(input_filename=input_filename)
                        #
                        log_info(f"Test31:out_files_url = {out_files_url}",None)
                        log_info(f"URL TO HTML FILE FOR JOBID {jobid}: {str(out_files_url)}", self.json_data)

                        fc_obj = FetchContent(record_id=input_filename, json_data=self.json_data)
                        fc_obj.store_reference_link(job_id=jobid, location=out_files_url)
                        #
                        log_info(f"Test31:fc_object = {fc_obj}",None)



                    elif in_file_type == "pptx" and transform_flow:
                        pptx_transform_obj = PptxTransform(input_filename=input_filename, json_data=self.json_data)
                        pptx_obj = pptx_transform_obj.read_pptx_file(input_filename)
                        transformed_obj = pptx_transform_obj.generate_json_structure(pptx_obj)

                        out_json_filepath = pptx_transform_obj.write_json_file(transformed_obj)
                        output_filename = out_json_filepath
                        out_file_type = 'json'

                        html_convert_obj = HtmlConvert(input_filename=input_filename, file_type=config.TYPE_PPTX, json_data=self.json_data)
                        out_files_url = html_convert_obj.generate_html(input_filename=input_filename)
                        fc_obj = FetchContent(record_id=input_filename, json_data=self.json_data)
                        fc_obj.store_reference_link(job_id=jobid, location=out_files_url)
                    
                    elif in_file_type == "html" and transform_flow:
                        html_transform_obj = HTMLTransform(input_filename=input_filename, json_data=self.json_data)
                        html_obj = html_transform_obj.read_html_file(input_filename)
                        html_transformed_obj = html_transform_obj.generate_json_structure(html_obj)

                        out_json_filepath = html_transform_obj.write_json_file(html_transformed_obj)
                        output_filename = out_json_filepath
                        out_file_type = 'json'

                        html_convert_obj = HtmlConvert(input_filename=input_filename, file_type=config.TYPE_HTML, json_data=self.json_data)
                        out_files_url = html_convert_obj.generate_html(input_filename=input_filename)
                        fc_obj = FetchContent(record_id=input_filename, json_data=self.json_data)
                        fc_obj.store_reference_link(job_id=jobid, location=out_files_url)


                    elif in_file_type == "json" and download_flow:
                        if config.DOCX_FILE_PREFIX in input_filename or config.DOCX1_FILE_PREFIX in input_filename:
                            name = config.DOCX1_FILE_PREFIX if config.DOCX1_FILE_PREFIX in input_filename else config.DOCX_FILE_PREFIX

                            json_file_name = input_filename.split(name)[-1]
                            DOCX_file_name = json_file_name.replace('.json', '.docx')

                            is_new_flow = True if config.DOCX1_FILE_PREFIX in input_filename else False

                            docx_transform_obj = DocxTransform(input_filename=DOCX_file_name, json_data=self.json_data, is_new_flow=is_new_flow)
                            docx_obj = docx_transform_obj.read_docx_file(DOCX_file_name)

                            fc_obj = FetchContent(record_id=input_filename, json_data=self.json_data)
                            fc_obj.generate_map_from_fetch_content_response()
                            #block_trans_map = dict()  #for local testing purposes only

                            translated_docx = docx_transform_obj.translate_docx_file(docx_obj, fc_obj.block_trans_map)
                            translated_docx_file_name = docx_transform_obj.write_docx_file(translated_docx)

                            output_filename = translated_docx_file_name
                            out_file_type = 'docx'

                        if config.PPTX_FILE_PREFIX in input_filename:
                            json_file_name = input_filename.split(config.PPTX_FILE_PREFIX)[-1]
                            PPTX_file_name = json_file_name.replace('.json', '.pptx')

                            pptx_transform_obj = PptxTransform(input_filename=PPTX_file_name, json_data=self.json_data)
                            pptx_obj = pptx_transform_obj.read_pptx_file(PPTX_file_name)

                            fc_obj = FetchContent(record_id=input_filename, json_data=self.json_data)
                            fc_obj.generate_map_from_fetch_content_response()

                            translated_pptx = pptx_transform_obj.translate_pptx_file(pptx_obj, fc_obj.block_trans_map)
                            translated_pptx_file_name = pptx_transform_obj.write_pptx_file(translated_pptx)

                            output_filename = translated_pptx_file_name
                            out_file_type = 'pptx'
                        if config.HTML_FILE_PREFIX in input_filename:
                            json_file_name = input_filename.split(config.HTML_FILE_PREFIX)[-1]
                            HTML_file_name = json_file_name.replace('.json', '.html')

                            html_transform_obj = HTMLTransform(input_filename=HTML_file_name,json_data=self.json_data)
                            html_obj = html_transform_obj.read_html_file(HTML_file_name)

                            fc_obj = FetchContent(record_id=input_filename,json_data=self.json_data)
                            fc_obj.generate_map_from_fetch_content_response()

                            translated_html = html_transform_obj.translate_html_file(html_obj,fc_obj.block_trans_map)
                            translated_html_file_name = html_transform_obj.write_html_file(translated_html)

                            output_filename = translated_html_file_name
                            out_file_type = 'html'
                    else:
                        raise WorkflowkeyError(400,
                                               "Wrong File Type: We are supporting only docx, pptx for transform flow and json files download flow.")

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
