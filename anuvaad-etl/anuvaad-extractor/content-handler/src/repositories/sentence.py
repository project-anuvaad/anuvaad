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
            count_result    = self.sentenceModel.get_tokenized_sentences_count_status(record_id)
            
            result['total_count']       = count_result['total']
            result['completed_count']   = count_result['completed']
            result['record_id']         = record_id
            response.append(result)
        return response
