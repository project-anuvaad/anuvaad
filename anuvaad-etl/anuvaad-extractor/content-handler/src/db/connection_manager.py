import config
from pymongo import MongoClient
from anuvaad_auditor.loghandler import log_info, log_exception
from utilities import AppContext
client = MongoClient('mongodb://{}:{}'.format(config.MONGO_DB_HOST, config.MONGO_DB_PORT))

def get_db():
    return client[config.MONGO_DB_SCHEMA]
