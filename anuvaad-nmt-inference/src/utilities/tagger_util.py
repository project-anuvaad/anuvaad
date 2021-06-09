import re
import utilities.misc as misc
from config.regex_patterns import patterns, hindi_numbers
from anuvaad_auditor.loghandler import log_info, log_exception
from utilities import MODULE_CONTEXT
import numpy as np

'''
Below funtions are meant to handle date, numbers and URls as part of pre and post translation processing
'''

def tag_number_date_url(text):
  '''
  Tags numbers, dates and url in the input text and returns
  tagged text and the arrays of numbers,dates and urls
  '''
  try: 
    if len(text) == 0:
      return "","","","",""
    
    resultant_str = list()
    count_date = 0
    date_original = list()
    count_url = 0
    url_dict = {}
    
    num_array,text,num_map = build_src_num_array(text)
    #log_info("number-tag mappings-{}".format(num_map),MODULE_CONTEXT)
    for word in text.split():
        try:
          if misc.token_is_url(word) or misc.token_is_email(word):
            url_or_email = word
            word = 'UuRrLl'+str(count_url)
            url_dict[word] = url_or_email
            count_url +=1
        except Exception as e:
          log_exception("In handle_date_url:tag_num function:{}".format(e),MODULE_CONTEXT,e)
          word = word
        
        resultant_str.append(word)   
        s = [str(i) for i in resultant_str] 
        res = str(" ".join(s))   
    #log_info("tagged response:{} and date:{} and url:{}".format(res,date_original,url_dict),MODULE_CONTEXT) 

    return res,date_original,url_dict,num_array,num_map 

  except Exception as e:
    log_exception("In handle_date_url:tag_num function parent except block:{}".format(e),MODULE_CONTEXT,e)
    return text,[],[],(num_array or []),(num_map or [])

def replace_tags_with_original(text,date_original,url_dict,num_array,num_map):
  '''
  Replaces dates,urls and numbers in the text with the original values
  in place of the tags
  '''
  try: 
    res = text
        
    if len(text) == 0:
      return ""

    for url_tag,url in url_dict.items():
      res = text.replace(url_tag,url)

    #log_info("response after url and date replacemnt:{}".format(res),MODULE_CONTEXT)    
    
    if len(num_map) == 0:
      ''' handling the case when model outputs a tag which is not in tagged_src(src is without any number'''
      for char in reversed(hindi_numbers):  
        res = re.sub(r'NnUuMm'+char,"",res)
    num_map.reverse()
    for item in num_map:
      res = res.replace(item['tag'],str(item['no.']),1)
   
    res = remove_extra_tags(res)     
    #log_info("response after tags replacement:{}".format(res),MODULE_CONTEXT)
    return res    
  except Exception as e:
    log_exception("Error in parent except block of replace_tags_with_original_1 function, returning tagged output:{}".format(e),MODULE_CONTEXT,e)
    return res

def get_indices_of_num_with_zero_prefix(num_arr):
  '''  eg. '000','049' '''
  i = [i for i,j in enumerate(num_arr) if j.startswith(str(0))]
  return i

def update_num_arr(num_array,zero_prefix_num,i_zero,num_array_orignal):
  '''
  This is function is meant to handle zero prefix numbers like 09 or 000 which are converted to 9 or 0 during processing, We want them in original form i.e 09
  zero_prefix_num: this is the num that has to be transformed back with zero prefix(from 9 to 09, or, 0 to 000 originally)
  i_zero: indices of numbers with zero prefix in num_array_orignal
  ind: indices of zero prefix numbers in num_array descending

  Note: this function needs some fixing
  '''
  try:
    num_array_o = None
    num_array_o = num_array[:]
        
    ind = list()
    zero_prefix_num = np.unique(np.array(zero_prefix_num))
    for i in zero_prefix_num:
      for j,m in enumerate(num_array):
        if m == i:
          ind.append(j)
    for k,l in enumerate(ind):
      num_array[l] = num_array_orignal[i_zero[k]]
    return num_array
  except Exception as e:
    log_exception("Error in handle_date_url:update_num_arr,returning incoming num_array:{}".format(e),MODULE_CONTEXT,e)
    return num_array_o
  
def build_src_num_array(i_text):
  num_map,num_dict = list(),{}
  count_number = 0
  all_patterns = patterns['p12']['regex']
  src_num_array = re.findall(all_patterns,i_text)
  int_num_array = list(map(lambda y:y.replace(',',''), src_num_array))
  int_num_array = list(map(int, int_num_array))
  num_dict = {k:v for (k,v) in zip(int_num_array,src_num_array)}
  int_num_array.sort(reverse=True)
  for k,v in enumerate(int_num_array):
    i_text = i_text.replace(num_dict[v],'NnUuMm'+str(hindi_numbers[count_number]),1)
    num_map.append({"no.":num_dict[v],"tag":'NnUuMm'+str(hindi_numbers[count_number])})
    count_number +=1
    if count_number >30:
      log_info("count exceeding 30,triggering break",MODULE_CONTEXT)
      count_number = 30
      break

  return int_num_array,i_text,num_map
  
def remove_extra_tags(text):
  '''
  This funtion is meant for removing extra num,date and url tags from the output 
  '''
  if len(re.findall(r'NnUuMm.', text)) > 0:
    ''' 
    if model outputs extra tag than the number of count in num_map or 
    some unreplaced tags, removing them from final output
    '''
    for char in reversed(hindi_numbers):  
      text = re.sub(r'NnUuMm'+char,"",text) 
  
  if len(re.findall(r'DdAaTtEe.', text)) > 0:
    ''' 
    If any' unreplaced Date tag is still left, removing it in final output'
    Assuming in input there wont be more than 9 date patterns
    '''
    text = re.sub(r'DdAaTtEe.',"",text)  
  
  if len(re.findall(r'UuRrLl.', text)) > 0:
    ''' 
    If any' unreplaced url tag is still left, removing it in final output'
    Assuming in input there wont be more than 9 url patterns
    '''
    text = re.sub(r'UuRrLl.',"",text)   
    
  return text  