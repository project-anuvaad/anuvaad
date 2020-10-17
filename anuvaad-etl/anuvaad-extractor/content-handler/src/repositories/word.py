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