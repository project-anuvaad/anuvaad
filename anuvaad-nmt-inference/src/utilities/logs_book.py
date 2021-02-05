from anuvaad_auditor.loghandler import log_info, log_exception
from utilities import MODULE_CONTEXT

def logs_book(entity,value,message):
  '''
  Captures specific entity to keep track of logs at various level
  '''
  try:
      log_info("{} || {} || {}".format(entity,value,message),MODULE_CONTEXT)
  except Exception as e:
      log_exception("Exception caught in logs_book {}".format(e),MODULE_CONTEXT,e)