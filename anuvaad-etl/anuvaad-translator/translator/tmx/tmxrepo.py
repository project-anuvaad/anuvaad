#!/bin/python
import json
from anuvaad_auditor.loghandler import log_exception, log_info
from configs.translatorconfig import redis_server_host
from configs.translatorconfig import redis_server_port
import redis

redis_client = None

class TMXRepository:

    def __init__(self):
        pass

    # Initialises and fetches redis client
    def redis_instantiate(self):
        redis_client = redis.Redis(host=redis_server_host, port=redis_server_port, db=3)
        return redis_client

    def get_redis_instance(self):
        if not redis_client:
            return self.redis_instantiate()
        else:
            return redis_client

    def upsert(self, input_dict):
        client = self.get_redis_instance()
        for key in input_dict.keys():
            client.set(key, json.dumps(input_dict[key]))
        log_info("GETALLKEY | Created count: " + str(len(input_dict.keys())), None)

    def search(self, key_list):
        try:
            client = self.get_redis_instance()
            result = []
            for key in key_list:
                data = client.get(key)
                if data:
                    result.append(json.loads(data))
            return result
        except Exception as e:
            log_exception("Exception in REPO: search | Cause: " + str(e), None, e)
            return None

    def get_all_records(self, key_list):
        log_info("GETALLKEY | Fetching all data......", None)
        try:
            client = self.get_redis_instance()
            if not key_list:
                key_list = client.keys('*')
            result = []
            for key in key_list:
                log_info("GETALLKEY | " + str(key), None)
                key_type = client.type(key)
                val = None
                if key_type == "string":
                    log_info("GETALLKEY | STRING", None)
                    val = client.get(key)
                if key_type == "hash":
                    log_info("GETALLKEY | HASH", None)
                    val = client.hgetall(key)
                if key_type == "zset":
                    log_info("GETALLKEY | ZSET", None)
                    val = client.zrange(key, 0, -1)
                if key_type == "list":
                    log_info("GETALLKEY | LIST", None)
                    val = client.lrange(key, 0, -1)
                if key_type == "set":
                    log_info("GETALLKEY | SET", None)
                    val = client.smembers(key)
                if val:
                    log_info(val, None)
                    result.append(json.loads(val))
            log_info("GETALLKEY | RESULT LENGTH: " + str(len(result)), None)
            return result
        except Exception as e:
            log_exception("Exception in REPO: search | Cause: " + str(e), None, e)
            return None

