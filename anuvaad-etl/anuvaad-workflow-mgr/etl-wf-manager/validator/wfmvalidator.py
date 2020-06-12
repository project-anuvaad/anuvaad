#!/bin/python
import ast
import codecs
import json
import logging
import os

import datetime as dt
from flask import jsonify

log = logging.getLogger('file')
from utilities.wfmutils import WFMUtils
from tools.aligner import Aligner
from tools.ingestor import Ingestor
from tools.extractor import Extractor
from tools.tokeniser import Tokeniser
from tools.transformer import Transformer

wfmutils = WFMUtils()
aligner = Aligner()
ingestor = Ingestor()
extractor = Extractor()
tokeniser = Tokeniser()
transformer = Transformer()

class WFMValidator:
    def __init__(self):
        pass

    # Validator that validates the input request for initiating the alignment job
    def validate_input(self, data):
        log.info("Workflow initiation request received.")
        if 'workflowCode' not in data.keys():
            return self.get_error("WOFKLOWCODE_NOT_FOUND", "workflowCode is mandatory")
        if 'files' not in data.keys():
            return self.get_error("FILES_NOT_FOUND", "files are mandatory")
        else:
            if len(data["files"]) == 0:
                return self.get_error("FILES_NOT_FOUND", "Input files are mandatory")
        error = self.validate_config(data["workflowCode"])
        if error is not None:
            return error
        error = self.validate_files(data)
        if error is not None:
            return error
        log.info("Validation Complete.")

    # Validates the workflowCode provided in the request.
    def validate_config(self, workflowCode):
        configs = wfmutils.get_configs()
        if workflowCode not in configs.keys():
            return self.get_error("WORKFLOW_NOT_FOUND", "There's no workflow configured against this workflowCode")

    # Validates tool specific requirements of the input.
    def validate_files(self, wf_input):
        tools = wfmutils.get_tools_of_wf(wf_input["workflowCode"])
        if "TOKENISER" in tools:
            valid = tokeniser.validate_tok_input(wf_input)
            if not valid:
                return self.get_error("TOKENISER_INPUT_ERROR", "Tokeniser is a part of this workflow. The given input is insufficient for that step.")
        if "ALIGNER" in tools:
            valid = aligner.validate_tok_input(wf_input)
            if not valid:
                return self.get_error("ALIGNER_INPUT_ERROR", "Aligner is a part of this workflow. The given input is insufficient for that step.")
        if "INGESTOR" in tools:
            valid = aligner.validate_tok_input(wf_input)
            if not valid:
                return self.get_error("INGESTOR_INPUT_ERROR", "Ingestor is a part of this workflow. The given input is insufficient for that step.")
        if "EXTRACTOR" in tools:
            valid = aligner.validate_tok_input(wf_input)
            if not valid:
                return self.get_error("EXTRACTOR_INPUT_ERROR", "Extractor is a part of this workflow. The given input is insufficient for that step.")
        if "TRANSFORMER" in tools:
            valid = aligner.validate_tok_input(wf_input)
            if not valid:
                return self.get_error("TRANSFORMER_INPUT_ERROR", "Transformer is a part of this workflow. The given input is insufficient for that step.")

    # Error formatter
    def get_error(self, code, message):
        return jsonify({"status": "INPUT_ERROR", "code": code, "message": message})


