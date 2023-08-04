#!/bin/python
import json

import redis
import pymongo
from anuvaad_auditor.loghandler import log_exception, log_info
from configs.wfmconfig import redis_server_host, redis_server_port, active_docs_redis_db, active_doc_time

redis_client = None

class REDISRepository:

    def __init__(self):
        pass

    # Initialises and fetches redis client
    def redis_instantiate(self):
        global redis_client
        redis_client = redis.Redis(host=redis_server_host, port=redis_server_port, db=active_docs_redis_db)
        return redis_client

    def get_redis_instance(self):
        global redis_client
        if not redis_client:
            return self.redis_instantiate()
        else:
            return redis_client

    def upsert(self, key, value):
        try:
            client = self.get_redis_instance()
            #log_info(f"Key to TMX DB: {key}",None)
            #log_info(f"Value to TMX DB: {value}",None)
            client.set(key, json.dumps(value),ex=active_doc_time)
            return 1
        except Exception as e:
            log_exception("Exception in TMXREPO: upsert | Cause: " + str(e), None, e)
            return None

    def delete(self, keys):
        try:
            client = self.get_redis_instance()
            client.delete(*keys)
            return 1
        except Exception as e:
            log_exception("Exception in TMXREPO: delete | Cause: " + str(e), None, e)
            return None

    def search(self, key_list):
        try:
            client = self.get_redis_instance()
            result = []
            for key in key_list:
                val = client.get(key)
                if val:
                    result.append(json.loads(val))
            return result
        except Exception as e:
            log_exception("Exception in TMXREPO: search | Cause: " + str(e), None, e)
            return None

    def get_active_docs(self):
        try:
            client = self.get_redis_instance()
            result = []
            if not key_list:
                key_list = client.keys('*')
            db_values = client.mget(key_list)
            for val in db_values:
                if val:
                    result.append(json.loads(val))
            return result
        except Exception as e:
            log_exception("Exception in TMXREPO: search | Cause: " + str(e), None, e)
            return None

    def get_active_count(self):
        try:
            client = self.get_redis_instance()
            result = []
            if not key_list:
                key_list = client.keys('*')
            db_values = client.mget(key_list)
            for val in db_values:
                if val:
                    result.append(json.loads(val))
            return result
        except Exception as e:
            log_exception("Exception in TMXREPO: search | Cause: " + str(e), None, e)
            return None
