import config
import datetime
import os
import uuid
import time
from .parse_csv import ParseCSV
from .parse_xls import ParseXLS
from src.models import ParallelSentenceModel
from src.utilities.app_context import LOG_WITHOUT_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception

class ParallelSentenceRepo(object):
    def __init__(self):
        self.parallelSentenceModel  = ParallelSentenceModel()

    def update_parallel_sentences(self, sentences):
        parallel_sentences = []

        for sentence in sentences:
            new_sentence = sentence.copy()
            new_sentence['annotationId'] = str(uuid.uuid4())
            parallel_sentences.append(new_sentence)

        return parallel_sentences
    
    def store(self, source_lang, target_lang, jobId, annotationType, users, fileInfo, description):
        parallel_sentences  = []
        filepath            = os.path.join(os.curdir, config.download_folder, fileInfo['identifier'])
        try:
            parallel_sentences = ParseCSV.get_parallel_sentences(filepath, source_lang, target_lang)
            if not parallel_sentences:
                return False
        except Exception as e:
            LOG_WITHOUT_CONTEXT['jobID']=jobId
            log_exception("exception encountered while reading CSV, trying with XLS ",  LOG_WITHOUT_CONTEXT, e)

            try:
                parallel_sentences = ParseXLS.get_parallel_sentences(filepath, source_lang, target_lang)
                if not parallel_sentences:
                    return False
            except Exception as e:
                LOG_WITHOUT_CONTEXT['jobID']=jobId
                log_exception("exception encountered while reading XLS, won't try now ",  LOG_WITHOUT_CONTEXT, e)
                return False
        LOG_WITHOUT_CONTEXT['jobID']=jobId
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
            task['annotations']     = self.update_parallel_sentences(parallel_sentences)
            task['createdOn']       = eval(str(time.time()).replace('.', '')[0:13])
            tasks.append(task)

        try:
            LOG_WITHOUT_CONTEXT['jobID']=jobId
            log_info('creating tasks for the supplied users', LOG_WITHOUT_CONTEXT)
            if self.parallelSentenceModel.store_bulk(tasks) == True:
                LOG_WITHOUT_CONTEXT['jobID']=jobId
                log_info('created tasks for the supplied users, successfully', LOG_WITHOUT_CONTEXT)
                return True
            else:
                return False
        except Exception as e:
            LOG_WITHOUT_CONTEXT['jobID']=jobId
            log_exception("exception encountered while creating tasks for users",  LOG_WITHOUT_CONTEXT, e)
            return False
        

    def search_user_task(self, userId):
        results = self.parallelSentenceModel.search_user_task(userId)
        annoted_sent_stats = self.parallelSentenceModel.get_annotation_stats(userId,code=0)

        if len(results) == 0:
            return {'tasks': []}
        for result in results:
            for stat in annoted_sent_stats:
                if result["taskId"]==stat["taskId"]:
                    result["saved_sentences"] = stat["saved_sentences"]
                    result["total_sentences"] = stat["total_sentences"]

        return {'tasks': results}

    def search_taskIds_annotations(self, taskIds):
        results = []
        for taskId in taskIds:
            task_results = self.search_taskId_annotations(taskId)
            annoted_sent_stats = self.parallelSentenceModel.get_annotation_stats(taskId,code=2)
            if len(task_results['annotations']) > 0:
                results.append({
                    'taskId': taskId,
                    'annotations': task_results['annotations'][0]
                })
            else:
                results.append({
                    'taskId': taskId,
                    'annotations': task_results['annotations']
                })
                
        for result in results:
            for stat in annoted_sent_stats:
                if result["taskId"]==stat["taskId"]:
                    result["saved_sentences"] = stat["saved_sentences"]
                    result["total_sentences"] = stat["total_sentences"]

        return {'tasks': results}

    def search_taskId_annotations(self, taskId):
        results = self.parallelSentenceModel.search_taskId_annotations(taskId)
        if len(results) == 0:
            return {'annotations': []}
        return {'annotations': results}

    def search_tasks_annotationType(self, annotationType, jobId):
        results = self.parallelSentenceModel.search_task_type(annotationType, jobId)
        annoted_sent_stats = self.parallelSentenceModel.get_annotation_stats(jobId,code=1)

        if len(results) == 0:
            return {'tasks': []}
        for result in results:
            for stat in annoted_sent_stats:
                if result["taskId"]==stat["taskId"]:
                    result["saved_sentences"] = stat["saved_sentences"]
                    result["total_sentences"] = stat["total_sentences"]

        return {'tasks': results}

    def save_annotation(self, annotation):
        if self.parallelSentenceModel.save_annotation(annotation) == True:
            updated_annotation = self.parallelSentenceModel.search_annotation(annotation['annotationId'])
            if len(updated_annotation) > 0:
                return updated_annotation[0]
        return None

    
    