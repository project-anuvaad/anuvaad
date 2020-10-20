#!/bin/python
import os
import pymongo

from configs.wfmconfig import mongo_server_host
from configs.wfmconfig import mongo_wfm_db
from configs.wfmconfig import mongo_wfm_jobs_col



class WFMRepository:

    def __init__(self):
        pass

    # Initialises and fetches mongo client
    def instantiate(self):
        client = pymongo.MongoClient(mongo_server_host)
        db = client[mongo_wfm_db]
        col = db[mongo_wfm_jobs_col]
        return col

    # Inserts the object into mongo collection
    def create_job(self, object_in):
        col = self.instantiate()
        col.insert_one(object_in)

    # Updates the object in the mongo collection
    def update_job(self, object_in, job_id):
        col = self.instantiate()
        col.replace_one(
            {"jobID": job_id},
            object_in
        )

    # Searches the object into mongo collection
    def search_job(self, query, exclude, offset, res_limit):
        col = self.instantiate()
        if offset is None and res_limit is None:
            res = col.find(query, exclude)
        else:
            res = col.find(query, exclude).sort([("startTime", -1)]).skip(offset).limit(res_limit)
        result = []
        for record in res:
            result.append(record)
        return result
