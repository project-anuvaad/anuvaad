#!/bin/python
import pymongo

from configs.translatorconfig import mongo_server_host
from configs.translatorconfig import mongo_translator_db
from configs.translatorconfig import mongo_translator_collection

mongo_instance = None

class TranslatorRepository:

    def __init__(self):
        pass

    # Initialises and fetches mongo client
    def instantiate(self, collection):
        client = pymongo.MongoClient(mongo_server_host)
        db = client[mongo_translator_db]
        mongo_instance = db[collection]
        return mongo_instance

    def get_mongo_instance(self):
        if not mongo_instance:
            return self.instantiate(mongo_translator_collection)
        else:
            return mongo_instance

    # Inserts the object into mongo collection
    def create(self, object_in):
        col = self.get_mongo_instance()
        col.insert_one(object_in)

    # Updates the object in the mongo collection
    def update(self, object_in, criteria):
        col = self.get_mongo_instance()
        col.update(
            criteria,
            {"$set": object_in}
        )

    # Updates the object in the mongo collection
    def update_nested(self, find, set_value, filters):
        col = self.get_mongo_instance()
        col.update(find, {"$set": set_value, "arrayFilters": filters})

    # Deletes the object in the mongo collection by job id
    def delete(self, job_id):
        col = self.get_mongo_instance()
        col.remove({"jobID": job_id})

    # Searches the object into mongo collection
    def search(self, query, exclude):
        col = self.get_mongo_instance()
        res = col.find(query, exclude)
        result = []
        for record in res:
            result.append(record)
        return result

    # Searches the object into mongo collection
    def find_all(self):
        col = self.get_mongo_instance()
        res = col.find({})
        result = []
        for record in res:
            result.append(record)
        return result
