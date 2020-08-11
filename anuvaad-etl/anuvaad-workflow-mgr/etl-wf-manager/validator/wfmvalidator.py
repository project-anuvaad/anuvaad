#!/bin/python
import logging

from anuvaad_auditor.errorhandler import post_error

log = logging.getLogger('file')
from utilities.wfmutils import WFMUtils
from tools.aligner import Aligner
from tools.tokeniser import Tokeniser
from tools.pdftohtml import PDFTOHTML
from tools.htmltojson import HTMLTOJSON

wfmutils = WFMUtils()
aligner = Aligner()
tokeniser = Tokeniser()
pdftohtml = PDFTOHTML()
htmltojson = HTMLTOJSON()

class WFMValidator:
    def __init__(self):
        pass

    # Validator that validates the input request for initiating the alignment job
    def validate_input(self, data):
        if 'workflowCode' not in data.keys():
            return post_error("WOFKLOWCODE_NOT_FOUND", "workflowCode is mandatory", None)
        if 'files' not in data.keys():
            return post_error("FILES_NOT_FOUND", "files are mandatory", None)
        else:
            if len(data["files"]) == 0:
                return post_error("FILES_NOT_FOUND", "Input files are mandatory", None)
        error = self.validate_config(data["workflowCode"])
        if error is not None:
            return error
        error = self.validate_files(data)
        if error is not None:
            return error

    # Validates the workflowCode provided in the request.
    def validate_config(self, workflowCode):
        configs = wfmutils.get_configs()
        if workflowCode not in configs.keys():
            return post_error("WORKFLOW_NOT_FOUND", "There's no workflow configured against this workflowCode", None)

    # Validates tool specific requirements of the input.
    def validate_files(self, wf_input):
        tools = wfmutils.get_tools_of_wf(wf_input["workflowCode"])
        if "TOKENISER" in tools:
            valid = tokeniser.validate_tokeniser_input(wf_input)
            if not valid:
                return post_error("TOKENISER_INPUT_ERROR", "Tokeniser is a part of this workflow. The given input is "
                                                           "insufficient for that step.", None)
        if "ALIGNER" in tools:
            valid = aligner.validate_aligner_input(wf_input)
            if not valid:
                return post_error("ALIGNER_INPUT_ERROR", "Aligner is a part of this workflow. The given input is "
                                                         "insufficient for that step.", None)
        if "PDFTOHTML" in tools:
            valid = pdftohtml.validate_pdftohtml_input(wf_input)
            if not valid:
                return post_error("PDFTOHTML_INPUT_ERROR", "PDFTOHTML is a part of this workflow. The given input is "
                                                           "insufficient for that step.", None)
        if "HTMLTOJSON" in tools:
            valid = htmltojson.validate_htmltojson_input(wf_input)
            if not valid:
                return post_error("HTMLTOJSON_INPUT_ERROR", "HTMLTOJSON is a part of this workflow. The given input "
                                                            "is insufficient for that step.", None)


