from config import MONGO_SERVER_HOST
from config import MONGO_DB_SCHEMA
from utilities import MODULE_CONTEXT
from pymongo import MongoClient
from anuvaad_auditor.loghandler import log_info, log_exception
from flask import g

# establishing connection with mongo instance

def get_db():
    if 'db' not in g:
        log_info("Establishing database connectivity for the current request",MODULE_CONTEXT)
        client = MongoClient(MONGO_SERVER_HOST)
        g.db = client[MONGO_DB_SCHEMA]
    return g.db

