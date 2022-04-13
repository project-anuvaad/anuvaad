from config import MONGO_CONNECTION_URL,MONGO_DB_SCHEMA
from pymongo import MongoClient
from anuvaad_auditor.loghandler import log_info, log_exception
from utilities import AppContext
from flask import g

client = MongoClient(MONGO_CONNECTION_URL)

def get_db():
    log_info("Establishing connection with mongo", AppContext.getContext())
    return client[MONGO_DB_SCHEMA]



# def get_db():
#     with server.app_context():
#         if 'mongodb' not in g:
#             log_info("Establishing connection with mongo", AppContext.getContext())
#             client = MongoClient(MONGO_CONNECTION_URL)
#             g.mongodb = client[MONGO_DB_SCHEMA]

#         return g.mongodb