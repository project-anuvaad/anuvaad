import config
from models import WordModel
import datetime
import uuid
from utilities import AppContext
from anuvaad_auditor.loghandler import log_info, log_exception

class WordRepo:
    def __init__(self):
        self.wordModel   = WordModel()

    def store(self, words):
        log_info('attempting to store ({}), words'.format(len(words)), AppContext.getContext())
        result = self.wordModel.save(words)
        return result

    def search_english(self, word, target_locale):
        log_info('attempting to search ({}), source word'.format(word), AppContext.getContext())
        result = self.wordModel.search_source(word, target_locale)
        return result

    def search_vernacular(self, word, locale):
        log_info('attempting to search ({}), target word in locale ({})'.format(word, locale), AppContext.getContext())
        result = self.wordModel.search_target(word, locale)
        if result:
            result['parallel_words'].append({"locale": "en","name": result["name"],"pos": []})
        return result

    def search(self, src_word, src_locale, tgt_locale):
        log_info('attempting to search ({},{}), target locale ({})'.format(src_word, src_locale, tgt_locale), AppContext.getContext())
        result = self.wordModel.search_word(src_word, src_locale, tgt_locale)
        return result

    def update(self, source_word, src_locale, target_word, target_locale):
        word        = {
            'name': source_word,
            'locale': src_locale,
            'pos': [],
            'parallel_words': [{
                'name': target_word,
                'locale': target_locale,
                'pos': []
            }]
        }

    
        result = self.wordModel.search_source_word(source_word)
        if result == None:
            update_result = self.wordModel.update_word(word)
            return word
        else:
            result['parallel_words'].append({
                'name': target_word,
                'locale': target_locale,
                'pos': []
            })
            word['parallel_words'] = result['parallel_words']
            update_result = self.wordModel.update_word(word)
            
        return word