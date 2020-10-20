import config
import json
from models import SentenceModel
from utilities import AppContext
from anuvaad_auditor.loghandler import log_info, log_exception

class SentenceRepositories:
    def __init__(self):
        self.sentenceModel  = SentenceModel()

    def get_sentence(self, user_id, s_ids):
        sentences = []
        for s_id in s_ids:
            sentence = self.sentenceModel.get_sentence_by_s_id(user_id, s_id)
            if sentence == None:
                log_info('could not get sentence for s_id {}'.format(s_id), AppContext.getContext())
                continue
            sentences.append(sentence)

        return sentences
        
    def update_sentences(self, user_id, sentences, workflowCode):
        update_s0       = False
        '''
            - workflowCode: 
            - DP_WFLOW_S_TR and DP_WFLOW_S_TTR, changes the sentence structure hence s0 pair needs to be updated
            - DP_WFLOW_S_C, doesn't changes the sentence structure hence no need to update the s0 pair
        '''
        if workflowCode == 'DP_WFLOW_S_TR' or workflowCode == 'DP_WFLOW_S_TTR':
            update_s0 = True

        for sentence in sentences:
            if update_s0:
                sentence['s0_tgt']    = sentence['tgt']
                sentence['s0_src']    = sentence['src']

            if self.sentenceModel.update_sentence_by_s_id(user_id, sentence) == False:
                return False
        return True

    def get_sentence_block(self, user_id, s_id):
        result = self.sentenceModel.get_block_by_s_id(user_id, s_id)
        del result['_id']
        del result['created_on']
        return result

    def get_sentences_counts(self, record_ids):
        response = []
        for record_id in record_ids:
            result          = {}
            
            total_count     = self.sentenceModel.get_total_tokenized_sentences_count(record_id)
            completed_count = self.sentenceModel.get_completed_tokenized_sentences_count(record_id)

            if total_count == None:
                result['total_count'] = 0
            else:
                result['total_count'] = total_count

            if total_count == None:
                result['completed_count'] = 0
            else:
                result['completed_count'] = completed_count

            result['record_id'] = record_id
            response.append(result)
        return response
