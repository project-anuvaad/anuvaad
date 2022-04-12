from flask import Flask
import pymongo
# from mongoengine import connect

from models import CustomResponse, Status
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
from config import MONGO_SERVER_URL

client = pymongo.MongoClient(MONGO_SERVER_URL)

def connectmongo():
    try:  
        log_info('***********Mongo Connected*************** ', MODULE_CONTEXT)
        return client
        
    except Exception as e:
        log_exception("cannot connect to database: {}".format(e),MODULE_CONTEXT,e)
        status = Status.SYSTEM_ERR.value
        status['message'] = str(e)
        out = CustomResponse(status, None)                  
        return out.getresjson(),500