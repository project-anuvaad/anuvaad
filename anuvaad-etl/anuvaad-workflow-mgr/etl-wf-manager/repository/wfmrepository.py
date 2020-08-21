#!/bin/python
import os
import pymongo

from configs.wfmconfig import mongo_server_host
from configs.wfmconfig import mongo_alignment_db
from configs.wfmconfig import mongo_alignment_col_jobs



class WFMRepository:

    def __init__(self):
        pass

    # Initialises and fetches mongo client
    def instantiate(self):
        client = pymongo.MongoClient(mongo_server_host)
        db = client[mongo_alignment_db]
        col = db[mongo_alignment_col_jobs]
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
    def search_job(self, query, exclude):
        col = self.instantiate()
        res = col.find(query, exclude)
        result = []
        for record in res:
            result.append(record)
        return result
