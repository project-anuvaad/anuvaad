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
  try: 
    if len(text) == 0:
      return "","","","",""
    
    resultant_str = list()
    count_date = 0
    date_original = list()
    count_url = 0
    url_original = list()
    count_number = 0
    num_map = list()
    
    num_array = re.findall(patterns['p3']['regex'],text)
    num_array_orignal = num_array
    i_zero = get_indices_of_num_with_zero_prefix(num_array)
    num_array = list(map(int, num_array))
    zero_prefix_num = [num_array[i] for i in i_zero] 
    num_array.sort(reverse = True)
    # num_array = update_num_arr(num_array,zero_prefix_num,i_zero,num_array_orignal)
 
    for j in num_array:
      text = text.replace(str(j),'NnUuMm'+str(hindi_numbers[count_number]),1)
      num_map.append({"no.":j,"tag":'NnUuMm'+str(hindi_numbers[count_number])})
      count_number +=1
      if count_number >30:
        print("count exceeding 30")
        count_number = 30

    log_info("number-tag mappings-{}".format(num_map),MODULE_CONTEXT)
    log_info("Number tagging done",MODULE_CONTEXT)
    for word in text.split():
        # if len(word)>4 and len(word)<12 and token_is_date(word):
        try:
          ext = [".",",","?","!"]
          if word.isalpha()== False and word[:-1].isalpha() == False and len(word)>4 and misc.token_is_date(word):
            if word.endswith(tuple(ext)):
              end_token = word[-1]
              word = word[:-1]
              if len(word)<7 and int(word):
                word = word+end_token
              else:
                date_original.append(word)
                word = 'DdAaTtEe'+str(count_date)+end_token
                count_date +=1
            else:
              date_original.append(word)  
              word = 'DdAaTtEe'+str(count_date)
              count_date +=1
          elif misc.token_is_url(word):
            url_original.append(word)
            word = 'UuRrLl'+str(count_url)
            count_url +=1
        except Exception as e:
          print(e)
          log_exception("In handle_date_url:tag_num function:{}".format(e),MODULE_CONTEXT,e)
          word = word
        

        resultant_str.append(word)   
        s = [str(i) for i in resultant_str] 
        res = str(" ".join(s))   
    log_info("tagged response:{} and date:{} and url:{}".format(res,date_original,url_original),MODULE_CONTEXT) 
    return res,date_original,url_original,num_array,num_map 
  except Exception as e:
    log_exception("In handle_date_url:tag_num function parent except block:{}".format(e),MODULE_CONTEXT,e)
    return text,[],[],(num_array or [])

def replace_tags_with_original(text,date_original,url_original,num_array):
  try:
    resultant_str = list()
      
    if len(text) == 0:
      return ""
    for word in text.split():
      if word[:-1] == 'DdAaTtEe' and len(date_original) > 0:
        word = date_original[int(word[-1])]
      elif word[:-1] == 'UuRrLl' and len(url_original)> 0 :
        word = url_original[int(word[-1])]          

      resultant_str.append(word)
      s = [str(i) for i in resultant_str] 
      res = str(" ".join(s))

    log_info("response after url and date replacemnt:{}".format(res),MODULE_CONTEXT)
    array = re.findall(r'NnUuMm..|NnUuMm.', res)   
    log_info("NnUuMm array after translation:{}".format(array),MODULE_CONTEXT)
    for j in array:
      try:
        if j[-2:] in hindi_numbers:
          end_hin_number = j[-2:]
          index = hindi_numbers.index(end_hin_number)
          res = res.replace(j,str(num_array[index]),1)
        elif j[:-1]== "NnUuMm":
          end_hin_number = j[-1]
          index = hindi_numbers.index(end_hin_number)
          res = res.replace(j,str(num_array[index]),1)
        else:
          end_hin_number = j[-2]
          j = j[:-1]
          index = hindi_numbers.index(end_hin_number)     
          res = res.replace(j,str(num_array[index]),1)
      
      except Exception as e:
        log_info("inside str.replace error,but handling it:{}".format(e),MODULE_CONTEXT)
        res = res.replace(j,"",1)

    log_info("response after tags replacement:{}".format(res),MODULE_CONTEXT)
    return res    
  except Exception as e:
    log_exception("Error in parent except block of replace_tags_with_original_1 function, returning tagged output:{}".format(e),MODULE_CONTEXT,e)
    return text

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