import re
from anuvaad_auditor.loghandler import log_info, log_exception
from utilities import MODULE_CONTEXT
import utilities.misc as misc
from config.regex_patterns import patterns

def handle_single_token(token):
   try:
       if misc.isfloat(token):
            return (token)
       elif misc.token_is_date(token):
           #log_info("Returning date as single token",MODULE_CONTEXT)
           return token        
       elif len(token) > 1 and token_is_alphanumeric_char(token):
            if len(token) ==3 and (token[0].isalnum() == False) and (token[1].isalnum() == True):
                return token   
            prefix,suffix,translation_text = separate_alphanumeric_and_symbol(token)
            return ""
       elif len(token)==1:
           log_info("Handling single token and returning character as it is",MODULE_CONTEXT)
           return (token)            
       else:
            log_info("returning null to allow token to go to model",MODULE_CONTEXT)
            return ""
   except:
       log_info("returning null to allow token to go to model",MODULE_CONTEXT)
       return ""
          

def token_is_alphanumeric_char(token):
    "checking if single token consists of alphanumeric and symbolic characters. But, symbol only at the begining and end are considerd"
    if re.match(r'^[\w]+$', token) is None:
        return True

def separate_alphanumeric_and_symbol(text):
    try:  
        start = re.match(r"^\W+|\W+$", text)
        end = re.match(r'.*?([\W]+)$', text)
        translation_text = re.sub(r"^\W+|\W+$", "", text)    
                  
        if start:
            start = start.group(0)
            if start.endswith('(') and len(translation_text)>1 and translation_text[0].isalnum() and translation_text[1]== ')':
                start = start + translation_text[0] + translation_text[1]
                translation_text = translation_text[2:]
                start_residual_part = re.match(r"^\W+|\W+$", translation_text)   
                if start_residual_part:
                    start_residual_part = start_residual_part.group(0)
                    start = start+start_residual_part
                    translation_text = re.sub(r"^\W+|\W+$", "", translation_text)   

        else:
            start = ""           
        if end:
            end = end.group(1)
            if end.startswith('.'):
                end = end[1:]
                translation_text = translation_text + '.' 
        else:
            end = ""            
        
        return start,end,translation_text
    except Exception as e:
        log_exception("Error in separate_alphanumeric_and_symbol Funtion, handling it. Error:{}".format(e),MODULE_CONTEXT,e)
        return "","",text


"below is for handling dates which are splitted in more than 1 token and other special cases"
def special_case_fits(text):
    if len(text) == 0 :
        return True
    elif misc.token_is_date(text):
        return True
    elif len(text.split()) == 1 and misc.token_is_url(text):
        "this will handle single URL and return the same i.e single token-url"
        return True
    elif len(text.split()) == 1 and len(handle_single_token(text))>0:  
        return True  

def handle_special_cases(text,model_id):
    try:
        if len(text) == 0 :
            log_info("Null src for this request",MODULE_CONTEXT)
            return ""
        elif misc.token_is_date(text):
            hindi_months = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर']
            tamil_months = ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்','மே','ஜூன்','ஜூலை','ஆகஸ்ட்','செப்டம்பர்','அக்டோபர்','நவம்பர்','டிசம்பர்']
            eng_months = ['january','february','march','april','may','june','july','august','september','october','november','december'] 
            if model_id in [1,13]:
                "english to hindi"
                for i in eng_months : 
                    text = text.casefold().replace(i.casefold(),hindi_months[eng_months.index(i)]) 
            elif model_id == 7:
                "english to tamil"
                for i in eng_months : 
                    text = text.casefold().replace(i.casefold(),tamil_months[eng_months.index(i)])

            log_info('handling dates before model in long alpha-numeric format',MODULE_CONTEXT)
            return text
        elif len(text.split()) == 1 and misc.token_is_url(text):
            log_info('handling single token-url before model and returning as it is',MODULE_CONTEXT)
            return text   
        elif len(text.split()) == 1 and len(handle_single_token(text))>0:
            return handle_single_token(text) 
    except Exception as e:
        log_exception("error when handling special cases :{}".format(e),MODULE_CONTEXT,e)
        return text

def prefix_handler(text):
    '''
    Currently this function is only handling different numeric prefixes in the first token of an input eg. 1., 12.1, (1.),(12.1),1,(12) etc.
    '''
    try:
        prefix = ""
        tokens = text.split()
        token_p = tokens[0]
        regex_list = [patterns['p10'],patterns['p11']]
        matches = [re.match(pattern['regex'], token_p) for pattern in regex_list]
        if not all(v is None for v in matches):
            prefix = token_p
            text = str(" ".join(tokens[1:]))
        #log_info("Returning from prefix_handler",MODULE_CONTEXT)    
        return prefix,text
    except Exception as e:
        log_exception("Error in prefix handler, returning original text,error:{}".format(e),MODULE_CONTEXT,e)
        return "",text

def suffix_handler(text):
    "in progress"
    try:
        tokens = text.split()
    except Exception as e:
        print(e)

def handle_sentences_wo_stop(language,sentence_array):
    '''
    Handles sentences in the array which do not have a sentence
    ending puncuation by adding it. Used in batch translation.
    '''
    try:
        if language is None:
            return sentence_array, []
        else:
            #log_info("Inside handle_sentences_wo_stop",MODULE_CONTEXT)
            stop_puncs = misc.get_language_stop_puncs(language)
            full_stop_or_purnviram = stop_puncs[0]
            sent_indices_wo_stop = []
            for i,sentence in enumerate(sentence_array):
                if misc.is_sentence_wo_stop(sentence,stop_puncs):
                    sent_indices_wo_stop.append(i)
                    sentence_array[i] = misc.add_stop_punc(sentence_array[i],full_stop_or_purnviram)

            return sentence_array, sent_indices_wo_stop
    
    except Exception as e:
        log_exception("Error in handle_sentences_wo_stop: {}".format(e),MODULE_CONTEXT,e)
        return sentence_array, []

def handle_a_sentence_wo_stop(language,sentence):
    '''
    Handles a sentence  which do not have a sentence
    ending puncuation by adding it. Used in single sentence translation API.
    '''
    try:
        if language is None:
            return sentence, False
        else:
            #log_info("Inside handle_a_sentence_wo_stop",MODULE_CONTEXT)
            stop_puncs = misc.get_language_stop_puncs(language)
            full_stop_or_purnviram = stop_puncs[0]
            is_missing_stop_punc = misc.is_sentence_wo_stop(sentence,stop_puncs)
            if is_missing_stop_punc:
                sentence = misc.add_stop_punc(sentence,full_stop_or_purnviram)

            return sentence, is_missing_stop_punc
    
    except Exception as e:
        log_exception("Error in handle_a_sentence_wo_stop: {}".format(e),MODULE_CONTEXT,e)
        return sentence, False




    

