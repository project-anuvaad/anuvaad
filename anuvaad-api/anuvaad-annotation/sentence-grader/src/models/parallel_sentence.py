from src.utilities.app_context import LOG_WITHOUT_CONTEXT
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
            if len(blocks) == len(results.inserted_ids):
                return True
        except Exception as e:
            log_exception("db connection exception ",  LOG_WITHOUT_CONTEXT, e)
            return False
    