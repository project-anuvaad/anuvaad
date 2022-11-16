#!/bin/python
import json

import redis
import pymongo
from anuvaad_auditor.loghandler import log_exception, log_info
from configs.translatorconfig import redis_server_host, redis_server_port
from configs.translatorconfig import mongo_server_host, mongo_translator_db, mongo_tmx_collection
from configs.translatorconfig import mongo_suggestion_box_collection, tmx_org_enabled, tmx_user_enabled, tmx_redis_db

redis_client = None
mongo_client_tmx = None
mongo_client_suggestion = None

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

    def instantiate_mongo_suggestion(self):
        global mongo_client_suggestion
        if not mongo_client_suggestion:
            client = pymongo.MongoClient(mongo_server_host)
            db = client[mongo_translator_db]
            mongo_client_suggestion = db[mongo_suggestion_box_collection]
        return mongo_client_suggestion

    def instantiate_mongo_tmx(self):
        global mongo_client_tmx
        if not mongo_client_tmx:
            client = pymongo.MongoClient(mongo_server_host)
            db = client[mongo_translator_db]
            mongo_client_tmx = db[mongo_tmx_collection]
        return mongo_client_tmx

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
        col = self.instantiate_mongo_tmx()
        col.insert_one(object_in)
        del object_in["_id"]

    # Searches tmx entries from mongo collection
    def search_tmx_db(self, user_id, org_id, locale):
        col = self.instantiate_mongo_tmx()
        user, org = 0, 0
        if tmx_user_enabled:
            res_user = col.find({"locale": locale, "userID": user_id}, {'_id': False})
            if res_user:
                for record in res_user:
                    log_info(f"Test68 USER TMX RECORDS: {record}",None)
                    user += 1
        if tmx_org_enabled:
            res_org = col.find({"locale": locale, "orgID": org_id}, {'_id': False})
            if res_org:
                for record in res_org:
                    log_info(f"Test68 ORG TMX RECORDS: {record}",None)
                    org += 1
        log_info(f"Test68 USER TMX Records: {user}", None)
        log_info(f"Test68 ORG TMX Records: {org}", None)
        if user > 0 and org > 0:
            return "BOTH"
        else:
            if user > 0:
                return "USER"
            elif org > 0:
                return "ORG"
        return None

    def suggestion_box_create(self, object_in):
        col = self.instantiate_mongo_suggestion()
        inserts = col.insert_many(object_in)
        return inserts.inserted_ids

    def suggestion_box_update(self, find_cond, set_cond):
        col = self.instantiate_mongo_suggestion()
        col.update_many(find_cond, set_cond)

    def suggestion_box_delete(self, query):
        col = self.instantiate_mongo_suggestion()
        deleted = col.delete_many(query)
        return deleted.deleted_count

    def suggestion_box_search(self, query, exclude):
        col = self.instantiate_mongo_suggestion()
        res = col.find(query, exclude)
        result = []
        for record in res:
            result.append(record)
        return result
