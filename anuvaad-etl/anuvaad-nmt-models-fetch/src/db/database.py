from flask import Flask
import pymongo
from mongoengine import connect
from models import CustomResponse, Status
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
import config

def connectmongo():
    try:
        # dbs = connect(db = 'nmt-inference',host='localhost', port=27017)
        dbs = connect(db = config.DB_NAME, host=config.MONGO_SERVER_URL)
        log_info('***********Mongo Connected*************** ', MODULE_CONTEXT)
    except Exception as e:
        log_exception("cannot connect to database: {}".format(e),MODULE_CONTEXT,e)
        status = Status.SYSTEM_ERR.value
        status['message'] = str(e)
        out = CustomResponse(status, None)                  
        return out.getresjson(),500