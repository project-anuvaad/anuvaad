import json
import logging
import os
import time
import traceback

import requests
import yaml
from configs.wfmconfig import config_file_url
from configs.wfmconfig import tool_blockmerger
from configs.wfmconfig import tool_tokeniser
from configs.wfmconfig import tool_pdftohtml
from configs.wfmconfig import tool_htmltojson
from configs.wfmconfig import tool_fileconverter
from configs.wfmconfig import tool_aligner
from configs.wfmconfig import tool_translator
from configs.wfmconfig import tool_ch
from repository.wfmrepository import WFMRepository
from anuvaad_auditor.errorhandler import post_error
from anuvaad_auditor.loghandler import log_exception, log_error

from tools.aligner import Aligner
from tools.tokeniser import Tokeniser
from tools.pdftohtml import PDFTOHTML
from tools.htmltojson import HTMLTOJSON
from tools.file_converter import FileConverter
from tools.block_merger import BlockMerger
from tools.translator import Translator
from tools.contenthandler import ContentHandler


aligner = Aligner()
tokeniser = Tokeniser()
pdftohtml = PDFTOHTML()
htmltojson = HTMLTOJSON()
file_converter = FileConverter()
block_merger = BlockMerger()
translator = Translator()
ch = ContentHandler()
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
            log_exception("Exception while reading configs: " + str(exc), None, exc)
            post_error("CONFIG_READ_ERROR", "Exception while reading configs: " + str(exc), None)


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
                    output_topic = tool_details["kafka-output"][0]["topic"]
                    if output_topic not in topics:
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
    # Format: <use_case>-<13_digit_epoch>
    def generate_job_id(self, workflowCode):
        config = self.get_configs()
        config_to_be_used = config[workflowCode]
        usecase = config_to_be_used["useCase"]
        return usecase + "-" + str(time.time()).replace('.', '')

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
    def get_tool_input(self, current_tool, previous_tool, task_output, wf_input):
        tool_input = {}
        if wf_input is None:
            if current_tool == tool_aligner:
                tool_input = aligner.get_aligner_input(task_output, previous_tool)
            if current_tool == tool_tokeniser:
                tool_input = tokeniser.get_tokeniser_input(task_output, previous_tool)
            if current_tool == tool_pdftohtml:
                tool_input = pdftohtml.get_pdftohtml_input(task_output, previous_tool)
            if current_tool == tool_htmltojson:
                tool_input = htmltojson.get_htmltojson_input(task_output, previous_tool)
            if current_tool == tool_fileconverter:
                tool_input = file_converter.get_fc_input(task_output, previous_tool)
            if current_tool == tool_blockmerger:
                tool_input = block_merger.get_bm_input(task_output, previous_tool)
            if current_tool == tool_translator:
                tool_input = translator.get_translator_input(task_output, previous_tool, False)
                job_details = self.get_job_details(task_output["jobID"])[0]
                for file in tool_input["input"]["files"]:
                    file["model"] = job_details["input"]["files"][0]["model"]
        else:
            if current_tool == tool_aligner:
                tool_input = aligner.get_aligner_input_wf(wf_input)
            if current_tool == tool_tokeniser:
                tool_input = tokeniser.get_tokeniser_input_wf(wf_input, False)
            if current_tool == tool_pdftohtml:
                tool_input = pdftohtml.get_pdftohtml_input_wf(wf_input)
            if current_tool == tool_htmltojson:
                tool_input = htmltojson.get_htmltojson_input_wf(wf_input)
            if current_tool == tool_fileconverter:
                tool_input = file_converter.get_fc_input_wf(wf_input)
            if current_tool == tool_blockmerger:
                tool_input = block_merger.get_bm_input_wf(wf_input)
            if current_tool == tool_translator:
                tool_input = translator.get_translator_input_wf(wf_input, False)

        return tool_input


    # Returns the input required for the current tool to execute for the sync process.
    # current_tool = The tool of which the input is to be computed.
    # previous tool = Previous tool which got executed and produced 'task_output'.
    # wf_input = Input received during initiation of wf.
    def get_tool_input_sync(self, current_tool, previous_tool, task_output, wf_input):
        tool_input = {}
        if wf_input is None:
            if current_tool == tool_tokeniser:
                tool_input = tokeniser.get_tokeniser_input(task_output, previous_tool)
            if current_tool == tool_translator:
                tool_input = translator.get_translator_input(task_output, previous_tool, True)
        else:
            if current_tool == tool_tokeniser:
                tool_input = tokeniser.get_tokeniser_input_wf(wf_input, True)
            if current_tool == tool_translator:
                tool_input = translator.get_translator_input_wf(wf_input, True)
            if current_tool == tool_ch:
                tool_input = ch.get_ch_update_req(wf_input)
        return tool_input

    # Util method to make an API call and fetch the result
    def call_api(self, uri, api_input, user_id):
        try:
            api_headers = {'userid': user_id, 'ad-userid': user_id, 'Content-Type': 'application/json'}
            response = requests.post(url=uri, json=api_input, headers=api_headers)
            if response is not None:
                if response.text is not None:
                    data = json.loads(response.text)
                    return data
                else:
                    log_error("API response was None !", api_input, None)
                    return None
            else:
                log_error("API call failed!", api_input, None)
                return None
        except Exception as e:
            log_exception("Exception while making the api call: " + str(e), api_input, e)
            return None

    # Method to search jobs on job id for internal logic.
    def get_job_details(self, job_id):
        query = {"jobID": job_id}
        exclude = {'_id': False}
        return wfmrepo.search_job(query, exclude)

