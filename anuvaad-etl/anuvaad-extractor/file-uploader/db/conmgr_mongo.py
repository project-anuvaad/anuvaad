from mongoengine import *
import os
import config

def connectmongo():
    connect(config.MONGO_DB, host=config.MONGO_SERVER_URL, port=27017)
