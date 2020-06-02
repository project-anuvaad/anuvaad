import logging
import traceback
from datetime import time
from .producer import Producer

import yaml

log = logging.getLogger('file')
producer = Producer()
configs_global = {}


class Demo:
    def __init__(self):
        pass

    def fetch_all_configs(self):
        file = r'C:\Users\Vishal\Desktop\new-repo\example.yml'
        with open(file, 'r') as stream:
            try:
                parsed = yaml.safe_load(stream)
                configs = parsed['WorkflowConfigs']
                for obj in configs:
                    key = obj['workflowCode']
                    configs_global[key] = obj

            except yaml.YAMLError as exc:
                log.error("Exception while consuming: " + str(exc))
                traceback.print_exc()

    def get_all_configs(self):
        self.fetch_all_configs()
        return configs_global

    def fetch_output_topics(self, all_configs):
        topics = []
        for key in all_configs:
            config = all_configs[key]
            sequence = config["sequence"]
            for step in sequence:
                output_topic = step["tool"][0]["kafka-output"][0]["topic"]
                topics.append(output_topic)

        return topics

    def generate_job_id(self, workflowCode):
        config = self.get_all_configs()
        config_to_be_used = config[workflowCode]
        usecase = config_to_be_used["useCase"]
        return usecase + "-" + str(time.time()).replace('.', '')

    def get_order_of_exc(self, config):
        order_of_exc_dict = {}
        sequence = config["sequence"]
        for step in sequence:
            order_of_exc_dict[step["order"]] = step

        return sorted(order_of_exc_dict)

    def get_tok_input(self, object_in):
        req = {"files": object_in["files"],
           "jobID": object_in["jobID"],
           "workflowCode": object_in["workflowCode"],
           "currentStep: ": object_in["currentStep"]}

        return req

    def get_ali_input(self, config, object_in):
        req = {"files": object_in["files"],
           "jobID": object_in["jobID"],
           "workflowCode": object_in["workflowCode"],
           "currentStep: ": object_in["currentStep"]}

        return req

    def get_next_step(self, object_in):
        wf_code = object_in["workflowCode"]
        current_step = object_in["currentStep"]
        config = self.get_all_configs()
        config_to_be_used = config[wf_code]
        orderofexc = self.get_order_of_exc(config_to_be_used)
        try:
            next_step_details = orderofexc[current_step + 1]
            tool = next_step_details["tool"][0]
            tool_name = tool["name"]
            obj = self.get_tool_input(tool_name, object_in)
            return obj, tool
        except Exception as e:
            log.info("Exception while fetching next step: " + e)
            traceback.print_exc()
            return None

    def get_tool_input(self, tool_name, object_in):
        obj = {}
        if tool_name is "TOKENISER":
            obj = self.get_tok_input(object_in)

        if tool_name is "ALIGNER":
            obj = self.get_ali_input(object_in)

        return obj

    def update_job_details(self):
        pass

    def update_task_details(self):
        pass

    def initiate(self, object_in):
        log.info("Job initiated for the job: " + object_in["jobID"])
        config = self.get_all_configs()
        config_to_be_used = config[object_in["worflowCode"]]
        orderofexc = self.get_order_of_exc(config_to_be_used)
        first_step_details = orderofexc[0]
        tool = first_step_details["tool"][0]
        tool_name = tool["name"]
        input_topic = tool["kafka-input"][0]["topic"]
        obj = self.get_tool_input(tool_name, config_to_be_used, object_in)
        producer.push_to_queue(obj, input_topic)
        log.info("Workflow initiated for workflow: " + object_in["workflowCode"])
        log.info("TOOL 0: " + tool_name)


    def manage(self, object_in):
        self.update_job_details()
        self.update_task_details()
        if object_in["status"] is not "FAILED":
            next_step = self.get_next_step(object_in)
            if next_step is not None:
                obj = next_step[0]
                tool = next_step[1]
                topic = tool["kafka-input"][0]["topic"]
                tool_name = tool["name"]
                current_step = object_in["currentStep"]
                log.info("Current State: " + object_in["state"])
                log.info("TOOL " + (current_step + 1) + ": " + tool_name)
                object_in["currentStep"] = current_step + 1
                producer.push_to_queue(obj, topic)
            else:
                log.info("Job completed.")
