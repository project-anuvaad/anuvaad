import logging
import traceback
from datetime import time

import yaml

log = logging.getLogger('file')

class WFMUtils:
    def __init__(self):
        pass

    # Function to read all the yaml files.
    # Prepare a dict of configs against workflow code
    # List all the kafka topics involved.
    def fetch_all_configs(self):
        file = r'C:\Users\Vishal\Desktop\new-repo\example.yml'
        config_dict = {}
        topics = []
        with open(file, 'r') as stream:
            try:
                parsed = yaml.safe_load(stream)
                configs = parsed['WorkflowConfigs']
                for obj in configs:
                    key = obj['workflowCode']
                    config_dict[key] = obj
                    sequence = obj["sequence"]
                    for step in sequence:
                        input_topic = step["tool"][0]["kafka-input"][0]["topic"]
                        output_topic = step["tool"][0]["kafka-output"][0]["topic"]
                        topics.append(input_topic)
                        topics.append(output_topic)

            except yaml.YAMLError as exc:
                log.error("Exception while consuming: " + str(exc))
                traceback.print_exc()

            return config_dict, topics

    # Utility to generate a unique random job ID
    def generate_job_id(self, usecase):
        return usecase + "-" + str(time.time()).replace('.', '')

    # Based on a given config, this method returns a dict of order of execution.
    def get_order_of_exc(self, config):
        order_of_exc_dict = {}
        sequence = config["sequence"]
        for step in sequence:
            order_of_exc_dict[step["order"]] = step
        return sorted(order_of_exc_dict)

    def upload_file(self):
        pass

    def download_file(self):
        pass

    def read_file(self):
        pass

    def write_file(self):
        pass
