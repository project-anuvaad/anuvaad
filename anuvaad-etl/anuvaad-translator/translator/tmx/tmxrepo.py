#!/bin/python
import json

import redis
import pymongo
from anuvaad_auditor.loghandler import log_exception, log_info
from configs.translatorconfig import redis_server_host, redis_server_port
from configs.translatorconfig import mongo_server_host, mongo_translator_db, mongo_tmx_collection
from configs.translatorconfig import mongo_suggestion_box_collection, tmx_org_enabled, tmx_user_enabled, tmx_redis_db

redis_client = None
mongo_client = None


class TMXRepository:

    def __init__(self):
        pass

    # Initialises and fetches redis client
    def redis_instantiate(self):
        global redis_client
        redis_client = redis.Redis(host=redis_server_host, port=redis_server_port, db=tmx_redis_db)
        return redis_client

    def get_redis_instance(self):
        global redis_client
        if not redis_client:
            return self.redis_instantiate()
        else:
            return redis_client

    # Initialises and fetches mongo client
    def instantiate(self, collection):
        client = pymongo.MongoClient(mongo_server_host)
        db = client[mongo_translator_db]
        global mongo_client
        mongo_client = db[collection]
        return mongo_client

    def get_mongo_instance(self, collection):
        global mongo_client
        if not mongo_client:
            return self.instantiate(collection)
        else:
            return mongo_client

    def upsert(self, key, value):
        try:
            client = self.get_redis_instance()
            client.set(key, json.dumps(value))
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

    def get_all_records(self, key_list):
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

    # Inserts the object into mongo collection
    def tmx_create(self, object_in):
        col = self.get_mongo_instance(mongo_tmx_collection)
        col.insert_one(object_in)
        del object_in["_id"]

    # Searches tmx entries from mongo collection
    def search_tmx_db(self, user_id, org_id, locale):
        col = self.get_mongo_instance(mongo_tmx_collection)
        user, org = 0, 0
        if tmx_user_enabled:
            res_user = col.find({"locale": locale, "userID": user_id}, {'_id': False})
            if res_user:
                for record in res_user:
                    user += 1
        if tmx_org_enabled:
            res_org = col.find({"locale": locale, "orgID": org_id}, {'_id': False})
            if res_org:
                for record in res_org:
                    org += 1
        if user > 0 and org > 0:
            return "BOTH"
        else:
            if user > 0:
                return "USER"
            elif org > 0:
                return "ORG"
        return None

    def suggestion_box_create(self, object_in):
        col = self.get_mongo_instance(mongo_suggestion_box_collection)
        col.insert_many(object_in)

    def suggestion_box_delete(self, query):
        col = self.get_mongo_instance(mongo_suggestion_box_collection)
        records = self.suggestion_box_search(query, {'_id': False})
        log_info(f'Search result: {records}', None)
        deleted = col.delete_many(query)
        return deleted.deleted_count

    def suggestion_box_search(self, query, exclude):
        col = self.get_mongo_instance(mongo_suggestion_box_collection)
        res = col.find(query, exclude)
        result = []
        for record in res:
            result.append(record)
        return result
