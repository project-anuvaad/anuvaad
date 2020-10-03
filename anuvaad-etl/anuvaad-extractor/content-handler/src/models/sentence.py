from db.connection_manager  import get_db

class Sentence(object):

    def get_block_by_s_id(self, s_id):
        collections = get_db()['file_content']
        doc        = collections.find_one({ 'data.tokenized_sentences': {'$elemMatch': {'s_id': {'$eq': s_id}}}})
        if doc == None:
            return False
        return doc

    def get_sentence_by_s_id(self, s_id):
        collections = get_db()['file_content']
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
            return doc['tokenized_sentences'][0]

        return None

    def update_sentence_by_s_id(self, sentence, s_id):
        SENTENCE_KEYS   = ['n_id', 'pred_score', 's_id', 'src', 'tgt']
        shall_update    = True
        collections     = get_db()['file_content']

        for KEY in SENTENCE_KEYS:
            if KEY not in list(sentence.keys()):
                shall_update    = False

        if shall_update == False:
            return False

        docs        = collections.update({ 'data.tokenized_sentences': {'$elemMatch': {'s_id': {'$eq': s_id}}}},
                                            {
                                                '$set':
                                                {
                                                    "data.tokenized_sentences.$.pred_score" : sentence['pred_score'],
                                                    "data.tokenized_sentences.$.n_id" : sentence['n_id'],
                                                    "data.tokenized_sentences.$.s_id" : sentence['s_id'],
                                                    "data.tokenized_sentences.$.src"  : sentence['src'],
                                                    "data.tokenized_sentences.$.tgt"  : sentence['tgt'],
                                                }
                                            }, upsert=False)
        if docs['nModified'] == 1:
            return True

        return False
        
