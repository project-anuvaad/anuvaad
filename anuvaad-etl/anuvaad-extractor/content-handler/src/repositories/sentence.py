from flask import jsonify
import config
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


    def get_sentence_block(s_id):
        pass