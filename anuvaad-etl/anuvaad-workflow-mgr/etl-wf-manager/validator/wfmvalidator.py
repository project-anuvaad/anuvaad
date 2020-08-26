#!/bin/python
import logging

from anuvaad_auditor.errorhandler import post_error
from anuvaad_auditor.errorhandler import post_error_wf
from anuvaad_auditor.loghandler import log_error
from configs.wfmconfig import tool_blockmerger
from configs.wfmconfig import tool_tokeniser
from configs.wfmconfig import tool_pdftohtml
from configs.wfmconfig import tool_htmltojson
from configs.wfmconfig import tool_fileconverter
from configs.wfmconfig import tool_aligner

log = logging.getLogger('file')
from utilities.wfmutils import WFMUtils
from tools.aligner import Aligner
from tools.tokeniser import Tokeniser
from tools.pdftohtml import PDFTOHTML
from tools.file_converter import FileConverter
from tools.block_merger import BlockMerger
from tools.htmltojson import HTMLTOJSON


wfmutils = WFMUtils()
aligner = Aligner()
tokeniser = Tokeniser()
pdftohtml = PDFTOHTML()
htmltojson = HTMLTOJSON()
file_converter = FileConverter()
block_merger = BlockMerger()

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
            else:
                for file in data["files"]:
                    if not file["path"]:
                        return post_error("FILES_PATH_NOT_FOUND", "Path is mandatory for all files in the input", None)
                    if not file["type"]:
                        return post_error("FILES_TYPE_NOT_FOUND", "Type is mandatory for all files in the input", None)
                    if not file["locale"]:
                        return post_error("FILES_LOCALE_NOT_FOUND", "Locale is mandatory for all files in the input", None)
        error = self.validate_config(data["workflowCode"])
        if error is not None:
            return error

    # Validates the workflowCode provided in the request.
    def validate_config(self, workflowCode):
        configs = wfmutils.get_configs()
        if workflowCode not in configs.keys():
            return post_error("WORKFLOW_NOT_FOUND", "There's no workflow configured against this workflowCode", None)

    # Validates tool specific requirements of the input.
    def validate_tool_input(self, tool_input, tool, predecessor_output):
        if tool_tokeniser == tool:
            valid = tokeniser.validate_tokeniser_input(tool_input)
            if not valid:
                log_error("Failed to generate required input for: " + str(tool_tokeniser), predecessor_output, None)
                return post_error_wf("TOKENISER_INPUT_ERROR",
                                     "Failed to generate required input for: " + str(tool_tokeniser), predecessor_output, None)
        if tool_aligner == tool:
            valid = aligner.validate_aligner_input(tool_input)
            if not valid:
                log_error("Failed to generate required input for: " + str(tool_aligner), predecessor_output, None)
                return post_error_wf("ALIGNER_INPUT_ERROR",
                                     "Failed to generate required input for: " + str(tool_aligner), predecessor_output, None)
        if tool_pdftohtml == tool:
            valid = pdftohtml.validate_pdftohtml_input(tool_input)
            if not valid:
                log_error("Failed to generate required input for: " + str(tool_pdftohtml), predecessor_output, None)
                return post_error_wf("PDFTOHTML_INPUT_ERROR",
                                     "Failed to generate required input for: " + str(tool_pdftohtml), predecessor_output, None)
        if tool_htmltojson == tool:
            valid = htmltojson.validate_htmltojson_input(tool_input)
            if not valid:
                log_error("Failed to generate required input for: " + str(tool_htmltojson), predecessor_output, None)
                return post_error_wf("HTMLTOJSON_INPUT_ERROR",
                                     "Failed to generate required input for: " + str(tool_htmltojson), predecessor_output, None)

        if tool_fileconverter == tool:
            valid = file_converter.validate_fc_input(tool_input)
            if not valid:
                log_error("Failed to generate required input for: " + str(tool_fileconverter), predecessor_output, None)
                return post_error_wf("FILE_CONVERTER_INPUT_ERROR",
                                     "Failed to generate required input for: " + str(tool_fileconverter), predecessor_output, None)

        if tool_blockmerger == tool:
            valid = block_merger.validate_bm_input(tool_input)
            if not valid:
                log_error("Failed to generate required input for: " + str(tool_blockmerger), predecessor_output, None)
                return post_error_wf("BLOCK_MERGER_INPUT_ERROR",
                                     "Failed to generate required input for: " + str(tool_blockmerger), predecessor_output, None)
