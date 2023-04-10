#!/bin/python
from configs.wfmconfig import tool_ocrgooglevision, tool_ocrtesseract, tool_blocksegmenter, tool_ocrdd10googlevision, tool_ocrdd15googlevision, tool_ocrdd20tesseract
from configs.wfmconfig import is_sync_flow_enabled, is_async_flow_enabled, tool_translator, tool_worddetector, tool_layoutdetector, tool_annotator
from configs.wfmconfig import granularity_list
from utilities.wfmutils import WFMUtils
import logging

from anuvaad_auditor.errorhandler import post_error

log = logging.getLogger('file')


wfmutils = WFMUtils()


class WFMValidator:
    def __init__(self):
        pass

    # Common Validations for both ASYNC and SYNC flow.
    def common_validate(self, data):
        if data is None:
            return post_error("INPUT_NOT_FOUND", "Input is empty", None)
        if 'workflowCode' not in data.keys():
            return post_error("WOFKLOWCODE_NOT_FOUND", "workflowCode is mandatory", None)
        else:
            configs = wfmutils.get_configs()
            if data["workflowCode"] not in configs["workflowCodes"].keys():
                return post_error("WORKFLOW_NOT_FOUND", "There's no workflow configured against this workflowCode", None)

    # Input Validations for SYNC flow
    def validate_sync(self, data, workflowCode):
        if is_sync_flow_enabled:
            configs = wfmutils.get_configs()
            config = configs["workflowCodes"][workflowCode]
            if config["type"] != "SYNC":
                return post_error("UNSUPPORTED_WF_CODE", "This workflow is NOT of the SYNC type.", None)
            if config["translation"] not in ["BLOCK", "SENTENCE", "DOWNLOAD","PREPROCESS"]:
                return post_error("UNSUPPORTED_SYNC_WF", "This workflow is NOT of the VALID SYNC type.", None)
            if config["translation"] == "BLOCK":
                return self.validate_sync_block(data, workflowCode)
            elif config["translation"] == "SENTENCE":
                return self.validate_sync_sentence(data)
            elif config["translation"] == "PREPROCESS":
                return self.validate_sync_preprocess(data,workflowCode)
        else:
            return post_error("WORKFLOW_TYPE_DISABLED",
                              "This workflow belongs to SYNC type, which is currently disabled.", None)

    def validate_sync_preprocess(self,data,workflowCode):
        #TODO ADDITION OF PREPROCESS VALIDATION
        return None

    def validate_sync_block(self, data, workflowCode):
        if 'recordID' not in data.keys():
            return post_error("RECORD_ID_NOT_FOUND", "Record id is mandatory.", None)
        if 'locale' not in data.keys():
            return post_error("LOCALE_NOT_FOUND", "Locale is mandatory.", None)
        if 'textBlocks' not in data.keys():
            return post_error("TEXT_BLOCKS_NOT_FOUND", "text blocks are mandatory.", None)
        else:
            if not data["textBlocks"]:
                return post_error("TEXT_BLOCKS_NOT_FOUND", "text blocks are mandatory.", None)
            tools = wfmutils.get_tools_of_wf(workflowCode)
            if tool_translator in tools:
                if 'model' not in data.keys():
                    return post_error("MODEL_NOT_FOUND", "Model details are mandatory for this wf.", None)
                else:
                    model = dict(data["model"])
                    if 'model_id' not in model.keys():
                        return post_error("MODEL_ID_NOT_FOUND", "Model Id is mandatory.", None)
                    if 'source_language_code' not in model.keys():
                        return post_error("SRC_LANG_NOT_FOUND", "Source language code is mandatory.", None)
                    if 'target_language_code' not in model.keys():
                        return post_error("TGT_LANG_NOT_FOUND", "Target language code is mandatory.", None)
                if len(tools) == 1:
                    if 'modifiedSentences' not in data.keys():
                        return post_error("MODIFIED_SENT_NOT_FOUND", "Ids of modified sentences is mandatory", None)
                    else:
                        if not data["modifiedSentences"]:
                            return post_error("MODIFIED_SENT_NOT_FOUND", "Ids of modified sentences is mandatory",
                                              None)
        return None

    def validate_sync_sentence(self, data):
        if 'model_id' not in data.keys():
            return post_error("MODEL_ID_NOT_FOUND", "Model ID is mandatory.", None)
        if 'sentences' not in data.keys() and 'paragraphs' not in data.keys():
            return post_error("TEXT_NOT_FOUND", "Sentences are mandatory.", None)
        else:
            key = ''
            if 'sentences' in data.keys():
                key = 'sentences'
            elif 'paragraphs' in data.keys():
                key = 'paragraphs'

            if not data[key]:
                return post_error("TEXT_NOT_FOUND", "Sentences are mandatory.", None)
            for sentence in data[key]:
                if 's_id' not in sentence.keys():
                    return post_error("SENTENCE_ID_NOT_FOUND", "s_id is mandatory", None)
                if 'src' not in sentence.keys():
                    return post_error("TEXT_NOT_FOUND", "src is mandatory", None)
        return None

    # Input Validations for ASYNC flow
    def validate_async(self, data, workflowCode):
        if is_async_flow_enabled:
            configs = wfmutils.get_configs()
            if configs["workflowCodes"][workflowCode]["type"] != "ASYNC":
                return post_error("UNSUPPORTED_WF_CODE", "This workflow is NOT of the ASYNC type.", None)
            if 'files' not in data.keys():
                return post_error("FILES_NOT_FOUND", "files are mandatory", None)
            else:
                if len(data["files"]) == 0:
                    return post_error("FILES_NOT_FOUND", "Input files are mandatory", None)
                else:
                    tools = wfmutils.get_tools_of_wf(workflowCode)
                    if tool_annotator in tools:
                        self.validate_for_annotator(data)
                        return
                    for file in data["files"]:
                        if 'path' not in file.keys():
                            return post_error("FILES_PATH_NOT_FOUND", "Path is mandatory for all files in the input",
                                              None)
                        if 'type' not in file.keys():
                            return post_error("FILES_TYPE_NOT_FOUND", "Type is mandatory for all files in the input",
                                              None)
                        if 'locale' not in file.keys():
                            return post_error("FILES_LOCALE_NOT_FOUND",
                                              "Locale is mandatory for all files in the input", None)
                        if tool_translator in tools:
                            if 'model' not in file.keys():
                                return post_error("MODEL_NOT_FOUND", "Model details are mandatory for this wf.", None)
                            else:
                                model = file["model"]
                                if 'model_id' not in model.keys():
                                    return post_error("MODEL_ID_NOT_FOUND", "Model Id is mandatory.", None)
                                if 'source_language_code' not in model.keys():
                                    return post_error("SRC_LANG_NOT_FOUND", "Source language code is mandatory.", None)
                                if 'target_language_code' not in model.keys():
                                    return post_error("TGT_LANG_NOT_FOUND", "Target language code is mandatory.", None)
                        if tool_worddetector in tools or tool_layoutdetector in tools or tool_ocrgooglevision in tools \
                                or tool_ocrtesseract in tools or tool_blocksegmenter in tools or tool_ocrdd10googlevision in tools\
                                or tool_ocrdd15googlevision in tools or tool_ocrdd20tesseract in tools:
                            if 'config' not in file.keys():
                                return post_error("CONFIG_NOT_FOUND", "OCR Config details are mandatory for this wf.", None)
                            else:
                                config = file["config"]
                                if 'OCR' not in config.keys():
                                    return post_error("CONFIG_NOT_FOUND", "OCR Config details are mandatory for this wf.", None)
        else:
            return post_error("WORKFLOW_TYPE_DISABLED",
                              "This workflow belongs to ASYNC type, which is currently disabled.", None)

    def validate_for_annotator(self, data):
        for file in data["files"]:
            if 'annotationType' not in file.keys():
                return post_error("ANNOTATION_TYPE_NOT_FOUND", "annotationType is mandatory for all files for this wf", None)
            if 'sourceLanguage' not in file.keys():
                return post_error("SRC_LANG_NOT_FOUND", "sourceLanguage is mandatory for all files for this wf", None)
            if 'targetLanguage' not in file.keys():
                return post_error("TGT_LANG_NOT_FOUND", "targetLanguage is mandatory for all files for this wf", None)
            if 'fileInfo' not in file.keys():
                return post_error("FILES_INFO_NOT_FOUND", "fileInfo is mandatory for all files for this wf", None)
            if 'users' not in file.keys():
                return post_error("USERS_NOT_FOUND", "users is mandatory for all files for this wf", None)
            if 'description' not in file.keys():
                return post_error("DESC_NOT_FOUND", "description is mandatory for all files for this wf", None)

    def validate_granularity(self, data):
            if 'granularity' not in data.keys():
                return post_error("GRANULARITY_NOT_FOUND", "granularity is mandatory key", None)
            if isinstance(data['granularity'],list) and len(data['granularity'])>0:
                    for each_granularity in data['granularity']:
                        if each_granularity not in granularity_list:
                            return post_error("TIMESTAMP_NOT_FOUND", "Key within granularity is not valid", None)
            else:
                return post_error("GRANULARITY_NOT_FOUND", "granularity values are missing", None)
            if 'jobID' not in data.keys():
                return post_error("JOBID_NOT_FOUND", "jobID not found", None)