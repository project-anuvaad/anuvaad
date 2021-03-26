import config
import datetime
import os
import uuid

from .parse_csv import ParseCSV
from .parse_xls import ParseXLS
from src.models import ParallelSentenceModel
from src.utilities.app_context import LOG_WITHOUT_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception

class ParallelSentenceRepo(object):
    def __init__(self):
        self.parallelSentenceModel  = ParallelSentenceModel()
    
    def store(self, source_lang, target_lang, jobId, annotationType, users, fileInfo, description):
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
            task['description']     = description
            task['user']            = user
            task['fileInfo']        = fileInfo
            task['jobId']           = jobId
            task['taskId']          = str(uuid.uuid4())
            task['annotationType']  = annotationType
            task['annotations']     = parallel_sentences
            task['createdOn']       = datetime.datetime.utcnow()
            tasks.append(task)

        try:
            log_info('creating tasks for the supplied users', LOG_WITHOUT_CONTEXT)
            self.parallelSentenceModel.store_bulk(tasks)
        except Exception as e:
            log_exception("exception encountered while creating tasks for users",  LOG_WITHOUT_CONTEXT, e)
            return False

        log_info('created tasks for the supplied users, successfully', LOG_WITHOUT_CONTEXT)
        return True

    def search_user_task(self, userId):
        results = self.parallelSentenceModel.search_user_task(userId)
        if len(results) == 0:
            return {'tasks': []}
        return {'tasks': results}

    def search_taskIds_annotations(self, taskIds):
        results = []
        for taskId in taskIds:
            task_results = self.search_taskId_annotations(taskId)
            results.append({
                'taskId': taskId,
                'annotations': task_results['annotations']
            })
        return {'tasks': results}

    def search_taskId_annotations(self, taskId):
        results = self.parallelSentenceModel.search_taskId_annotations(taskId)
        if len(results) == 0:
            return {'annotations': []}
        return {'annotations': results}

    def search_tasks_annotationType(self, annotationType, jobId):
        results = self.parallelSentenceModel.search_task_type(annotationType, jobId)
        if len(results) == 0:
            return {'tasks': []}
        return {'tasks': results}

    def save_annotation(self, annotation):
        return self.parallelSentenceModel.save_annotation(annotation)