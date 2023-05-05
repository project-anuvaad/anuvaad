#!/bin/python
import os
import pymongo

from configs.wfmconfig import mongo_server_host
from configs.wfmconfig import mongo_wfm_db
from configs.wfmconfig import mongo_wfm_jobs_col

mongo_instance = None

class WFMRepository:

    def __init__(self):
        pass

    # Initialises and fetches mongo client
    def instantiate(self):
        client = pymongo.MongoClient(mongo_server_host)
        db = client[mongo_wfm_db]
        mongo_instance = db[mongo_wfm_jobs_col]
        return mongo_instance

    def get_mongo_instance(self):
        if not mongo_instance:
            return self.instantiate()
        else:
            return mongo_instance

    # Inserts the object into mongo collection
    def create_job(self, object_in):
        col = self.get_mongo_instance()
        col.insert_one(object_in)

    # Updates the object in the mongo collection
    def update_job(self, object_in, job_id):
        col = self.get_mongo_instance()
        col.replace_one(
            {"jobID": job_id},
            object_in
        )

    # Searches the object into mongo collection
    def search_job(self, query, exclude, offset, res_limit):
        col = self.get_mongo_instance()
        if offset is None and res_limit is None:
            res = col.find(query, exclude).sort([('_id', 1)])
        else:
            res = col.find(query, exclude).sort([('_id', -1)]).skip(offset).limit(res_limit)
        result = []
        for record in res:
            result.append(record)
        return result
