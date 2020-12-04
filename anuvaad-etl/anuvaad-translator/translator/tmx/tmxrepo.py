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

    def upsert(self, tmx_records):
        client = self.get_redis_instance()
        for tmx_record in tmx_records:
            log_info("GETALLKEY | key: " + str(tmx_record["hash"]), None)
            log_info("GETALLKEY | value: " + str(tmx_record), None)
            client.set(tmx_record["hash"], json.dumps(tmx_record))

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
        try:
            client = self.get_redis_instance()
            if not key_list:
                key_list = client.keys('*')
            result = []
            for key in key_list:
                log_info("GETALLKEY | fetchkey: " + str(key), None)
                val = client.get(key)
                if val:
                    log_info("GETALLKEY | fetchval: " + str(val), None)
                    result.append(json.loads(val))
            return result
        except Exception as e:
            log_exception("Exception in REPO: search | Cause: " + str(e), None, e)
            return None

