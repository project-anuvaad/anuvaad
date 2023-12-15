import json
import logging
import os
import re
import time
import zlib

import requests
import hashlib
from configs.translatorconfig import download_folder, nmt_fetch_models_url, tmx_disable_roles, utm_disable_roles
from anuvaad_auditor.loghandler import log_exception, log_error, log_info
from tmx.tmxrepo import TMXRepository

log = logging.getLogger('file')

tmxRepo = TMXRepository()

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

    # Method to simultaneously replace multiple strings in a sentence
    def multiple_replace(self, sentence, replacement_dict):
        pattern = re.compile("|".join([re.escape(k) for k in sorted(replacement_dict, key=len, reverse=True)]),
                             flags=re.DOTALL)
        return pattern.sub(lambda x: replacement_dict[x.group(0)], sentence)


    def get_sentences_from_store(self,keys,translate_wf_input):
            data_keys=[]
            for key in keys:
                if "userID" not in key or not key["userID"] or "src" not in key or not key["src"] or "locale" not in key or not key["locale"]:
                    return None
                log_info("Fetching sentences from redis store for userID:{} | src:{}".format(key["userID"],key["src"]), translate_wf_input)
                sentence_hash= key["userID"] + "___" + key["src"]+ "___"+key["locale"]
                sent_key =hashlib.sha256(sentence_hash.encode('utf_16')).hexdigest()
                data_keys.append(sent_key)
            try:
                result=self.get_sentence_by_keys(data_keys,translate_wf_input)
                return result
            except Exception as e:
                log_exception("Exception while fetching sentences from redis store: " + str(e), translate_wf_input, e)
                return None
        
    def get_sentence_by_keys(self,keys,translate_wf_input):
        try:
            client = tmxRepo.get_utm_redis_instance()
            result = []
            for key in keys:
                sent_obj={}
                val=client.lrange(key, 0, -1)
                #hash_values = client.hget("UTM",key)
                if val != None and len(val) > 0:
                    log_info(f"VAL VALUE :: {val}",translate_wf_input)
                    val = zlib.decompress(val[0]).decode()
                    # val=client.lrange(key, 0, -1)
                    sent_obj["key"]=key
                    sent_obj["value"]=[val]
                    result.append(sent_obj)
                    return result
            return result
                # else:
                #     sent_obj["key"]=key
                #     sent_obj["value"]=[]
                #     result.append(sent_obj)
                #     return result
        except Exception as e:
            log_exception("Exception in fetching sentences from redis store  | Cause: " + str(e), translate_wf_input, e)
            return None