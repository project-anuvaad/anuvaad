import config
from pymongo import MongoClient

client = MongoClient('mongodb://{}:{}'.format(config.MONGO_DB_HOST, config.MONGO_DB_PORT))

def get_db():
    return client[config.MONGO_DB_SCHEMA]
