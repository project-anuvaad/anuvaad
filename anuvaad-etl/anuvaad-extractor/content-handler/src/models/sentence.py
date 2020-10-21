from utilities import AppContext
from db import get_db
from anuvaad_auditor.loghandler import log_info, log_exception

DB_SCHEMA_NAME  = 'file_content'

class SentenceModel(object):

    def get_block_by_s_id(self, user_id, s_id):
        try:
            collections = get_db()[DB_SCHEMA_NAME]
            docs         = collections.find({'$and': [{'created_by': user_id}, { 'data.tokenized_sentences': {'$elemMatch': {'s_id': {'$eq': s_id}}}}]})
            for doc in docs:
                return doc
            return None
        except Exception as e:
            log_exception("db connection exception ",  AppContext.getContext(), e)
            return None
        
    def get_sentence_by_s_id(self, user_id, s_id):
        try:
            collections = get_db()[DB_SCHEMA_NAME]
            docs        = collections.aggregate([
                    { '$match': {'data.tokenized_sentences.s_id' : s_id } },
                    { '$project': {
                        'tokenized_sentences': {
                            '$filter': {
                                'input': '$data.tokenized_sentences',
                                'as': 'ts',
                                'cond': { '$eq': ['$$ts.s_id', s_id] }
                                }
                            }
                        }
                    }
                ])
            
            for doc in docs:
                sentence = doc['tokenized_sentences'][0]
                if 's0_tgt' not in list(sentence.keys()):
                    sentence['s0_tgt'] = sentence['tgt']
                if 's0_src' not in list(sentence.keys()):
                    sentence['s0_src'] = sentence['src']
                return sentence

            return None
        except Exception as e:
            log_exception("db connection exception ",  AppContext.getContext(), e)
            return None

    def update_sentence_by_s_id(self, user_id, sentence):
        SENTENCE_KEYS   = ['n_id', 'pred_score', 's_id', 'src', 'tgt']
        try:
            collections     = get_db()[DB_SCHEMA_NAME]

            results         = collections.update({'$and': [{'created_by': user_id}, { 'data.tokenized_sentences': {'$elemMatch': {'s_id': {'$eq': sentence['s_id']}}}}]},
                                                {
                                                    '$set':
                                                    {
                                                        "data.tokenized_sentences.$.n_id" : sentence['n_id'],
                                                        "data.tokenized_sentences.$.src"  : sentence['src'],
                                                        "data.tokenized_sentences.$.tgt"  : sentence['tgt'],
                                                        "data.tokenized_sentences.$.save" : sentence['save'],
                                                    }
                                                }, upsert=False)

            if 'writeError' in list(results.keys()):
                return False
            return True        
        except Exception as e:
            log_exception("db connection exception ",  AppContext.getContext(), e)
            return False

    def get_total_tokenized_sentences_count(self, record_id):
        try:
            collections = get_db()[DB_SCHEMA_NAME]
            docs        = collections.aggregate([
                                { '$match': {'$and': [{"record_id": record_id}, {'data_type':'text_blocks'} ]} },
                                { '$project': { '_id': 0, 'count': { '$size':"$data.tokenized_sentences" } } },
                                { '$group': { '_id': 0, 'total_count': { '$sum': 1 } } }
                        ])
            for doc in docs:
                count = doc['total_count']
                return count
            return None
        except Exception as e:
            log_exception("db connection exception ",  AppContext.getContext(), e)
            return False

    def get_completed_tokenized_sentences_count(self, record_id):
        try:
            collections = get_db()[DB_SCHEMA_NAME]
            docs        = collections.aggregate([
                                { '$match': {'$and': [{"record_id": record_id}, {'data_type':'text_blocks'}, { 'data.tokenized_sentences': {'$elemMatch': {'save': {'$eq': True}}}}]} },
                                { '$project': { '_id': 0, 'count': { '$size':"$data.tokenized_sentences" } } },
                                { '$group': { '_id': 0, 'total_count': { '$sum': 1 } } }
                        ])
            for doc in docs:
                count = doc['total_count']
                return count
            return None
        except Exception as e:
            log_exception("db connection exception ",  AppContext.getContext(), e)
            return False