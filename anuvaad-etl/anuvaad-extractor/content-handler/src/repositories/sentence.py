import config
import json
from models import SentenceModel
from utilities import AppContext
from anuvaad_auditor.loghandler import log_info, log_exception

class SentenceRepositories:
    @staticmethod
    def get_sentence(user_id, s_ids):
        sentences = []
        for s_id in s_ids:
            sentence = SentenceModel.get_sentence_by_s_id(user_id, s_id)
            if sentence == None:
                log_info('could not get sentence for s_id {}'.format(s_id), AppContext.getContext())
                continue
            sentences.append(sentence)

        return sentences
        
    @staticmethod
    def update_sentences(user_id, sentences, workflowCode):
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

            if SentenceModel.update_sentence_by_s_id(user_id, sentence) == False:
                return False
        return True

    @staticmethod
    def get_sentence_block(user_id, s_id):
        result = SentenceModel.get_block_by_s_id(user_id, s_id)
        del result['_id']
        del result['created_on']
        return result