import config
import json
from models import SentenceModel
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception

class SentenceRepositories:
    @staticmethod
    def get_sentence(user_id, s_ids):
        sentences = []
        for s_id in s_ids:
            sentence = SentenceModel.get_sentence_by_s_id(user_id, s_id)
            if sentence == None:
                log_info('could not get sentence for s_id {}'.format(s_id), MODULE_CONTEXT)
                return False
            sentences.append(sentence)
        if sentence == None:
            return False
        return sentences
        
    @staticmethod
    def update_sentences(user_id, sentences):
        for sentence in sentences:
            if SentenceModel.update_sentence_by_s_id(user_id, sentence) == False:
                return False
        return True

    @staticmethod
    def get_sentence_block(user_id, s_id):
        result = SentenceModel.get_block_by_s_id(user_id, s_id)
        del result['_id']
        del result['created_on']
        return result