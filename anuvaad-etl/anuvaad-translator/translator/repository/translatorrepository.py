#!/bin/python
import pymongo

from configs.translatorconfig import mongo_server_host
from configs.translatorconfig import mongo_translator_db
from configs.translatorconfig import mongo_translator_collection
from configs.translatorconfig import mongo_trans_batch_collection

mongo_content_col_instance = None
mongo_batch_col_instance = None

class TranslatorRepository:

    def __init__(self):
        pass

    # Initialises and fetches mongo client
    def instantiate(self, collection):
        client = pymongo.MongoClient(mongo_server_host)
        db = client[mongo_translator_db]
        if collection == mongo_translator_collection:
            mongo_content_col_instance = db[collection]
            return mongo_content_col_instance
        if collection == mongo_trans_batch_collection:
            mongo_batch_col_instance = db[collection]
            return mongo_batch_col_instance

    def get_mongo_instance(self, collection):
        if collection == mongo_translator_collection:
            if not mongo_content_col_instance:
                return self.instantiate(collection)
            else:
                return mongo_content_col_instance
        if collection == mongo_trans_batch_collection:
            if not mongo_batch_col_instance:
                return self.instantiate(collection)
            else:
                return mongo_batch_col_instance

    # Inserts the object into mongo collection
    def create(self, object_in):
        col = self.get_mongo_instance(mongo_translator_collection)
        col.insert_one(object_in)

    # Updates the object in the mongo collection
    def update(self, object_in, criteria):
        col = self.get_mongo_instance(mongo_translator_collection)
        col.update(
            criteria,
            {"$set": object_in}
        )

    # Updates the object in the mongo collection
    def update_nested(self, find, set_value, filters):
        col = self.get_mongo_instance(mongo_translator_collection)
        col.update(find, {"$set": set_value, "arrayFilters": filters})

    # Deletes the object in the mongo collection by job id
    def delete(self, job_id):
        col = self.get_mongo_instance(mongo_translator_collection)
        col.remove({"jobID": job_id})

    # Searches the object into mongo collection
    def search(self, query, exclude):
        col = self.get_mongo_instance(mongo_translator_collection)
        res = col.find(query, exclude)
        result = []
        for record in res:
            result.append(record)
        return result

    # Searches the object into mongo collection
    def find_all(self):
        col = self.get_mongo_instance(mongo_translator_collection)
        res = col.find({})
        result = []
        for record in res:
            result.append(record)
        return result

    def write_batches(self, batch):
        col = self.get_mongo_instance(mongo_trans_batch_collection)
        col.insert_one(batch)
        del batch["_id"]

