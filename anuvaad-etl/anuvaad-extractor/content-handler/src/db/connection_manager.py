from config import MONGO_CONNECTION_URL,MONGO_DB_SCHEMA
from config import REDIS_SERVER_HOST,REDIS_SERVER_PORT
from app import server
from pymongo import MongoClient
from anuvaad_auditor.loghandler import log_info, log_exception
from utilities import AppContext
from flask import g
import redis
client = MongoClient(MONGO_CONNECTION_URL)

def get_db():
#     log_info("Establishing connection with mongo", AppContext.getContext())
    return client[MONGO_DB_SCHEMA]


def get_redis(db):
    if 'redisdb' not in g:
#         log_info("Establishing connection with redis store", AppContext.getContext())
        g.redisdb = redis.Redis(host=REDIS_SERVER_HOST, port=REDIS_SERVER_PORT, db=db)
    return g.redisdb

def get_redis_1(db):
    # if 'redisdb' not in g:
#         log_info("Establishing connection with redis store", AppContext.getContext())
        g.redisdb = redis.Redis(host=REDIS_SERVER_HOST, port=REDIS_SERVER_PORT, db=db)
        return g.redisdb
# def get_db():
#     with server.app_context():
#         if 'mongodb' not in g:
#             log_info("Establishing connection with mongo", AppContext.getContext())
#             client = MongoClient(MONGO_CONNECTION_URL)
#             g.mongodb = client[MONGO_DB_SCHEMA]

#         return g.mongodb
