from flask import Flask
import pymongo
from mongoengine import connect
from models import CustomResponse, Status
from utilities import MODULE_CONTEXT

def connectmongo():
    try:
        dbs = connect(db = 'nmt-inference',host = 'mongodb+srv://sriharimn:Harikane@cluster0.1frkl.mongodb.net/')
        #dbs = connect(config.MONGO_DB, host=config.MONGO_SERVER_URL, port=27017)
    except:
        log_exception("cannot connect to database: {}".format(e),MODULE_CONTEXT,e)
        print('error cannot connect to db')
        status = Status.SYSTEM_ERR.value
        status['why'] = str(e)
        out = CustomResponse(status, None)                  
        return out.getresjson(),500