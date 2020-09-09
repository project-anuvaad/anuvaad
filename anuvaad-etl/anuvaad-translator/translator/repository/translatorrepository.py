#!/bin/python
import os
import pymongo

from configs.translatorconfig import mongo_server_host
from configs.translatorconfig import mongo_translator_db
from configs.translatorconfig import mongo_translator_collection


class TranslatorRepository:

    def __init__(self):
        pass

    # Initialises and fetches mongo client
    def instantiate(self):
        client = pymongo.MongoClient(mongo_server_host)
        db = client[mongo_translator_db]
        col = db[mongo_translator_collection]
        return col

    # Inserts the object into mongo collection
    def create(self, object_in):
        col = self.instantiate()
        col.insert_one(object_in)

    # Updates the object in the mongo collection
    def update(self, object_in, job_id):
        col = self.instantiate()
        col.replace_one(
            {"jobID": job_id},
            object_in
        )

    # Searches the object into mongo collection
    def search(self, query, exclude):
        col = self.instantiate()
        res = col.find(query, exclude)
        result = []
        for record in res:
            result.append(record)
        return result
