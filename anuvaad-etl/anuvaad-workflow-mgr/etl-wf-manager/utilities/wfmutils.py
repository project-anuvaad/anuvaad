import logging
import traceback

import yaml

log = logging.getLogger('file')

class WFMUtils:
    def __init__(self):
        pass

    def fetch_all_configs(self):
        file = r'C:\Users\Vishal\Desktop\new-repo\example.yml'
        config_dict = {}
        with open(file, 'r') as stream:
            try:
                parsed = yaml.safe_load(stream)
                configs = parsed['WorkflowConfigs']
                for obj in configs:
                    key = obj['workflowCode']
                    config_dict[key] = obj
            except yaml.YAMLError as exc:
                log.error("Exception while consuming: " + str(exc))
                traceback.print_exc()
                
            return config_dict

    def generate_job_id(self):
        pass

    def upload_file(self):
        pass

    def download_file(self):
        pass

    def read_file(self):
        pass

    def write_file(self):
        pass
