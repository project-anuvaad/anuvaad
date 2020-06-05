import logging
import time
import traceback

import requests

from .producer import Producer
from .repository import WFMRepository

import yaml
import os

log = logging.getLogger('file')
producer = Producer()
wfmrepo = WFMRepository()
configs_global = {}

config_file_url = os.environ.get('ETL_WFM_CONFIG_FILE_URL',
            'https://raw.githubusercontent.com/project-anuvaad/anuvaad/wfmanager_feature/anuvaad-etl/anuvaad-workflow-mgr/config/example.yml')
yaml_file_loc = os.environ.get('ETL_CONFIG_FILE_LOC', r'C:\Users\Vishal\Desktop\new-repo')
yaml_file_name = os.environ.get('ETL_CONFIG_FILE', 'configfile.yml')


class Demo:
    def __init__(self):
        pass

    def fetch_all_configs(self):
        file = requests.get(config_file_url, allow_redirects=True)
        open(yaml_file_loc + yaml_file_name, 'wb').write(file.content)
        with open(yaml_file_loc + yaml_file_name, 'r') as stream:
            try:
                parsed = yaml.safe_load(stream)
                configs = parsed['WorkflowConfigs']
                for obj in configs:
                    key = obj['workflowCode']
                    configs_global[key] = obj
            except Exception as exc:
                log.error("Exception while consuming: " + str(exc))
                traceback.print_exc()

    def get_all_configs(self):
        return configs_global

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

    def get_tok_input(self, tool_input, object_in):
        input = {"files": object_in["files"]}
        tool_input["input"] = input
        tool_input["tool"] = "TOKENISER"
        return tool_input

    def get_ali_input(self, tool_input, object_in):
        input = {
                 "source": object_in["files"][0],
                  "target":  object_in["files"][1]
                }
        tool_input["input"] = input
        tool_input["tool"] = "ALIGNER"
        return tool_input


    def get_next_step(self, object_in):
        wf_code = object_in["workflowCode"]
        current_step = object_in["stepOrder"]
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
            print("Exception while fetching next step: " + str(e))
            log.info("Exception while fetching next step: " + str(e))
            traceback.print_exc()
            return None

    def get_tool_input(self, tool_name, object_in):
        obj = {"jobID": object_in["jobID"],
               "workflowCode": object_in["workflowCode"],
               "stepOrder " : object_in["stepOrder"]}

        if tool_name == "TOKENISER":
            obj = self.get_tok_input(obj, object_in)

        if tool_name == "ALIGNER":
            obj = self.get_ali_input(obj, object_in)

        return obj

    def update_job_details(self, state_details, iscreate):
        if iscreate:
            print("Creating job entry..")
            wfmrepo.create_job(state_details)
            del state_details["_id"]
        else:
            print("Updating job entry..")
            jobID = state_details["jobID"]
            wfmrepo.update_job(state_details, jobID)
            del state_details["_id"]

    def get_job_details_obj(self, input, status, state, output):
        obj = {"input": input,
               "output": output,
               "jobID": input["jobID"],
               "state": state,
               "status": status
               }

        return obj

    def get_wf_update_obj(self, wf_input, task_output, isfinal, isstart):
        if wf_input is not None:
            wf_details = self.get_jobs(wf_input["jobID"])
        else:
            wf_details = self.get_jobs(task_output["jobID"])

        if wf_details is None:
            task_details = []
            if task_output is not None:
                task_details = [task_output]
            wf_output = {
                "input": wf_input,
                "jobID": wf_input["jobID"],
                "state": task_output["state"],
                "taskDetails": task_details
                }
        else:
            task_details = wf_details["taskDetails"]
            task_details.append(task_output)
            wf_details["taskDetails"] = task_details
            wf_details["state"] = task_output["state"]
            wf_output = wf_details

        if isfinal:
            wf_output["status"] = "COMPLETED"
            wf_output["output"] = task_output

        elif isstart:
            wf_output["status"] = "STARTED"
            wf_output["output"] = None

        else:
            wf_output["status"] = "INPROGRESS"
            wf_output["output"] = task_output

        return wf_output

    def initiate(self, object_in):
        print("Job initiated for the job: " + object_in["jobID"])
        config = self.get_all_configs()
        config_to_be_used = config[object_in["workflowCode"]]
        orderofexc = self.get_order_of_exc(config_to_be_used)
        first_step_details = orderofexc[0]
        tool = first_step_details["tool"][0]
        tool_name = tool["name"]
        input_topic = tool["kafka-input"][0]["topic"]
        obj = self.get_tool_input(tool_name, config_to_be_used, object_in)
        state_details = self.get_wf_update_obj(object_in, None, False, False)
        self.update_job_details(state_details, False)
        producer.push_to_queue(obj, input_topic)
        print("Workflow initiated for workflow: " + object_in["workflowCode"])
        print("TOOL 0: " + tool_name)
        print(obj)


    def manage(self, object_in):
        if object_in["status"] is not "FAILED":
            next_step = self.get_next_step(object_in)
            if next_step is not None:
                state_details = self.get_wf_update_obj(None, object_in, False, False)
                self.update_job_details(state_details, False)
                obj = next_step[0]
                tool = next_step[1]
                topic = tool["kafka-input"][0]["topic"]
                tool_name = tool["name"]
                current_step = object_in["stepOrder"]
                print("Current State: " + object_in["state"])
                print("TOOL " + (current_step + 1) + ": " + tool_name)
                obj["stepOrder"] = current_step + 1
                producer.push_to_queue(obj, topic)
            else:
                state_details = self.get_wf_update_obj(None, object_in, True, False)
                self.update_job_details(state_details, False)
                print("Job completed.")
        else:
            state_details = self.get_job_details_obj(object_in, "FAILED", object_in["state"], object_in["output"])
            self.update_job_details(state_details, False)



    def get_jobs(self, job_id):
        return wfmrepo.search_job(job_id)



