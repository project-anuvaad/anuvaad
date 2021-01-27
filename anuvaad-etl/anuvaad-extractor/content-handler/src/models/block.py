from utilities import AppContext
from db import get_db
from anuvaad_auditor.loghandler import log_info, log_exception
import pymongo

DB_SCHEMA_NAME  = 'file_content'

class BlockModel(object):
    def __init__(self):
        collections = get_db()[DB_SCHEMA_NAME]
        try:
            collections.create_index('record_id')
            collections.create_index('data_type')
        except pymongo.errors.DuplicateKeyError as e:
            log_info("duplicate key, ignoring", AppContext.getContext())
        except Exception as e:
            log_exception("db connection exception ",  AppContext.getContext(), e)
    
    def update_block(self, user_id, block_identifier, block):
        try:
            collections = get_db()[DB_SCHEMA_NAME]
            results     = collections.update({'$and': [{'created_by': user_id}, { 'block_identifier': block_identifier }]},
            { '$set': block }, upsert=True)

            if 'writeError' in list(results.keys()):
                return False
            return True

        except Exception as e:
            log_exception("db connection exception ",  AppContext.getContext(), e)
            return False

    def store_bulk_blocks(self, blocks):
        try:
            collections = get_db()[DB_SCHEMA_NAME]
            results     = collections.insert_many(blocks)
            if len(blocks) == len(results.inserted_ids):
                return True
        except Exception as e:
            log_exception("db connection exception ",  AppContext.getContext(), e)
            return False

    def get_all_blocks(self, user_id, record_id):
        try:
            collections = get_db()[DB_SCHEMA_NAME]
            docs        = collections.find({
                'record_id': record_id,
                'created_by': user_id
            })
            return docs
        except Exception as e:
            log_exception("db connection exception ",  AppContext.getContext(), e)
            return False
        

    def get_blocks_by_page(self, record_id, page_number):
        try:
            collections = get_db()[DB_SCHEMA_NAME]
            results        = collections.aggregate([
                                { '$match' : { 'page_no': page_number, 'record_id': record_id } },
                                { '$group': { '_id': '$data_type', 'data': { '$push': "$data" } } }
                                ])
            return results
        except Exception as e:
            log_exception("db connection exception ",  AppContext.getContext(), e)
            return False

    def get_block_by_block_identifier(self, user_id, block_identifier):
        try:
            collections = get_db()[DB_SCHEMA_NAME]
            results     = collections.aggregate([
                { '$match' : { 'block_identifier': block_identifier, 'created_by': user_id } },
                { '$group': { '_id': '$data_type', 'data': { '$push': "$data" } } }
            ])
            return results
        except Exception as e:
            log_exception('db connection exception ', AppContext.getContext(), e)
            return None

    def get_document_total_page_count(self, record_id):
        try:
            collections = get_db()[DB_SCHEMA_NAME]
            results     = collections.aggregate([
                { '$match' : { 'record_id': record_id } },
                {
                    '$group':
                        {
                            '_id': '$record_id',
                            'page_count': { '$max': "$page_no" }
                        }
                }
            ])

            count = 0
            for result in results:
                count = result['page_count']
                break

            return count
        except Exception as e:
            log_exception("db connection exception ",  AppContext.getContext(), e)
            return 0