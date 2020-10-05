import config
from pymongo import MongoClient
from anuvaad_auditor.loghandler import log_info, log_exception
from utilities import MODULE_CONTEXT

def connect_db():
    global client
    try:
        client = MongoClient('mongodb://{}:{}'.format(config.MONGO_DB_HOST, config.MONGO_DB_PORT))
        log_info('connectiong db at {} at port {}'.format(config.MONGO_DB_HOST, config.MONGO_DB_PORT), MODULE_CONTEXT)
        return True
    except Exception as e:
        log_exception("db connection exception ",  MODULE_CONTEXT, e)

def get_db():
    return client[config.MONGO_DB_SCHEMA]
