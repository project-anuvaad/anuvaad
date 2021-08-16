import json
import logging
import os
import random
import string
import time

import requests
import yaml
from configs.wfmconfig import config_file_url, tool_blockmerger, tool_tokeniser, tool_fileconverter, tool_aligner, tool_translator
from configs.wfmconfig import tool_worddetector, tool_layoutdetector, tool_ch, tool_nmt, tool_ocrgooglevision, tool_ocrtesseract, tool_annotator
from configs.wfmconfig import tool_blocksegmenter, tool_ocrdd10googlevision, tool_ocrdd15googlevision, \
    jobid_random_str_length, tool_ocrtokeniser, tool_filetranslator, tool_imageocr, tool_ocrdd20tesseract
from repository.wfmrepository import WFMRepository
from anuvaad_auditor.loghandler import log_exception, log_error, log_info

from tools.aligner import Aligner
from tools.tokeniser import Tokeniser
from tools.file_converter import FileConverter
from tools.block_merger import BlockMerger
from tools.translator import Translator
from tools.contenthandler import ContentHandler
from tools.nmt import NMT
from tools.word_detector import WordDetector
from tools.layout_detector import LayoutDetector
from tools.ocr_gv import OCRGV
from tools.ocr_dd10_gv import OCRDD10GV
from tools.ocr_dd15_gv import OCRDD15GV
from tools.ocr_tesseract import OCRTESS
from tools.block_segmenter import BlockSegmenter
from tools.ocr_tokeniser import OCRTokeniser
from tools.annotator import Annotator
from tools.file_translator import FileTranslator
from tools.image_ocr import ImageOCR
from tools.ocr_dd20 import OCRDD20


aligner = Aligner()
tokeniser = Tokeniser()
file_converter = FileConverter()
block_merger = BlockMerger()
translator = Translator()
ch = ContentHandler()
nmt = NMT()
word_detector = WordDetector()
layout_detector = LayoutDetector()
ocrgv = OCRGV()
ocrdd10gv = OCRDD10GV()
ocrdd15gv = OCRDD15GV()
ocrtess = OCRTESS()
ocrdd20tess = OCRDD20()
block_segmenter = BlockSegmenter()
ocr_tokeniser = OCRTokeniser()
annotator = Annotator()
file_translator = FileTranslator()
image_ocr = ImageOCR()
wfmrepo = WFMRepository()

log = logging.getLogger('file')
configs_global = {}

yaml_file_loc = "/app/configs"
yam_file_path_delimiter = "/"
yaml_file_name = "wfconfig.yml"


class WFMUtils:
    def __init__(self):
        pass

    # Reads config yaml file located at a remote location.
    # Converts the configs into dict, makes it available for the entire app.
    def read_all_configs(self):
        try:
            file = requests.get(config_file_url, allow_redirects=True)
            file_path = yaml_file_loc + yam_file_path_delimiter + yaml_file_name
            open(file_path, 'wb').write(file.content)
            with open(file_path, 'r') as stream:
                parsed = yaml.safe_load(stream)
                configs = parsed['WorkflowConfigs']
                for obj in configs:
                    key = obj['workflowCode']
                    configs_global[key] = obj
        except Exception as exc:
            log_exception("Exception while reading configs: " +
                          str(exc), None, exc)

    # Method that returns configs
    def get_configs(self):
        return configs_global

    # Method to pick all the output topics from the config
    # This includes all the workflows defined in that file.
    # The WFM consumer will listen to these topics only.
    def fetch_output_topics(self, all_configs):
        topics = []
        for key in all_configs:
            config = all_configs[key]
            sequence = config["sequence"]
            for step in sequence:
                tool_details = step["tool"][0]
                if 'kafka-output' in tool_details.keys():
                    output_topic = os.environ.get(
                        tool_details["kafka-output"][0]["topic"], "NA")
                    if output_topic != "NA" and output_topic not in topics:
                        topics.append(output_topic)
        return topics

    # Helper method to fetch tools involved in a given workflow.
    def get_tools_of_wf(self, workflowCode):
        configs = self.get_configs()
        config = configs[workflowCode]
        sequence = config["sequence"]
        tools = []
        for step in sequence:
            tool = step["tool"][0]["name"]
            if tool not in tools:
                tools.append(tool)
        return tools

    # Generates unique job id.
    # Format: <use_case>-<6_char_random>-<13_digit_epoch>
    def generate_job_id(self, workflowCode):
        config = self.get_configs()
        config_to_be_used = config[workflowCode]
        use_case = config_to_be_used["useCase"]
        rand_str = ''.join(random.choice(string.ascii_letters)
                           for i in range(eval(str(jobid_random_str_length))))
        return use_case + "-" + str(rand_str) + "-" + str(time.time()).replace('.', '')[0:13]

    # Fetches the order of execution for a given workflow.
    def get_order_of_exc(self, workflowCode):
        order_of_exc_dict = {}
        config = self.get_configs()
        config_to_be_used = config[workflowCode]
        sequence = config_to_be_used["sequence"]
        for step in sequence:
            order_of_exc_dict[step["order"]] = step
        return order_of_exc_dict

    # Returns the input required for the current tool to execute.
    # current_tool = The tool of which the input is to be computed.
    # previous tool = Previous tool which got executed and produced 'task_output'.
    # wf_input = Input received during initiation of wf.
    def get_tool_input_async(self, current_tool, previous_tool, task_output, wf_input):
        tool_input = None
        ocr_tools = [tool_worddetector, tool_layoutdetector, tool_ocrgooglevision,
                     tool_ocrdd10googlevision, tool_ocrdd15googlevision, tool_ocrdd20tesseract, tool_ocrtesseract, tool_blocksegmenter]
        if wf_input is None:
            if current_tool == tool_aligner:
                tool_input = aligner.get_aligner_input(
                    task_output, previous_tool)
            if current_tool == tool_tokeniser:
                tool_input = tokeniser.get_tokeniser_input(
                    task_output, previous_tool)
            if current_tool == tool_fileconverter:
                tool_input = file_converter.get_fc_input(
                    task_output, previous_tool)
            if current_tool == tool_blockmerger:
                tool_input = block_merger.get_bm_input(
                    task_output, previous_tool)
            if current_tool == tool_translator:
                tool_input = translator.get_translator_input(
                    task_output, previous_tool, False)
                job_details, files = self.get_job_details(
                    task_output["jobID"])[0], []
                for file in tool_input["input"]["files"]:
                    file["model"] = job_details["input"]["files"][0]["model"]
                    if 'context' in job_details["input"]["files"][0].keys():
                        file["context"] = job_details["input"]["files"][0]["context"]
                    files.append(file)
                tool_input["input"]["files"] = files
            if current_tool == tool_worddetector:
                tool_input = word_detector.get_wd_input(
                    task_output, previous_tool)
            if current_tool == tool_layoutdetector:
                tool_input = layout_detector.get_ld_input(
                    task_output, previous_tool)
            if current_tool == tool_blocksegmenter:
                tool_input = block_segmenter.get_bs_input(
                    task_output, previous_tool)
            if current_tool == tool_ocrtesseract:
                tool_input = ocrtess.get_octs_input(task_output, previous_tool)
            if current_tool == tool_ocrgooglevision:
                tool_input = ocrgv.get_ogv_input(task_output, previous_tool)
            if current_tool == tool_ocrdd10googlevision:
                tool_input = ocrdd10gv.get_odd10gv_input(
                    task_output, previous_tool)
            if current_tool == tool_ocrdd15googlevision:
                tool_input = ocrdd15gv.get_odd15gv_input(
                    task_output, previous_tool)
            if current_tool == tool_ocrdd20tesseract:
                tool_input = ocrdd20tess.get_odd20_input(
                    task_output, previous_tool)
            if current_tool == tool_ocrtokeniser:
                tool_input = ocr_tokeniser.get_ocr_tokeniser_input(
                    task_output, previous_tool)
            if current_tool == tool_filetranslator:
                tool_input = file_translator.get_ft_input(task_output)
            if current_tool == tool_imageocr:
                tool_input = image_ocr.get_image_ocr_input(task_output)
            if current_tool in ocr_tools:
                job_details = self.get_job_details(task_output["jobID"])[0]
                for file in tool_input["input"]["inputs"]:
                    file["config"] = job_details["input"]["files"][0]["config"]
        else:
            if current_tool == tool_aligner:
                tool_input = aligner.get_aligner_input_wf(wf_input)
            if current_tool == tool_tokeniser:
                tool_input = tokeniser.get_tokeniser_input_wf(wf_input, False)
            if current_tool == tool_fileconverter:
                tool_input = file_converter.get_fc_input_wf(wf_input)
            if current_tool == tool_blockmerger:
                tool_input = block_merger.get_bm_input_wf(wf_input)
            if current_tool == tool_translator:
                tool_input = translator.get_translator_input_wf(
                    wf_input, False)
            if current_tool == tool_worddetector:
                tool_input = word_detector.get_wd_input_wf(wf_input)
            if current_tool == tool_layoutdetector:
                tool_input = layout_detector.get_ld_input_wf(wf_input)
            if current_tool == tool_ocrgooglevision:
                tool_input = ocrgv.get_ogv_input_wf(wf_input)
            if current_tool == tool_ocrdd10googlevision:
                tool_input = ocrdd10gv.get_odd10gv_input_wf(wf_input)
            if current_tool == tool_ocrdd15googlevision:
                tool_input = ocrdd15gv.get_odd15gv_input_wf(wf_input)
            if current_tool == tool_ocrdd20tesseract:
                tool_input = ocrdd20tess.get_odd20_input_wf(wf_input)
            if current_tool == tool_ocrtesseract:
                tool_input = ocrtess.get_octs_input_wf(wf_input)
            if current_tool == tool_blocksegmenter:
                tool_input = block_segmenter.get_bs_input_wf(wf_input)
            if current_tool == tool_ocrtokeniser:
                tool_input = ocr_tokeniser.get_ocr_tokeniser_input_wf(
                    wf_input, False)
            if current_tool == tool_annotator:
                tool_input = annotator.get_annotator_input_wf(wf_input)
            if current_tool == tool_filetranslator:
                tool_input = file_translator.get_ft_input_wf(wf_input)
            if current_tool == tool_imageocr:
                tool_input = image_ocr.get_image_ocr_input_wf(wf_input)
        return tool_input

    # Returns the input required for the current tool to execute for the sync process.
    # current_tool = The tool of which the input is to be computed.
    # previous tool = Previous tool which got executed and produced 'task_output'.
    # wf_input = Input received during initiation of wf.

    def get_tool_input_sync(self, current_tool, previous_tool, task_output, wf_input):
        tool_input = {}
        if wf_input is None:
            if current_tool == tool_tokeniser:
                tool_input = tokeniser.get_tokeniser_input(
                    task_output, previous_tool)
            if current_tool == tool_translator:
                tool_input = translator.get_translator_input(
                    task_output, previous_tool, True)
                job_details = self.get_job_details(task_output["jobID"])[0]

                if translator.is_contains_list_of_paragraphs(task_output=task_output) is False:
                    tool_input["input"]["model"] = job_details["input"]["model"]

                if 'modifiedSentences' in job_details["input"].keys():
                    tool_input["input"]["modifiedSentences"] = job_details["input"]["modifiedSentences"]
                if 'context' in job_details["input"].keys():
                    tool_input["input"]["context"] = job_details["input"]["context"]
                if 'retranslate' in job_details["input"].keys():
                    tool_input["input"]["retranslate"] = job_details["input"]["retranslate"]
        else:
            if current_tool == tool_tokeniser:
                tool_input = tokeniser.get_tokeniser_input_wf(wf_input, True)
            if current_tool == tool_translator:
                tool_input = translator.get_translator_input_wf(wf_input, True)
            if current_tool == tool_ch:
                tool_input = ch.get_ch_update_req(wf_input)
            if current_tool == tool_nmt:
                tool_input = nmt.get_nmt_it_req(wf_input)
            if current_tool == tool_filetranslator:
                tool_input = file_translator.get_ft_input_wf(wf_input)
        return tool_input

    # Util method to make an API call and fetch the result
    def call_api(self, uri, api_input, user_id):
        try:
            log_info("URI: " + uri, None)
            api_headers = {'userid': user_id, 'x-user-id': user_id,
                           'Content-Type': 'application/json'}
            response = requests.post(
                url=uri, json=api_input, headers=api_headers)
            if response is not None:
                if response.text is not None:
                    log_info(response.text, None)
                    data = json.loads(response.text)
                    return data
                else:
                    log_error("API response was None !", api_input, None)
                    return None
            else:
                log_error("API call failed!", api_input, None)
                return None
        except Exception as e:
            log_exception(
                "Exception while making the api call: " + str(e), api_input, e)
            return None

    # Method to search jobs on job id for internal logic.
    def get_job_details(self, job_id):
        query = {"jobID": job_id}
        exclude = {'_id': False}
        return wfmrepo.search_job(query, exclude, None, None)
