from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
import src.utilities.app_context as app_context
import config

def process_incoming_request(app_context, request_params) :
    try:
        log_info(request_params, app_context.application_context)
    except Exception as e:
        log_exception("Error occured during google vision document digitization",  app_context.application_context, e)
        return None

    return app_context.application_context
