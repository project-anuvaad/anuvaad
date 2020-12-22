#!/bin/python
import json

import redis
from anuvaad_auditor.loghandler import log_exception
from configs.translatorconfig import redis_server_host
from configs.translatorconfig import redis_server_port

import pymongo
from configs.translatorconfig import mongo_server_host
from configs.translatorconfig import mongo_translator_db
from configs.translatorconfig import mongo_tmx_collection

redis_client = None
mongo_client = None

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

    # Initialises and fetches mongo client
    def instantiate(self, collection):
        client = pymongo.MongoClient(mongo_server_host)
        db = client[mongo_translator_db]
        mongo_client = db[collection]
        return mongo_client

    def get_mongo_instance(self):
        if not mongo_client:
            return self.instantiate(mongo_tmx_collection)
        else:
            return mongo_client

    def upsert(self, key, value):
        try:
            client = self.get_redis_instance()
            client.set(key, json.dumps(value))
            return 1
        except Exception as e:
            log_exception("Exception in REPO: upsert | Cause: " + str(e), None, e)
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
            log_exception("Exception in REPO: search | Cause: " + str(e), None, e)
            return None

    def get_all_records(self, key_list):
        try:
            client = self.get_redis_instance()
            result = []
            if not key_list:
                key_list = client.keys('*')
            for key in key_list:
                val = client.get(key)
                if val:
                    result.append(json.loads(val))
            return result
        except Exception as e:
            log_exception("Exception in REPO: search | Cause: " + str(e), None, e)
            return None

    # Inserts the object into mongo collection
    def mongo_create(self, object_in):
        col = self.get_mongo_instance()
        col.insert_one(object_in)

