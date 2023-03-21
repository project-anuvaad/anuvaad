from config import MONGO_SERVER_HOST
from config import MONGO_DB_SCHEMA
from utilities import MODULE_CONTEXT
from pymongo import MongoClient
from anuvaad_auditor.loghandler import log_info, log_exception
from flask import g

client = MongoClient(MONGO_SERVER_HOST)

# establishing connection with mongo instance

def get_db():
    log_info("Establishing connection with mongo", MODULE_CONTEXT)
    return client[MONGO_DB_SCHEMA]


class User_management_db:

    def __init__(self):
        pass

    # Initialises and fetches mongo client
    def instantiate(self):
        # client = MongoClient(MONGO_SERVER_HOST)
        db = client[MONGO_DB_SCHEMA]
        log_info("Establishing database connectivity for the current request",MODULE_CONTEXT)
        return db

    def get_mongo_instance(self, db,collection):
        # if not db:
        #     db_instance = self.instantiate()
        # else:
        db_instance = db
        return db_instance[collection]
    