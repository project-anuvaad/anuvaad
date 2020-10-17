from utilities import AppContext, normalize_bson_to_json
from db import get_db
import pymongo
from anuvaad_auditor.loghandler import log_info, log_exception


class WordModel(object):
    def __init__(self):
        collections = get_db()['dictionary']
        try:
            collections.create_index([("name", pymongo.TEXT)], unique=True)
        except pymongo.errors.DuplicateKeyError as e:
            log_info("duplicate key, ignoring", AppContext.getContext())
        except Exception as e:
            log_exception("db connection exception ",  AppContext.getContext(), e)

    def save(self, words):
        try:
            collections = get_db()['dictionary']
            results     = collections.insert_many(words, ordered=False)
            if len(words) == len(results.inserted_ids):
                return True
        except pymongo.errors.BulkWriteError as e:
            log_info("some of the record has duplicates ",  AppContext.getContext())
            return True
        except Exception as e:
            log_exception("db connection exception ",  AppContext.getContext(), e)
            return False

    def search_source(self, word):
        try:
            collections = get_db()['dictionary']
            docs         = collections.find({'name': word})
            for doc in docs:
                return normalize_bson_to_json(doc)
            return None
        except Exception as e:
            log_exception("db connection exception ",  AppContext.getContext(), e)
            return None

    def search_target(self, word, locale):
        try:
            collections = get_db()['dictionary']
            # {'parallel_words': {$elemMatch: {'locale':'hi1', 'name': 'प्रथम दुःखद अनुभव'}}}
            docs         = collections.find({'parallel_words': { '$elemMatch': {'locale': locale, 'name': word }} })
            for doc in docs:
                return normalize_bson_to_json(doc)
            return None
        except Exception as e:
            log_exception("db connection exception ",  AppContext.getContext(), e)
            return None