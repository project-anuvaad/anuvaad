import json
import logging
import os
import time

import requests
from configs.translatorconfig import download_folder, nmt_fetch_models_url, tmx_disable_roles, utm_disable_roles
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
        file_path = download_folder + file_id
        log_info("File: " + str(file_path), task_input)
        try:
            with open(file_path) as file:
                data = json.loads(file.read())
                return data
        except Exception as e:
            log_exception("Exception while reading the json file: " + str(e), task_input, e)
            return None

    # Util method to make an API call and fetch the result
    def call_api(self, uri, method, api_input, params, user_id):
        try:
            log_info(f"URI: {uri}", None)
            log_info("BODY: ", None)
            log_info(api_input, None)
            response = None
            if method == "POST":
                api_headers = {'userid': user_id, 'x-user-id': user_id, 'Content-Type': 'application/json'}
                response = requests.post(url=uri, json=api_input, headers=api_headers)
            elif method == "GET":
                api_headers = {'userid': user_id}
                response = requests.get(url=uri, params=params, headers=api_headers)
            if response is not None:
                if response.text is not None:
                    res = json.loads(response.text)
                    log_info("RESPONSE: ", None)
                    log_info(res, None)
                    return res
                else:
                    log_error("API response was None, URI: " + str(uri), api_input, None)
                    return None
            else:
                log_error("API call failed! URI: " + str(uri), api_input, None)
                return None
        except Exception as e:
            log_exception("Exception while making the api call: " + str(e), api_input, e)
            return None

    # Util to fetch output topics from Models.
    def get_topics_from_models(self):
        topics = []
        try:
            models = self.call_api(nmt_fetch_models_url, "GET", None, None, "userID")
            if models:
                if 'data' in models.keys():
                    if models["data"]:
                        for model in models["data"]:
                            try:
                                if model["status"] == "ACTIVE":
                                    conn_details = model["connection_details"]
                                    if 'kafka' in conn_details.keys():
                                        topic = os.environ.get(conn_details["kafka"]["output_topic"], 'NA')
                                        if topic != "NA":
                                            if topic not in topics:
                                                topics.append(topic)
                            except Exception as e:
                                log_exception("Exception while fetching topics: {}".format(str(e)), None, None)
                                continue
        except Exception as e:
            log_exception("Exception while fetching topics from model: {}".format(str(e)), None, None)
        log_info("ModelTopics -- {}".format(topics), None)
        return topics

    # Method to check if tmx and utm are enabled based on role
    def get_rbac_tmx_utm(self, roles, translate_wf_input, log):
        tmx_enabled, utm_enabled = True, True
        tmx_dis_roles, utm_dis_roles = list(tmx_disable_roles.split(",")), list(utm_disable_roles.split(","))
        roles = list(roles.split(","))
        for role in roles:
            if role in tmx_dis_roles:
                tmx_enabled = False
                if log:
                    log_info("TMX Disabled for this user!", translate_wf_input)
            if role in utm_dis_roles:
                utm_enabled = False
                if log:
                    log_info("UTM Disabled for this user!", translate_wf_input)
        return tmx_enabled, utm_enabled


