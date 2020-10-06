import json
import logging
import time
import urllib

import requests
from configs.translatorconfig import file_download_url
from configs.translatorconfig import sentence_fetch_url
from anuvaad_auditor.loghandler import log_exception, log_error, log_info

log = logging.getLogger('file')


class TranslatorUtils:
    def __init__(self):
        pass

    # Generates unique task id.
    def generate_task_id(self):
        return "TRANS" + "-" + str(time.time()).replace('.', '')[0:13]

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
    def call_api(self, uri, method, api_input, params, user_id):
        try:
            response = None
            if method == "POST":
                api_headers = {'userid': user_id, 'ad-userid': user_id, 'Content-Type': 'application/json'}
                response = requests.post(url=uri, json=api_input, headers=api_headers)
            elif method == "GET":
                api_headers = {'userid': user_id}
                response = requests.get(url=uri, params=params, headers=api_headers)
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

    # Stop gap method for fetching sentence from CH.
    def fetch_sentence_by_id(self, sentence_id, user_id):
        try:
            api_headers = {'userid': user_id, 'ad-userid': user_id, 'Content-Type': 'application/json'}
            ch_url = sentence_fetch_url.replace("{user_id}", user_id).replace("{sentence_id}", sentence_id)
            log_info("URL: " + str(ch_url), None)
            response = requests.get(url=ch_url, headers=api_headers)
            if response is not None:
                if response.text is not None:
                    data = json.loads(response.text)
                    return data
                else:
                    log_error("API response was None! URI: " + str(ch_url), None, None)
                    return None
        except Exception as e:
            log_exception("Exception while making the api call: " + str(e), None, e)
            return None

