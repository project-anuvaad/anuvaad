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

    def search_task_type(self, annotationType, jobId):
        updated_docs    = []
        try:
            collections     = get_db()[DB_SCHEMA_NAME]
            docs            = collections.find({'annotationType': annotationType, 'jobId': jobId})
            for doc in docs:
                try:
                    doc['src_locale'] = doc['annotations'][0]["source"]["language"]
                    doc['tgt_locale'] = doc['annotations'][0]["target"]["language"]
                except Exception as e:
                    log_exception("Exception on annotation job search",  LOG_WITHOUT_CONTEXT, e)
                    doc['src_locale'] = None
                    doc['tgt_locale'] = None
                    pass

                del doc['annotations']
                updated_docs.append(normalize_bson_to_json(doc))
            return updated_docs
        except Exception as e:
            log_exception("db connection exception ",  LOG_WITHOUT_CONTEXT, e)
            return updated_docs
    
    def search_user_task(self, userId):
        updated_docs    = []
    
        try:
            collections     = get_db()[DB_SCHEMA_NAME]
            docs            = collections.find({'user.userId': userId})
            for doc in docs:
                try:
                    doc['src_locale'] = doc['annotations'][0]["source"]["language"]
                    doc['tgt_locale'] = doc['annotations'][0]["target"]["language"]
                except Exception as e:
                    log_exception("Exception on user task search",  LOG_WITHOUT_CONTEXT, e)
                    doc['src_locale'] = None
                    doc['tgt_locale'] = None
                    pass

                del doc['annotations']
                updated_docs.append(normalize_bson_to_json(doc))
            return updated_docs
        except Exception as e:
            log_exception("db connection exception ",  LOG_WITHOUT_CONTEXT, e)
            return updated_docs

    def search_taskId_annotations(self, taskId):
        updated_docs    = []

        try:
            collections     = get_db()[DB_SCHEMA_NAME]
            docs            = collections.find({'taskId': taskId})
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
            log_exception("db connection exception ",  LOG_WITHOUT_CONTEXT, e)
            return False

    def search_annotation(self, annotationId):
        updated_docs    = []
        try:
            collections     = get_db()[DB_SCHEMA_NAME]
            docs            = collections.find({'annotations': {'$elemMatch': {'annotationId': {'$eq': annotationId}}}}, {"annotations.$" : 1})
            for doc in docs:
                updated_docs.append(normalize_bson_to_json(doc))
            return updated_docs
        except Exception as e:
            log_exception("db connection exception ",  LOG_WITHOUT_CONTEXT, e)
            return updated_docs

    def get_annotation_stats(self,taskId,code):
        empty_sent_count     = 0
        saved_sent_count     = 0
        unsaved_sent_count   = 0

        if code == 0:
            val =  "user.userId"
        if code == 1:
            val =  "jobId"
        if code == 2:
            val =  "taskId"
        tasks = []

        try:
            collections     = get_db()[DB_SCHEMA_NAME]

            docs            =  collections.aggregate([{ "$match":{ val: taskId }},{ "$unwind": "$annotations" },
                                                      { "$group": {"_id": {"task": "$taskId","status": "$annotations.saved"},
                                                        "sentCount": { "$sum": 1 }}},
                                                      { "$group": {"_id": "$_id.task","sentStats": {"$push": { 
                                                        "status":"$_id.status","count": "$sentCount"},},
                                                        "count": { "$sum": "$sentCount" }}}])
            for doc in docs:
                count                       =  {}
                count["taskId"]             =  doc["_id"]
                count["total_sentences"]    =  doc["count"]
                count["saved_sentences"]    =  0
                for data in doc["sentStats"]:
                    if "status" in data and data["status"]== True:
                        count["saved_sentences"]    =   data["count"]

                tasks.append(count)

            return tasks
        except Exception as e:
            log_exception("db connection exception ",  LOG_WITHOUT_CONTEXT, e)
            return [
                {
                    "taskId"         : None,
                    "total_sentences": 0,
                    "saved_sentences": 0
                }
            ]
