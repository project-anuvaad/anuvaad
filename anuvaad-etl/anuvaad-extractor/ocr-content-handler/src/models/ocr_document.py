from utilities import AppContext
from db import get_db
from anuvaad_auditor.loghandler import log_info, log_exception
import json
import pymongo

DB_SCHEMA_NAME = 'ocr_document'

class DigitalDocumentModel(object):

    def __init__(self):
        collections = get_db()[DB_SCHEMA_NAME]
        try:
            collections.create_index('recordID')
        except pymongo.errors.DuplicateKeyError as e:
            log_info("duplicate key, ignoring", AppContext.getContext())
        except Exception as e:
            log_exception("db connection exception ",  AppContext.getContext(), e)

    def store_bulk_blocks(self, blocks):
        try:
            collections = get_db()[DB_SCHEMA_NAME]
            results     = collections.insert_many(blocks)
            if len(blocks) == len(results.inserted_ids):
                return True
        except Exception as e:
            log_exception("Exception on save document | DigitalDocumentModel :{}".format(str(e)), AppContext.getContext(), e)
            return False

    
    def get_word_region(self,user_id,record_id,region_id,page):
        try:
            collections = get_db()[DB_SCHEMA_NAME]
            docs        = collections.aggregate([{ '$match':{'userID':user_id,'recordID':record_id,'page_info.page_no':page}},
                                        {'$project': {
                                                'wordRegions': {
                                                   '$filter': {
                                                    'input': "$regions",
                                                    'as': "reg",
                                                    'cond': { '$eq': [ '$$reg.identifier', region_id] }
                                              }},'_id':0}}])
            
            # regions = []                                 
            for doc in docs:
                if len(doc['wordRegions'])==1:
                    region = doc['wordRegions'][0]
                    return region
                else:
                    pass

        except Exception as e:
            # print(e,"***********")
            log_exception("Exception on fetching word to update | DigitalDocumentModel :{}".format(str(e)),  AppContext.getContext(), e)
            return None
        
    def update_word(self,user_id,record_id,region_id,region_to_update,page):
        try:
            collections = get_db()[DB_SCHEMA_NAME]

            docs=collections.update({ 'userID': user_id,'recordID': record_id,'page_info.page_no':page },
                                    { '$pull': { 'regions': { 'identifier': region_id } } })

            docs= collections.update({ 'userID': user_id,'recordID': record_id,'page_info.page_no':page },
                                      { '$push': { 'regions': region_to_update } })

        except Exception as e:
            log_exception("Exception on word update | DigitalDocumentModel :{}".format(str(e)),  AppContext.getContext(), e)
            return None

    def get_record_by_page(self, record_id, page_number):
        try:
            collections = get_db()[DB_SCHEMA_NAME]
            results        = collections.aggregate([
                                { '$match' : {'recordID': record_id,'page_info.page_no': page_number} },
                                { '$project' : { '_id': 0}} ])
            for doc in results:
                return doc
        except Exception as e:
            AppContext.addRecordID(record_id)
            log_exception("Exception on fetching record by page | DigitalDocumentModel :{}".format(str(e)) , AppContext.getContext(), e)
            return False
        
    

    def get_document_total_page_count(self, record_id):
        try:
            collections = get_db()[DB_SCHEMA_NAME]
            results     = collections.aggregate([ { '$match' : { 'recordID': record_id } },
                                                    {'$group':{'_id': '$recordID',
                                                                'page_count': { '$max': "$page_info.page_no" }}}])
            for doc in results:
                count=doc['page_count']
                return count
        except Exception as e:
            log_exception("Exception on fetching page count | DigitalDocumentModel :{}".format(str(e)) , AppContext.getContext(), e)
            return 0
