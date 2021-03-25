from src.utilities.app_context import LOG_WITHOUT_CONTEXT
from src.utilities.pymongo_data_handling import normalize_bson_to_json

from src.db import get_db
from anuvaad_auditor.loghandler import log_info, log_exception
import pymongo

DB_SCHEMA_NAME  = 'parallel_sentence'

class ParallelSentenceModel(object):
    def __init__(self):
        collections = get_db()[DB_SCHEMA_NAME]
        try:
            collections.create_index('userId')
        except pymongo.errors.DuplicateKeyError as e:
            log_info("duplicate key, ignoring", LOG_WITHOUT_CONTEXT)
        except Exception as e:
            log_exception("db connection exception ",  LOG_WITHOUT_CONTEXT, e)

    def store_bulk(self, tasks):
        try:
            collections = get_db()[DB_SCHEMA_NAME]
            results     = collections.insert_many(tasks)
            if len(tasks) == len(results.inserted_ids):
                return True
        except Exception as e:
            log_exception("db connection exception ",  LOG_WITHOUT_CONTEXT, e)
            return False

    def search_task_type(self, annotationType):
        try:
            collections     = get_db()[DB_SCHEMA_NAME]
            docs            = collections.find({'annotationType': annotationType})
            updated_docs    = []
            for doc in docs:
                del doc['annotations']
                updated_docs.append(normalize_bson_to_json(doc))
            return updated_docs
        except Exception as e:
            log_exception("db connection exception ",  LOG_WITHOUT_CONTEXT, e)
            return updated_docs
    
    def search_user_task(self, userId):
        try:
            collections     = get_db()[DB_SCHEMA_NAME]
            docs            = collections.find({'user.userId': userId})
            updated_docs    = []
            for doc in docs:
                del doc['annotations']
                updated_docs.append(normalize_bson_to_json(doc))
            return updated_docs
        except Exception as e:
            log_exception("db connection exception ",  LOG_WITHOUT_CONTEXT, e)
            return updated_docs

    def search_taskId_annotations(self, taskId):
        try:
            collections     = get_db()[DB_SCHEMA_NAME]
            docs            = collections.find({'taskId': taskId})
            updated_docs    = []
            for doc in docs:
                updated_docs.append(normalize_bson_to_json(doc)['annotations'])
            return updated_docs
        except Exception as e:
            log_exception("db connection exception ",  LOG_WITHOUT_CONTEXT, e)
            return updated_docs

    def save_annotation(self, annotation):
        try:
            collections = get_db()[DB_SCHEMA_NAME]
            results     = collections.update({ 'annotations': {'$elemMatch': {'annotationId': {'$eq': annotation['annotationId']}}}},
            { 
                '$set': 
                {
                    'annotations.$.saved' : annotation['saved'],
                    'annotations.$.score' : annotation['score']
                } 
            }, upsert=True)

            if 'writeError' in list(results.keys()):
                return False
            return True

        except Exception as e:
            log_exception("db connection exception ",  AppContext.getContext(), e)
            return False