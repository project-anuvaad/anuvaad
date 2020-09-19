#!/bin/python
import logging

from anuvaad_auditor.errorhandler import post_error

log = logging.getLogger('file')
from utilities.wfmutils import WFMUtils
from configs.wfmconfig import is_sync_flow_enabled
from configs.wfmconfig import is_async_flow_enabled
from configs.wfmconfig import tool_translator

wfmutils = WFMUtils()


class WFMValidator:
    def __init__(self):
        pass

    # Validator that validates the input request for initiating the wf job
    def validate(self, data):
        if data is None:
            return post_error("INPUT_NOT_FOUND", "Input is empty", None)
        if 'workflowCode' not in data.keys():
            return post_error("WOFKLOWCODE_NOT_FOUND", "workflowCode is mandatory", None)
        else:
            error = self.validate_config(data["workflowCode"], data)
            if error is not None:
                return error


    # Validates the workflowCode provided in the request.
    def validate_config(self, workflowCode, data):
        configs = wfmutils.get_configs()
        if workflowCode not in configs.keys():
            return post_error("WORKFLOW_NOT_FOUND", "There's no workflow configured against this workflowCode", None)
        else:
            wfType = configs[workflowCode]["type"]
            if wfType:
                if wfType == "SYNC":
                    if is_sync_flow_enabled:
                        error = self.validate_input_sync(data, workflowCode)
                        if error is not None:
                            return error
                    else:
                        return post_error("WORKFLOW_TYPE_DISABLED",
                                          "This workflow belongs to SYNC type, which is currently disabled.", None)
                elif wfType == "ASYNC":
                    if is_async_flow_enabled:
                        error = self.validate_input_async(data, workflowCode)
                        if error is not None:
                            return error
                    else:
                        return post_error("WORKFLOW_TYPE_DISABLED",
                                          "This workflow belongs to ASYNC type, which is currently disabled.", None)
                else:
                    return post_error("WORKFLOW_TYPE_INVALID", "This workflow is of an invalid type",
                                      None)
            else:
                return post_error("WORKFLOW_TYPE_NOT_FOUND", "Workflow Type not found.",
                                  None)


    # Validator that validates the input request for initiating an async job
    def validate_input_async(self, data, workflowCode):
        if 'files' not in data.keys():
            return post_error("FILES_NOT_FOUND", "files are mandatory", None)
        else:
            if len(data["files"]) == 0:
                return post_error("FILES_NOT_FOUND", "Input files are mandatory", None)
            else:
                tools = wfmutils.get_tools_of_wf(workflowCode)
                for file in data["files"]:
                    if 'path' not in file.keys():
                        return post_error("FILES_PATH_NOT_FOUND", "Path is mandatory for all files in the input", None)
                    if 'type' not in file.keys():
                        return post_error("FILES_TYPE_NOT_FOUND", "Type is mandatory for all files in the input", None)
                    if 'locale' not in file.keys():
                        return post_error("FILES_LOCALE_NOT_FOUND", "Locale is mandatory for all files in the input", None)
                    if tool_translator in tools:
                        if 'model' not in file.keys():
                            return post_error("MODEL_NOT_FOUND", "Model details are mandatory for this wf.", None)
                        else:
                            model = file["model"]
                            if 'model_id' not in model.keys():
                                return post_error("MODEL_ID_ NOT_FOUND", "Model ID is mandatory for this wf.", None)
                            if 'url_end_point' not in model.keys():
                                return post_error("MODEL_URL_ NOT_FOUND", "Model url end point is mandatory for this wf.", None)


    # Validator that validates the input request for initiating the sync job
    def validate_input_sync(self, data, workflowCode):
        if 'textBlocks' not in data.keys():
            return post_error("TEXT_BLOCKS_NOT_FOUND", "text blocks (word/sentence/paragraph) are mandatory", None)
        else:
            if not data["textBlocks"]:
                return post_error("TEXT_BLOCKS_NOT_FOUND", "Input files are mandatory.", None)
            else:
                tools = wfmutils.get_tools_of_wf(workflowCode)
                for text in data["textList"]:
                    if 'text' not in text.keys():
                        return post_error("TEXT_NOT_FOUND", "Text is mandatory for all text blocks in the input", None)
                    if 'locale' not in text.keys():
                        return post_error("TEXT_LOCALE_NOT_FOUND", "Text Locale is mandatory for all text blocks in the input", None)
                    if tool_translator in tools:
                        if 'model' not in text.keys():
                            return post_error("MODEL_NOT_FOUND", "Model details are mandatory for this wf.", None)
                        else:
                            model = text["model"]
                            if 'model_id' not in model.keys():
                                return post_error("MODEL_ID_ NOT_FOUND", "Model ID is mandatory for this wf.", None)
                        if 'node' not in text.keys():
                                return post_error("NODE_NOT_FOUND", "Node is mandatory", None)
                        else:
                            node = text["node"]
                            if 'recordID' not in node.keys():
                                return post_error("RECORD_ID_NOT_FOUND", "Record ID is mandatory", None)
                            if 'pageNo' not in node.keys():
                                return post_error("PAGE_NO_NOT_FOUND", "Page no is mandatory", None)
                            if 'blockID' not in node.keys():
                                return post_error("BLOCK_ID_NOT_FOUND", "Block ID is mandatory", None)
                            if 'sentenceID' not in node.keys():
                                return post_error("SENTENCE_ID_NOT_FOUND", "sentence ID is mandatory", None)