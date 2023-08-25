from config import MONGO_SERVER_HOST, REDIS_SERVER_HOST
from config import MONGO_DB_SCHEMA, REDIS_SERVER_PORT
from utilities import MODULE_CONTEXT
from pymongo import MongoClient
from anuvaad_auditor.loghandler import log_info, log_exception
from flask import g
import redis

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

def get_active_users_redis():
    if 'redisdb' not in g:
        g.redisdb = redis.Redis(host=REDIS_SERVER_HOST, port=REDIS_SERVER_PORT, db=10)
    return g.redisdb