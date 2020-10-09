import re
from anuvaad_auditor.loghandler import log_info, log_exception
from utilities import MODULE_CONTEXT
from dateutil.parser import parse

'''
miscellaneous funtions common across application
'''

def regex_pass(text,regex_list):
  try:
    regex_list = regex_list
    for pattern in regex_list:
      text = re.sub(pattern['regex'],pattern['replacement'],text)

    return text
    
  except Exception as e:
    log_exception("Error in regex_pass: misc.py function:{}".format(e),MODULE_CONTEXT,e)
    return text

def token_is_date(token):
    try: 
        parse(token, fuzzy=False)
        return True

    except ValueError:
        return False
    except OverflowError:
      print("overflow error while parsing date, treating them as Date tag{}".format(token))
      return True     
    except Exception as e:
      print("error in date parsing for token:{} ".format(token),e)
      return False    

def token_is_url(token):
  try:
    url = re.findall(r'http[s]?\s*:\s*/\s*/\s*(?:\s*[a-zA-Z]|[0-9]\s*|[$-_@.&+]|\s*[!*\(\), ]|(?:%[0-9a-fA-F][0-9a-fA-F]\s*))+',token)
    if len(url)>0:
      return True
    else:
      return False  
  except Exception as e:
    return False
  
def isfloat(str):
    try: 
        float(str)
    except ValueError: 
        return False
    return True  