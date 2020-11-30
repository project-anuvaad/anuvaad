import config
from pymongo import MongoClient
from anuvaad_auditor.loghandler import log_info, log_exception
from utilities import AppContext
client = MongoClient(config.MONGO_CONNECTION_URL)

def get_db():
    return client[config.MONGO_DB_SCHEMA]
