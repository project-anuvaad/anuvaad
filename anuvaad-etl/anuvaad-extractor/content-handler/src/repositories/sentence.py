import json
import hashlib
from models import SentenceModel
from utilities import AppContext
from anuvaad_auditor.loghandler import log_info, log_exception
from utilities import AppContext
import time
class SentenceRepositories:
    def __init__(self):
        self.sentenceModel  = SentenceModel()

    def get_sentence(self, user_id, sentences):
        result_sentences = []
        for sent in sentences:
            sentence = self.sentenceModel.get_sentence_by_s_id(user_id, sent["record_id"], sent["block_identifier"], sent["s_id"])
            if sentence == None:
                log_info('could not get sentence for s_id {}'.format(sent["s_id"]), AppContext.getContext())
                continue
            result_sentences.append(sentence)

        return result_sentences
        
    def update_sentences(self, user_id, sentences, workflowCode):
        update_s0       = False
        '''
            - workflowCode: 
            - WF_S_TR and WF_S_TKTR, changes the sentence structure hence s0 pair needs to be updated
            - DP_WFLOW_S_C, doesn't changes the sentence structure hence no need to update the s0 pair
        '''
        if workflowCode is not None and (workflowCode == 'WF_S_TR' or workflowCode == 'WF_S_TKTR'):
            update_s0 = True

        for sentence in sentences:
            if update_s0:
                sentence['s0_tgt']    = sentence['tgt']
                sentence['s0_src']    = sentence['src']
            if 'save' not in sentence:
                sentence['save'] = False

            if 'bleu_score' not in sentence:
                sentence['bleu_score'] = 0

            if 'time_spent_ms' not in sentence:
                sentence['time_spent_ms'] = 0
            
            if 'rating_score' not in sentence:
                sentence['rating_score'] =None

            n_id_splits = sentence['n_id'].split('|')
            record_id   = n_id_splits[0]+'|'+ n_id_splits[1]
            # sentence['record_id'] = record_id

            AppContext.addRecordID(record_id)
            log_info("SaveSentenceRepo -saving sentence blocks", AppContext.getContext())

            if self.sentenceModel.update_sentence_by_s_id(record_id,user_id, sentence) == False:
                return False
        return True

    def get_sentence_block(self, user_id, s_id):
        result = self.sentenceModel.get_block_by_s_id(user_id, s_id)
        del result['_id']
        del result['created_on']
        return result

    def get_sentences_counts(self, record_ids,bleu_return):
        response = []
        for record_id in record_ids:
            result          = {}
            count_result    = self.sentenceModel.get_tokenized_sentences_count_status(record_id,bleu_return)
            
            result['total_sentence_count']       = count_result['total_sentences']
            result['completed_sentence_count']   = count_result['completed_sentences']
            result['total_word_count']       = count_result['total_words']
            result['completed_word_count']   = count_result['completed_words']
            result['avg_bleu_score']         = count_result['avg_bleu_score']
            result['total_time_spent_ms']    = count_result['total_time_spent_ms']
            result['record_id']         = record_id
            response.append(result)
        return response


    def save_sentences(self,user_id, sentences):
        # Creates a md5 hash values using userID and src
        try:
            
            for sent in sentences:
                if sent['bleu_score'] != 1:
                    log_info("bleu_score is 1 skippig utm save", AppContext.getContext())
                else:
                    sent["timestamp"]= eval(str(time.time()).replace('.', '')[0:13])
                    locale=sent["src_lang"]+"|"+sent["tgt_lang"]
                    sentence_hash= user_id + "___" + sent["src"]+"___"+locale
                    sent_key=hashlib.sha256(sentence_hash.encode('utf_16')).hexdigest()
                    save_result= self.sentenceModel.save_sentences_on_hashkey(sent_key,sent)
                    log_info("Sentences pushed to redis store", AppContext.getContext())
        except Exception as e:
            log_exception("Exception while storing sentence data on redis: " + str(e), AppContext.getContext(), e)
            return None

    def get_sentences_from_store(self,keys):
        data_keys=[]
        for key in keys:
            if "userID" not in key or not key["userID"] or "src" not in key or not key["src"] or "locale" not in key or not key["locale"]:
                return None
            
            log_info("Fetching sentences from redis store for userID:{} | src:{}".format(key["userID"],key["src"]), AppContext.getContext())
            sentence_hash= key["userID"] + "___" + key["src"]+ "___"+key["locale"]
            sent_key =hashlib.sha256(sentence_hash.encode('utf_16')).hexdigest()
            data_keys.append(sent_key)
        try:
            result=self.sentenceModel.get_sentence_by_keys(data_keys)
            return result
        except Exception as e:
            log_exception("Exception while fetching sentences from redis store: " + str(e), AppContext.getContext(), e)
            return None
        

    
