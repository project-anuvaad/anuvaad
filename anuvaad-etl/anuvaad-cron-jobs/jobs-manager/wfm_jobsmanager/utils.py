import pymongo

from .configs import mongo_server_host
from .configs import mongo_wfm_db
from .configs import mongo_wfm_jobs_col

class WFMJMCronUtils:

    def __init__(self):
        pass

    # Initialises and fetches mongo client
    def instantiate(self):
        client = pymongo.MongoClient(mongo_server_host)
        db = client[mongo_wfm_db]
        col = db[mongo_wfm_jobs_col]
        return col

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

    # Updates the object in the mongo collection
    def update_job(self, object_in, job_id):
        col = self.instantiate()
        col.replace_one({"jobID": job_id}, object_in)
