from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
import src.utilities.app_context as app_context
from src.repositories import ParallelSentenceRepo

import config

parallelSentenceAnnotationRepo  = ParallelSentenceRepo()

def process_incoming_request(app_context, request_params, jobId, workflowId) :
    try:
        log_info('request received for jobId %s,  workflowId %s' % (jobId,  workflowId), app_context.application_context)
        log_info(request_params, app_context.application_context)
        parallelSentenceAnnotationRepo.store(request_params['sourceLanguage'], request_params['targetLanguage'], \
                jobId, request_params['annotationType'], request_params['users'], request_params['fileInfo'], request_params['description'])

    except Exception as e:
        log_exception("Exception :  ",  app_context.application_context, e)
        return None

    return app_context.application_context
