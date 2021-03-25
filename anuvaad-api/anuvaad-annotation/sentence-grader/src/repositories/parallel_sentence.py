import config
import datetime
import os

from .parse_csv import ParseCSV
from .parse_xls import ParseXLS
from src.models import ParallelSentenceModel
from src.utilities.app_context import LOG_WITHOUT_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception

class ParallelSentenceRepo(object):
    def __init__(self):
        self.parallelSentenceModel  = ParallelSentenceModel()
    
    def store(self, source_lang, target_lang, jobId, annotationType, users, fileInfo):
        parallel_sentences  = []
        filepath            = os.path.join(os.curdir, config.download_folder, fileInfo['identifier'])

        try:
            parallel_sentences = ParseCSV.get_parallel_sentences(filepath, source_lang, target_lang)
        except Exception as e:
            log_exception("exception encountered while reading CSV, trying with XLS ",  LOG_WITHOUT_CONTEXT, e)

            try:
                parallel_sentences = ParseXLS.get_parallel_sentences(filepath, source_lang, target_lang)
            except Exception as e:
                log_exception("exception encountered while reading XLS, won't try now ",  LOG_WITHOUT_CONTEXT, e)
                return False

        log_info('received parallel sentences [%d], proceeding with storage'%(len(parallel_sentences)), LOG_WITHOUT_CONTEXT)

        tasks = []
        for user in users:
            task                    = {}
            task['user']            = user
            task['fileInfo']        = fileInfo
            task['jobId']           = jobId
            task['annotations']     = parallel_sentences
            tasks.append(task)

        try:
            log_info('creating tasks for the supplied users', LOG_WITHOUT_CONTEXT)
            self.parallelSentenceModel.store_bulk(tasks)
        except Exception as e:
            log_exception("exception encountered while creating tasks for users",  LOG_WITHOUT_CONTEXT, e)
            return False

        log_info('created tasks for the supplied users, successfully', LOG_WITHOUT_CONTEXT)
        return True

        
