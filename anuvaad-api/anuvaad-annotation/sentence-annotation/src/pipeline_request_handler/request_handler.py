from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
import src.utilities.app_context as app_context
from src.utilities.app_context import LOG_WITHOUT_CONTEXT
from src.utilities.utils import Datautils
from src.repositories import ParallelSentenceRepo
from anuvaad_auditor.errorhandler import post_error_wf

import config

parallelSentenceAnnotationRepo  = ParallelSentenceRepo()

def process_incoming_request(app_context, request_params, jobId, workflowId) :
    try:
        log_info('request received for jobId %s,  workflowId %s' % (jobId,  workflowId), app_context.application_context)
        log_info(request_params, app_context.application_context)

        validity = Datautils.validate_annotation_input(request_params['sourceLanguage'], request_params['targetLanguage'], jobId, request_params['annotationType'], request_params['users'], request_params['fileInfo'])
        if validity is not None:
            LOG_WITHOUT_CONTEXT['jobID']=jobId
            log_info('Missing params in annotation task creation | requestparams:{}'.format(str(request_params)), LOG_WITHOUT_CONTEXT)
            post_error_wf('TASK_CREATION_FAILED','Annotation task creation failed due to missing params', LOG_WITHOUT_CONTEXT,None)
            return None

        create_task = parallelSentenceAnnotationRepo.store(request_params['sourceLanguage'], request_params['targetLanguage'], \
                        jobId, request_params['annotationType'], request_params['users'], request_params['fileInfo'], request_params['description'])
        if create_task == False:
            LOG_WITHOUT_CONTEXT['jobID']=jobId
            log_info('Annotation task creation failed due to file error', LOG_WITHOUT_CONTEXT)
            post_error_wf('TASK_CREATION_FAILED','Annotation task creation failed due to file error', LOG_WITHOUT_CONTEXT,None)
            return None



    except Exception as e:
        log_exception("Exception :  ",  app_context.application_context, e)
        return None

    return app_context.application_context
