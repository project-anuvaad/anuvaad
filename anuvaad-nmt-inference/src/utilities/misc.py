import re
from anuvaad_auditor.loghandler import log_info, log_exception
from utilities import MODULE_CONTEXT
from dateutil.parser import parse
import json
import config
from config.regex_patterns import patterns, digit_dict

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
      log_exception("overflow error while parsing date, treating them as Date tag{}".format(token),MODULE_CONTEXT,"OverFlowError")
      return True     
    except Exception as e:
      log_exception("error in date parsing for token:{} ".format(token),MODULE_CONTEXT,e)
      return False    

def token_is_url(token):
  try:
    url_pattern = patterns['p13']['regex']
    url = re.findall(url_pattern,token)
    if len(url)>0:
      return True
    else:
      return False  
  except Exception as e:
    return False

def token_is_email(token):
  try:
    email_pattern = patterns['p14']['regex']
    email = re.findall(email_pattern,token)
    if len(email)>0:
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

def get_src_tgt_langauge(model_id):
  '''
  Returns source and target language 
  '''
  try:
    #log_info("Inside get_src_tgt_langauge",MODULE_CONTEXT)
    
    all_models_dict_file = config.ICONFG_FILE
    with open(all_models_dict_file,'r') as f:
      all_models_dict = json.load(f)["models"]

    for model_dict in all_models_dict:
      if model_dict["id"] == model_id:
        model = model_dict
        break
    
    return model["source_language_code"], model["target_language_code"] 

  except Exception as e:
    log_exception("Error in source language checker: {}".format(e),MODULE_CONTEXT,e)
    return None, None

def get_language_stop_puncs(language):
  '''
  Gets the sentence ending punctuation list given the language
  '''
  try:
    #log_info("Inside get_language_stop_puncs",MODULE_CONTEXT)
    if language in ['hi','bn']:
      return ["।","?","!",":",";","."]
    else:
      return [".","?","!",":",";","।"]

  except Exception as e:
    log_exception("Error in get_language_stop_puncs: {}".format(e),MODULE_CONTEXT,e)
    return ["."]

def is_sentence_wo_stop(sentence,stop_puncs):
  '''
  Checks whether the sentence does not have a 
  sentence ending punctuation
  '''
  try:
    #log_info("Inside is_sentence_wo_stop",MODULE_CONTEXT)
    if sentence and (sentence[-1] in stop_puncs):
      return False
    else:
      return True

  except Exception as e:
    log_exception("Error in is_sentence_wo_stop: {}".format(e),MODULE_CONTEXT,e)
    return False

def add_stop_punc(sentence,stop_punc):
  '''
  Adds punctuation at the end of the sentence
  '''
  try:
    #log_info("Inside add_stop_punc",MODULE_CONTEXT)
    return sentence + stop_punc

  except Exception as e:
    log_exception("Error in add_stop_punc: {}".format(e),MODULE_CONTEXT,e)
    return sentence

def remove_stop_punc(sentence,stop_puncs):
  '''
  Removes the puncuation at the end of the sentence
  '''
  try:
    #log_info("Inside remove_stop_punc",MODULE_CONTEXT)
    if sentence and (sentence[-1] in stop_puncs):
      return sentence[:-1]
    else:
      return sentence

  except Exception as e:
    log_exception("Error in remove_stop_punc: {}".format(e),MODULE_CONTEXT,e)
    return sentence

def convert_digits_preprocess(language, sentence):
  '''
  converts digits in the sentence from given language to roman.
  used in the preprocessing pipeline
  '''
  try:
    indic_dict = list(digit_dict.keys())
    if language == "en":
      return sentence
    elif language in indic_dict:
      return sub_indic_digits_w_roman(language, sentence)
    else:
      return sentence
  
  except Exception as e:
    log_exception("Error in convert_digits_preprocess: {}".format(e),MODULE_CONTEXT,e)
    return sentence

def convert_digits_postprocess(language, sentence):
  '''
  converts digits in the sentence from roman given language.
  used in the postprocessing pipeline
  '''
  try:
    indic_dict = list(digit_dict.keys())
    if language == "en":
      return sentence
    elif language in indic_dict:
      return sub_roman_digits_w_indic(language, sentence)
    else:
      return sentence

  except Exception as e:
    log_exception("Error in convert_digits_postprocess: {}".format(e),MODULE_CONTEXT,e)
    return sentence


def sub_roman_digits_w_indic(language,sentence):
  '''
  Substitutes roman digits with indic digits in the sentence
  given the indic language
  '''
  try:
    #log_info("Inside sub_roman_digits_w_indic",MODULE_CONTEXT)
    roman_to_indic_digits_map = digit_dict[language]
    roman_digits_in_sentence = re.findall(r'[0-9]', sentence)
    for roman_digit in roman_digits_in_sentence:
      indic_digit = roman_to_indic_digits_map[roman_digit]
      sentence = re.sub(roman_digit, indic_digit, sentence)

    return sentence

  except Exception as e:
    log_exception("Error in sub_roman_digits_w_indic: {}".format(e),MODULE_CONTEXT,e)
    return sentence

def sub_indic_digits_w_roman(language,sentence):
  '''
  Substitutes indic digits with roman digits in the sentence
  given the indic language
  '''
  try:
    #log_info("Inside sub_indic_digits_w_roman",MODULE_CONTEXT)
    roman_to_indic_digits_map = digit_dict[language]
    indic_to_roman_digits_map = {v: k for k, v in roman_to_indic_digits_map.items()}
    indic_digits = list(indic_to_roman_digits_map.keys())
    indic_digits_in_sentence = [item for item in sentence if item in indic_digits]
    for indic_digit in indic_digits_in_sentence:
      roman_digit = indic_to_roman_digits_map[indic_digit]
      sentence = re.sub(indic_digit, roman_digit, sentence)

    return sentence

  except Exception as e:
    log_exception("Error in sub_indic_digits_w_roman: {}".format(e),MODULE_CONTEXT,e)
    return sentence 
