#!/bin/python
import logging

from anuvaad_auditor.errorhandler import post_error

log = logging.getLogger('file')
from utilities.wfmutils import WFMUtils

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
            error = self.validate_config(data["workflowCode"])
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
                    error = self.validate_input_sync(data)
                    if error is not None:
                        return error
                elif wfType == "ASYNC":
                    error = self.validate_input_async(data)
                    if error is not None:
                        return error
                else:
                    return post_error("WORKFLOW_TYPE_INVALID", "This workflow is of an invalid type",
                                      None)
            else:
                return post_error("WORKFLOW_TYPE_NOT_FOUND", "Workflow Type not found.",
                                  None)


    # Validator that validates the input request for initiating an async job
    def validate_input_async(self, data):
        if 'files' not in data.keys():
            return post_error("FILES_NOT_FOUND", "files are mandatory", None)
        else:
            if len(data["files"]) == 0:
                return post_error("FILES_NOT_FOUND", "Input files are mandatory", None)
            else:
                for file in data["files"]:
                    if not file["path"]:
                        return post_error("FILES_PATH_NOT_FOUND", "Path is mandatory for all files in the input", None)
                    if not file["type"]:
                        return post_error("FILES_TYPE_NOT_FOUND", "Type is mandatory for all files in the input", None)
                    if not file["locale"]:
                        return post_error("FILES_LOCALE_NOT_FOUND", "Locale is mandatory for all files in the input",
                                          None)


    # Validator that validates the input request for initiating the sync job
    def validate_input_sync(self, data):
        if 'files' not in data.keys():
            return post_error("FILES_NOT_FOUND", "files are mandatory", None)
        else:
            if len(data["files"]) == 0:
                return post_error("FILES_NOT_FOUND", "Input files are mandatory", None)
            else:
                for file in data["files"]:
                    if not file["path"]:
                        return post_error("FILES_PATH_NOT_FOUND", "Path is mandatory for all files in the input", None)
                    if not file["type"]:
                        return post_error("FILES_TYPE_NOT_FOUND", "Type is mandatory for all files in the input", None)
                    if not file["locale"]:
                        return post_error("FILES_LOCALE_NOT_FOUND", "Locale is mandatory for all files in the input",
                                          None)

