from utilities import AppContext, normalize_bson_to_json
from db import get_db
import pymongo
from anuvaad_auditor.loghandler import log_info, log_exception

DB_SCHEMA_NAME  = 'dict_v1'

class WordModel(object):
    def __init__(self):
        collections = get_db()[DB_SCHEMA_NAME]
        try:
            collections.create_index('name', unique = True)
        except pymongo.errors.DuplicateKeyError as e:
            log_info("duplicate key, ignoring", AppContext.getContext())
        except Exception as e:
            log_exception("db connection exception ",  AppContext.getContext(), e)

    def save(self, words):
        try:
            collections = get_db()[DB_SCHEMA_NAME]
            # results     = collections.insert_many(words, ordered=False)
            # if len(words) == len(results.inserted_ids):
            #     log_info("stored {} words".format(str(len(results.inserted_ids))),  AppContext.getContext())
            #     return True

            for word in words:
                results=collections.update({'name': word['name']}, 
                                            {
                                                '$set': word
                                            },
                                            upsert=True
            )
            if 'writeError' in list(results.keys()):
                return False
            return True 

            
        except pymongo.errors.BulkWriteError as e:
            log_info("some of the record has duplicates ",  AppContext.getContext())
            return True
        except Exception as e:
            log_exception("db connection exception :{}".format(str(e)),  AppContext.getContext(), e)
            return False

    def update_word(self, word):
        try:
            collections = get_db()[DB_SCHEMA_NAME]
            results     = collections.update({'name': word['name']}, 
                                            {
                                                '$set': word
                                            },
                                            upsert=True
            )
            if 'writeError' in list(results.keys()):
                return False
            return True 

        except pymongo.errors.WriteError as e:
            log_info("some of the record has duplicates ",  AppContext.getContext())
            log_exception("update_word : exception ",  AppContext.getContext(), e)
            return True
        except Exception as e:
            log_exception("db connection exception ",  AppContext.getContext(), e)
            return False

    def search_source_word(self, word):
        try:
            collections = get_db()[DB_SCHEMA_NAME]
            docs         = collections.find({'name': word})
            for doc in docs:
                return normalize_bson_to_json(doc)
            return None
        except Exception as e:
            log_exception("db connection exception ",  AppContext.getContext(), e)
            return None
    
    def search_source(self, word, target_locale):
        try:
            collections = get_db()[DB_SCHEMA_NAME]
            docs        = collections.find({'name': word,'parallel_words': { '$elemMatch': {'locale': target_locale }}})
            # collections.find({'$and': [{'name': word}, {'parallel_words': { '$elemMatch': {'locale': target_locale }} }]})
            for doc in docs:
                return normalize_bson_to_json(doc)
            return None
        except Exception as e:
            log_exception("db connection exception ",  AppContext.getContext(), e)
            return None

    def search_target(self, word, locale):
        try:
            collections = get_db()[DB_SCHEMA_NAME]
            docs         = collections.find({'parallel_words': { '$elemMatch': {'locale': locale, 'name': word }}})
            # collections.find({'parallel_words': { '$elemMatch': {'locale': locale, 'name': word }} })
            for doc in docs:
                return normalize_bson_to_json(doc)
            return None
        except Exception as e:
            log_exception("db connection exception :{}".format(str(e)),  AppContext.getContext(), e)
            return None

    def search_word(self, src_word, src_locale, tgt_locale):
        try:
            collections = get_db()[DB_SCHEMA_NAME]
            docs         = collections.find({'$or': [
                                                        {'$and': [{'name': src_word, 'locale': src_locale}, {'parallel_words': { '$elemMatch': {'locale': tgt_locale}}}]}, 
                                                        {'$and': [{'locale': tgt_locale}, {'parallel_words': { '$elemMatch': {'locale': src_locale, 'name': src_word }}}]}
                                                    ]
                                            })

            for doc in docs:
                return normalize_bson_to_json(doc)
            return None
        except Exception as e:
            log_exception("db connection exception ",  AppContext.getContext(), e)
            return None