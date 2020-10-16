from utilities import AppContext
from db import get_db
import pymongo
from pymongo import errors

from anuvaad_auditor.loghandler import log_info, log_exception

class WordModel(object):
    def __init__(self):
        collections = get_db()['dictionary']
        try:
            collections.create_index([("name", pymongo.TEXT)], unique=True)
        except Exception as e:
            log_exception("db connection exception ",  AppContext.getContext(), e)

    def save(self, words):
        try:
            collections = get_db()['dictionary']
            results     = collections.insert_many(words)
            if len(words) == len(results.inserted_ids):
                return True
        except errors.WriteConcernError as wce:
            print(wce)
            return False
        except errors.WriteError as we:
            print(we)
            return False