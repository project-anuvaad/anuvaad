import logging
import os
import time
import traceback

import requests
import yaml
from anuvaad_auditor.errorhandler import post_error
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception


from tools.aligner import Aligner
from tools.tokeniser import Tokeniser
from tools.pdftohtml import PDFTOHTML
from tools.htmltojson import HTMLTOJSON


aligner = Aligner()
tokeniser = Tokeniser()
pdftohtml = PDFTOHTML()
htmltojson = HTMLTOJSON()

log = logging.getLogger('file')
configs_global = {}

config_file_url = os.environ.get('ETL_WFM_CONFIG_FILE_URL',
            'https://raw.githubusercontent.com/project-anuvaad/anuvaad/wfmanager_feature/anuvaad-etl/anuvaad-workflow-mgr/config/example.yml')
#yaml_file_loc = os.environ.get('ETL_CONFIG_FILE_LOC', r'C:\Users\Vishal\Desktop\new-repo')
#yaml_file_name = os.environ.get('ETL_CONFIG_FILE', 'wfconfig.yml')
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
            log_exception("read_all_configs", "Exception while reading configs: ", None, exc)
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
                output_topic = step["tool"][0]["kafka-output"][0]["topic"]
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
            if current_tool == "ALIGNER":
                tool_input = aligner.get_aligner_input(task_output, previous_tool)
            if current_tool == "TOKENISER":
                tool_input = tokeniser.get_tokeniser_input(task_output, previous_tool)
            if current_tool == "PDFTOHTML":
                tool_input = pdftohtml.get_pdftohtml_input(task_output, previous_tool)
            if current_tool == "HTMLTOJSON":
                tool_input = htmltojson.get_htmltojson_input(task_output, previous_tool)
        else:
            if current_tool == "ALIGNER":
                tool_input = aligner.get_aligner_input_wf(wf_input)
            if current_tool == "TOKENISER":
                tool_input = tokeniser.get_tokeniser_input_wf(wf_input)
            if current_tool == "PDFTOHTML":
                tool_input = pdftohtml.get_pdftohtml_input_wf(wf_input)
            if current_tool == "HTMLTOJSON":
                tool_input = htmltojson.get_htmltojson_input_wf(wf_input)

        return tool_input

