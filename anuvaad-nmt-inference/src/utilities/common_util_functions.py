from dateutil.parser import parse
import re

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

