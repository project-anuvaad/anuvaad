import config
from pymongo import MongoClient
from anuvaad_auditor.loghandler import log_info, log_error
from utilities import MODULE_CONTEXT


def connect_db():
    try:
        client = MongoClient('mongodb://{}:{}'.format(config.MONGO_DB_HOST, config.MONGO_DB_PORT))
        log_info('connectiong db at {} at port {}'.format(config.MONGO_DB_HOST, config.MONGO_DB_PORT), MODULE_CONTEXT)
        return True

    except Exception as e:
        log_error()

def get_db():
    return client[config.MONGO_DB_SCHEMA]
