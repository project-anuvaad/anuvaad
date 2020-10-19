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

    def search_english(self, word):
        log_info('attempting to search ({}), source word'.format(word), AppContext.getContext())
        result = self.wordModel.search_source(word)
        return result

    def search_vernacular(self, word, locale):
        log_info('attempting to search ({}), target word in locale ({})'.format(word, locale), AppContext.getContext())
        result = self.wordModel.search_target(word, locale)
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
            'examples': [],
            'parallel_words': [{
                'name': target_word,
                'locale': target_locale,
                'pos': [],
                'examples': [],
            }]
        }
        result = self.wordModel.update_word(word)
        if result == True:
            result = self.search_english(source_word)
        return result