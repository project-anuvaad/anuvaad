import config
import json
from models import SentenceModel

class SentenceRepositories:
    @staticmethod
    def get_sentence(user_id, s_id):
        sentence = SentenceModel.get_sentence_by_s_id(user_id, s_id)
        if sentence == None:
            return False
        return sentence
        
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