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
        return self.wordModel.save(words)