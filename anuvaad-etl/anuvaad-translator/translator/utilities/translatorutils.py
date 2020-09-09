import json
import logging
import time
import urllib

import requests
from configs.translatorconfig import file_download_url
from anuvaad_auditor.loghandler import log_exception, log_error

log = logging.getLogger('file')

class TranslatorUtils:
    def __init__(self):
        pass

    # Generates unique task id.
    def generate_task_id(self):
        return "TRANS" + "-" + str(time.time()).replace('.', '')

    # Generates unique task id.
    def download_file(self, file_id, task_input):
        url = str(file_download_url) + "?file=" + str(file_id)
        try:
            with urllib.request.urlopen(url) as url:
                response = url.read().decode()
                if response:
                    data = json.loads(response)
                    return data
                else:
                    log_error("File received on input is empty", task_input, None)
                    return None
        except Exception as e:
            log_exception("Exception while reading the json file: " + str(e), task_input, e)
            return None

    # Util method to make an API call and fetch the result
    def call_api(self, uri, method, api_input, params):
        try:
            response = None
            if method == "POST":
                response = requests.post(url=uri, data=api_input, headers={'Content-Type': 'application/json'})
            elif method == "GET":
                response = requests.get(url=uri, params=params)
            if response is not None:
                if response.text is not None:
                    data = json.loads(response.text)
                    return data
                else:
                    log_error("API response was None! URI: " + str(uri), api_input, None)
                    return None
            else:
                log_error("API call failed! URI: " + str(uri), api_input, None)
                return None
        except Exception as e:
            log_exception("Exception while making the api call: " + str(e), api_input, e)
            return None

