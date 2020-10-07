import ctranslate2
from models import CustomResponse, Status
from anuvaad_auditor.loghandler import log_info, log_exception
from utilities import MODULE_CONTEXT
import os
import json 
import sys
import re
import utilities.sp_enc_dec as sp
import utilities.sentence_processor as sentence_processor
import utilities.ancillary_functions as ancillary_functions
import utilities.handle_date_url as date_url_util
import utilities.output_cleaner as oc
from config import sentencepiece_model_loc as sp_model
from config.regex_patterns import patterns
from onmt.translate import ServerModelError

ICONFG_FILE = "src/config/iconf.json"
class TranslateService:  
    @staticmethod
    def interactive_translation(inputs):
        out = {}
        i_src, tgt = list(), list()
        tagged_tgt = list()
        tagged_src = list()
        sentence_id = list()
        tp_tokenizer = None

        try:
            for i in inputs:  
                # log_info(log_with_request_info(i.get("s_id"),LOG_TAGS["input"],i))
                sentence_id.append(i.get("s_id") or "NA")
                if  any(v not in i for v in ['src','id']):
                    # out['status'] = statusCode["ID_OR_SRC_MISSING"]
                    out['response_body'] = []
                    log_info("either id or src missing in some input")
                    out = CustomResponse(Status.ID_OR_SRC_MISSING.value, out['response_body'])
                    return out

                log_info("input sentence:{}".format(i['src']),MODULE_CONTEXT) 
                i_src.append(i['src'])   
                i['src'] = i['src'].strip()    
                if ancillary_functions.special_case_fits(i['src']):
                    log_info("sentence fits in special case, returning accordingly and not going to model",MODULE_CONTEXT)
                    translation = ancillary_functions.handle_special_cases(i['src'],i['id'])
                    translation = [translation]
                    tag_tgt,tag_src = translation,i['src']

                else:
                    log_info("Performing interactive translation on:{}".format(i['id']),MODULE_CONTEXT)
                    i['src'],date_original,url_original,num_array,num_map = date_url_util.tag_number_date_url_1(i['src'])
                    tag_src = i['src'] 

                    if i['id'] == 56:
                        "english-hindi"
                        if i['src'].isupper():
                            log_info("src all Upper case hence Tital casing it",MODULE_CONTEXT)
                            i['src'] = i['src'].title()
                        tp_tokenizer = sentence_processor.indic_tokenizer
                        i['src'] = sentence_processor.moses_tokenizer(i['src'])
                        translation = encode_itranslate_decode(i,sp_model.english_hindi["ENG_EXP_5.6"],sp_model.english_hindi["HIN_EXP_5.6"],num_map,tp_tokenizer)
                        translation = [sentence_processor.indic_detokenizer(i) for i in translation]
                    elif i['id'] == 7:
                        "english-tamil"
                        translation = encode_itranslate_decode(i,sp_model.english_tamil["ENG_230919"],sp_model.english_tamil["TAM_230919"],num_map,tp_tokenizer)
                    elif i['id'] == 10:  
                        "english-gujarati"
                        translation = encode_itranslate_decode(i,sp_model.english_gujarati["ENG_100919"],sp_model.english_gujarati["GUJ_100919"],num_map,tp_tokenizer)
                    elif i['id'] == 11:  
                        "english-bengali"
                        translation = encode_itranslate_decode(i,sp_model.english_bengali["ENG_120919"],sp_model.english_bengali["BENG_120919"],num_map,tp_tokenizer)
                    elif i['id'] == 15:  
                        "english-kannada"
                        translation = encode_itranslate_decode(i,sp_model.english_kannada["ENG_200919"],sp_model.english_kannada["KANNADA_200919"],num_map,tp_tokenizer)
                    elif i['id'] == 16:  
                        "english-telugu"
                        translation = encode_itranslate_decode(i,sp_model.english_telugu["ENG_200919"],sp_model.english_telugu["TELGU_200919"],num_map,tp_tokenizer)
                    elif i['id'] == 17:  
                        "english-malayalam"
                        translation = encode_itranslate_decode(i,sp_model.english_malayalam["ENG_200919"],sp_model.english_malayalam["MALAYALAM_200919"],num_map,tp_tokenizer)                                                
                    elif i['id'] == 18:  
                        "english-punjabi"
                        translation = encode_itranslate_decode(i,sp_model.english_punjabi["ENG_200919"],sp_model.english_punjabi["PUNJABI_200919"],num_map,tp_tokenizer)
                    elif i['id'] == 42:  
                        "english-marathi"
                        translation = encode_itranslate_decode(i,sp_model.english_marathi["ENG_071119"],sp_model.english_marathi["MARATHI_071119"],num_map,tp_tokenizer)
                    elif i['id'] == 50:
                        "telugu-english"
                        tp_tokenizer = sentence_processor.moses_tokenizer
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation = encode_itranslate_decode(i,sp_model.english_telugu["TELUGU_120220"],sp_model.english_telugu["ENG_120220"],num_map,tp_tokenizer)
                        translation = [sentence_processor.moses_detokenizer(i) for i in translation]
                    elif i['id'] == 6:
                        "hindi-english"
                        tp_tokenizer = sentence_processor.moses_tokenizer
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation = encode_itranslate_decode(i,sp_model.hindi_english["HIN_EXP_2_050520"],sp_model.hindi_english["ENG_EXP_2_050520"],num_map,tp_tokenizer)
                        translation = [sentence_processor.moses_detokenizer(i) for i in translation]
                    elif i['id'] == 62:
                        "marathi-english"
                        tp_tokenizer = sentence_processor.moses_tokenizer
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation = encode_itranslate_decode(i,sp_model.english_marathi["MARATHI_280220"],sp_model.english_marathi["ENG_280220"],num_map,tp_tokenizer)
                        translation = [sentence_processor.moses_detokenizer(i) for i in translation]
                    elif i['id'] == 58:
                        "bengali-english"
                        tp_tokenizer = sentence_processor.moses_tokenizer 
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation = encode_itranslate_decode(i,sp_model.english_bengali["BENG_180220"],sp_model.english_bengali["ENG_180220"],num_map,tp_tokenizer)
                        translation = [sentence_processor.moses_detokenizer(i) for i in translation]
                    elif i['id'] == 8:
                        "tamil-english"
                        tp_tokenizer = sentence_processor.moses_tokenizer 
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation = encode_itranslate_decode(i,sp_model.english_tamil["TAM_090120"],sp_model.english_tamil["ENG_090120"],num_map,tp_tokenizer)
                        translation = [sentence_processor.moses_detokenizer(i) for i in translation] 
                    elif i['id'] == 55:
                        "punjabi-english"
                        tp_tokenizer = sentence_processor.moses_tokenizer 
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation = encode_itranslate_decode(i,sp_model.english_punjabi["PUNJABI_160220"],sp_model.english_punjabi["ENG_160220"],num_map,tp_tokenizer)
                        translation = [sentence_processor.moses_detokenizer(i) for i in translation]  
                    elif i['id'] == 48:
                        "kannada-english"
                        tp_tokenizer = sentence_processor.moses_tokenizer 
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation = encode_itranslate_decode(i,sp_model.english_kannada["KANNADA_100220"],sp_model.english_kannada["ENG_100220"],num_map,tp_tokenizer)
                        translation = [sentence_processor.moses_detokenizer(i) for i in translation]
                    elif i['id'] == 60:
                        "malayalam-english"
                        tp_tokenizer = sentence_processor.moses_tokenizer 
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation = encode_itranslate_decode(i,sp_model.english_malayalam["MALAYALAM_210220"],sp_model.english_malayalam["ENG_210220"],num_map,tp_tokenizer)
                        translation = [sentence_processor.moses_detokenizer(i) for i in translation] 
                    elif i['id'] == 52:
                        "gujarati-english"
                        tp_tokenizer = sentence_processor.moses_tokenizer 
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation = encode_itranslate_decode(i,sp_model.english_gujarati["GUJ_140220"],sp_model.english_gujarati["ENG_140220"],num_map,tp_tokenizer)
                        translation = [sentence_processor.moses_detokenizer(i) for i in translation]                   

                    else:
                        log_info("unsupported model id: {} for given input".format(i['id']),MODULE_CONTEXT)
                        raise Exception("Unsupported Model ID - id: {} for given input".format(i['id']))      

                    translation = [date_url_util.regex_pass(i,[patterns['p8'],patterns['p9'],patterns['p4'],patterns['p5'],
                                                patterns['p6'],patterns['p7']]) for i in translation]
                    tag_tgt = translation
                    translation = [date_url_util.replace_tags_with_original_1(i,date_original,url_original,num_array) for i in translation]
                log_info("interactive translation-experiment-{} output: {}".format(i['id'],translation),MODULE_CONTEXT)    
                # log_info(log_with_request_info(i.get("s_id"),LOG_TAGS["output"],translation))
                tgt.append(translation)
                tagged_tgt.append(tag_tgt)
                tagged_src.append(tag_src)

            # out['status'] = statusCode["SUCCESS"]
            out['response_body'] = [{"tgt": tgt[i],"tagged_tgt":tagged_tgt[i],
                                    "tagged_src":tagged_src[i],"s_id":sentence_id[i],"src":i_src[i]}
                    for i in range(len(tgt))]
            out = CustomResponse(Status.SUCCESS.value, out['response_body'])
        except Exception as e:
            # out['status'] = statusCode["SYSTEM_ERR"]
            # out['status']['why'] = str(e)
            out['response_body'] = []
            log_exception("Unexpected error:%s and %s"% (e,sys.exc_info()[0]),MODULE_CONTEXT,e) 
            out = CustomResponse(Status.SYSTEM_ERR.value, out['response_body'])  

        return (out)

class OpenNMTTranslateService:
    @staticmethod
    def translate_func(inputs, translation_server):

        inputs = inputs
        out = {}
        pred_score = list()
        sentence_id,node_id = list(),list()
        input_subwords,output_subwords = list(),list()
        i_src,tgt = list(),list()
        tagged_tgt,tagged_src = list(),list()
        s_id,n_id = [0000],[0000]

        try:
            for i in inputs:
                # log_info(log_with_request_info(i.get("s_id"),LOG_TAGS["input"],i),MODULE_CONTEXT)
                if all(v in i for v in ['s_id','n_id']):
                    s_id = [i['s_id']]
                    n_id = [i['n_id']]  
                    
                if  any(v not in i for v in ['src','id']):
                    # out['status'] = statusCode["ID_OR_SRC_MISSING"]
                    out['response_body'] = []
                    log_info("either id or src missing in some input",MODULE_CONTEXT)
                    out = CustomResponse(Status.ID_OR_SRC_MISSING.value, out['response_body'])
                    return (out) 

                log_info("input sentences:{}".format(i['src']),MODULE_CONTEXT) 
                i_src.append(i['src'])   
                i['src'] = i['src'].strip()
                if ancillary_functions.special_case_fits(i['src']):
                    log_info("sentence fits in special case, returning accordingly and not going to model",MODULE_CONTEXT)
                    translation = ancillary_functions.handle_special_cases(i['src'],i['id'])
                    scores = [1] 
                    input_sw,output_sw,tag_tgt,tag_src = "","",translation,i['src']

                else:
                    log_info("translating using NMT-model:{}".format(i['id']),MODULE_CONTEXT)
                    # prefix,suffix, i['src'] = ancillary_functions.separate_alphanumeric_and_symbol(i['src'])
                    prefix, i['src'] = ancillary_functions.prefix_handler(i['src'])
                    i['src'],date_original,url_original,num_array,num_map = date_url_util.tag_number_date_url_1(i['src'])
                    tag_src = (prefix +" "+ i['src']).lstrip() 
                    if i['id'] == 5:
                        "hi-en exp-1"
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.hindi_english["HIN_EXP_1_291019"],sp_model.hindi_english["ENG_EXP_1_291019"])
                        translation = sentence_processor.moses_detokenizer(translation)
                    elif i['id'] == 6:
                        "hi-en_exp-2 05-05-20"
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.hindi_english["HIN_EXP_2_050520"],sp_model.hindi_english["ENG_EXP_2_050520"])
                        translation = sentence_processor.moses_detokenizer(translation)

                    elif i['id'] == 7:  
                        "english-tamil"
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_tamil["ENG_230919"],sp_model.english_tamil["TAM_230919"])
                    elif i['id'] == 10:  
                        "english-gujrati"
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_gujarati["ENG_100919"],sp_model.english_gujarati["GUJ_100919"])
                        translation = translation.replace("ન્યાય માટે Accessક્સેસને","ન્યાયની પહોંચને")
                    elif i['id'] == 11:  
                        "english-bengali"
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_bengali["ENG_120919"],sp_model.english_bengali["BENG_120919"])
                    elif i['id'] == 12:  
                        "english-marathi"
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_marathi["ENG_140919"],sp_model.english_marathi["MARATHI_140919"])               

                    elif i['id'] == 15:  
                        "english-kannada"
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_kannada["ENG_200919"],sp_model.english_kannada["KANNADA_200919"])
                        translation = translation.replace("uc","")
                    elif i['id'] == 16:  
                        "english-telgu"
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_telugu["ENG_200919"],sp_model.english_telugu["TELGU_200919"])
                    elif i['id'] == 17:  
                        "english-malayalam"
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_malayalam["ENG_200919"],sp_model.english_malayalam["MALAYALAM_200919"])
                    elif i['id'] == 18:  
                        "english-punjabi"
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_punjabi["ENG_200919"],sp_model.english_punjabi["PUNJABI_200919"])
                    elif i['id'] == 21:  
                        "exp-1 BPE model with varying vocab size 15k for both hindi and english +tokenization"
                        i['src'] = sentence_processor.moses_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_hindi["ENG_EXP_1"],sp_model.english_hindi["HIN_EXP_1"])                      
                        translation = sentence_processor.indic_detokenizer(translation)  
                    elif i['id'] == 30:
                        "25/10/2019 experiment 10, Old data + dictionary,BPE-24k, nolowercasing,pretok,shuffling,50k nmt"
                        i['src'] = sentence_processor.moses_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_hindi["ENG_EXP_10"],sp_model.english_hindi["HIN_EXP_10"])                      
                        translation = sentence_processor.indic_detokenizer(translation)   
                    elif i['id'] == 32:
                        "29/10/2019 Exp-12: old_data_original+lc_cleaned+ ik names translated from google(100k)+shabdkosh(appended 29k new),BPE-24K,50knmt,shuff,pretok"
                        i['src'] = sentence_processor.moses_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_hindi["ENG_EXP_12"],sp_model.english_hindi["HIN_EXP_12"])                      
                        translation = sentence_processor.indic_detokenizer(translation)
                    elif i['id'] == 54:
                        "29-30/10/19Exp-5.4: -data same as 5.1 exp...old data+ india kanoon 830k(including 1.5 lakhs names n no learned counsel)+72192k shabkosh, BPE 24k, nolowercasing,pretok,shuffling"
                        i['src'] = sentence_processor.moses_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_hindi["ENG_EXP_5.4"],sp_model.english_hindi["HIN_EXP_5.4"])                      
                        translation = sentence_processor.indic_detokenizer(translation)
                    elif i['id'] == 42:  
                        "english-marathi exp-2"
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_marathi["ENG_071119"],sp_model.english_marathi["MARATHI_071119"])    
                    elif i['id'] == 56:
                        "09/12/19-Exp-5.6:" 
                        if i['src'].isupper():
                            i['src'] = i['src'].title()
                        i['src'] = sentence_processor.moses_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_hindi["ENG_EXP_5.6"],sp_model.english_hindi["HIN_EXP_5.6"])                      
                        translation = sentence_processor.indic_detokenizer(translation)
                    elif i['id'] == 8:
                        "ta-en 1st"
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_tamil["TAM_090120"],sp_model.english_tamil["ENG_090120"])
                        translation = sentence_processor.moses_detokenizer(translation)  
                    elif i['id'] == 43:
                        "mr-en 1st"
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_marathi["MARATHI_270120"],sp_model.english_marathi["ENG_270120"])
                        translation = sentence_processor.moses_detokenizer(translation)  
                    elif i['id'] == 44:
                        "eng-mr-3rd"
                        i['src'] = sentence_processor.moses_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_marathi["ENG_060220"],sp_model.english_marathi["MARATHI_060220"])
                        translation = sentence_processor.indic_detokenizer(translation)         
                    elif i['id'] == 45:
                        "en-ta 4th"
                        i['src'] = sentence_processor.moses_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_tamil["ENG_080220"],sp_model.english_tamil["TAM_080220"])
                        translation = sentence_processor.indic_detokenizer(translation)  
                    elif i['id'] == 46:
                        "ta-en 2nd"
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_tamil["TAM_100220"],sp_model.english_tamil["ENG_100220"])
                        translation = sentence_processor.moses_detokenizer(translation)  
                    elif i['id'] == 47:
                        "en-kn 2nd"
                        i['src'] = sentence_processor.moses_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_kannada["ENG_100220"],sp_model.english_kannada["KANNADA_100220"])
                        translation = sentence_processor.indic_detokenizer(translation) 
                    elif i['id'] == 48:
                        "kn-en 1st"
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_kannada["KANNADA_100220"],sp_model.english_kannada["ENG_100220"])
                        translation = sentence_processor.moses_detokenizer(translation)
                    elif i['id'] == 49:
                        "en-tel 2nd"
                        i['src'] = sentence_processor.moses_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_telugu["ENG_120220"],sp_model.english_telugu["TELUGU_120220"])
                        translation = sentence_processor.indic_detokenizer(translation) 
                    elif i['id'] == 50:
                        "tel-en 1st"
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_telugu["TELUGU_120220"],sp_model.english_telugu["ENG_120220"])
                        translation = sentence_processor.moses_detokenizer(translation)
                    elif i['id'] == 51:
                        "en-guj 2nd"
                        i['src'] = sentence_processor.moses_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_gujarati["ENG_140220"],sp_model.english_gujarati["GUJ_140220"])
                        translation = sentence_processor.indic_detokenizer(translation) 
                    elif i['id'] == 52:
                        "guj-en 1st"
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_gujarati["GUJ_140220"],sp_model.english_gujarati["ENG_140220"])
                        translation = sentence_processor.moses_detokenizer(translation)
                    elif i['id'] == 53:
                        "en-punjabi 2nd"
                        i['src'] = sentence_processor.moses_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_punjabi["ENG_160220"],sp_model.english_punjabi["PUNJABI_160220"])
                        translation = sentence_processor.indic_detokenizer(translation) 
                    elif i['id'] == 55:
                        "punjabi-en 1st"
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_punjabi["PUNJABI_160220"],sp_model.english_punjabi["ENG_160220"])
                        translation = sentence_processor.moses_detokenizer(translation)
                    elif i['id'] == 57:
                        "en-bengali 2nd"
                        i['src'] = sentence_processor.moses_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_bengali["ENG_180220"],sp_model.english_bengali["BENG_180220"])
                        translation = sentence_processor.indic_detokenizer(translation) 
                    elif i['id'] == 58:
                        "bengali-en 1st"
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_bengali["BENG_180220"],sp_model.english_bengali["ENG_180220"])
                        translation = sentence_processor.moses_detokenizer(translation)
                    elif i['id'] == 59:
                        "en-malay 2nd"
                        i['src'] = sentence_processor.moses_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_malayalam["ENG_210220"],sp_model.english_malayalam["MALAYALAM_210220"])
                        translation = sentence_processor.indic_detokenizer(translation) 
                    elif i['id'] == 60:
                        "malay-en 1st"
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_malayalam["MALAYALAM_210220"],sp_model.english_malayalam["ENG_210220"])
                        translation = sentence_processor.moses_detokenizer(translation)
                    elif i['id'] == 61:
                        "ta-to-en 3rd"
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_tamil["TAM_280220"],sp_model.english_tamil["ENG_280220"])
                        translation = sentence_processor.moses_detokenizer(translation) 
                    elif i['id'] == 62:
                        "mr-to-en 2nd"
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_marathi["MARATHI_280220"],sp_model.english_marathi["ENG_280220"])
                        translation = sentence_processor.moses_detokenizer(translation)
                    elif i['id'] == 63:
                        "en-hi exp-13 09-03-20"  
                        i['src'] = sentence_processor.moses_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i,translation_server,sp_model.english_hindi["ENG_EXP_13"],sp_model.english_hindi["HIN_EXP_13"])                      
                        translation = sentence_processor.indic_detokenizer(translation)                                                     
                    else:
                        log_info("Unsupported model id: {} for given input".format(i['id']),MODULE_CONTEXT)
                        raise Exception("Unsupported Model ID - id: {} for given input".format(i['id']))      

                    # translation = (prefix+" "+translation+" "+suffix).strip()
                    translation = (prefix+" "+translation).lstrip()
                    translation = translation.replace("▁"," ")
                    translation = date_url_util.regex_pass(translation,[patterns['p8'],patterns['p9'],patterns['p4'],patterns['p5'],
                                                patterns['p6'],patterns['p7']])
                    tag_tgt = translation                            
                    translation = date_url_util.replace_tags_with_original_1(translation,date_original,url_original,num_array)
                    translation = oc.cleaner(tag_src,translation,i['id'])
                log_info("trans_function-experiment-{} output: {}".format(i['id'],translation),MODULE_CONTEXT)   
                # logger.info(log_with_request_info(i.get("s_id"),LOG_TAGS["output"],translation)) 
                tgt.append(translation)
                pred_score.append(scores)
                sentence_id.append(s_id[0]), node_id.append(n_id[0])
                input_subwords.append(input_sw), output_subwords.append(output_sw)
                tagged_tgt.append(tag_tgt), tagged_src.append(tag_src)

            # out['status'] = statusCode["SUCCESS"]
            out['response_body'] = [{"tgt": tgt[i],
                    "pred_score": pred_score[i], "s_id": sentence_id[i],"input_subwords": input_subwords[i],
                    "output_subwords":output_subwords[i],"n_id":node_id[i],"src":i_src[i],
                    "tagged_tgt":tagged_tgt[i],"tagged_src":tagged_src[i]}
                    for i in range(len(tgt))]
            out = CustomResponse(Status.SUCCESS.value, out['response_body'])
        except ServerModelError as e:
            # out['status'] = statusCode["SEVER_MODEL_ERR"]
            # out['status']['why'] = str(e)
            out['response_body'] = []
            log_exception("ServerModelError error in TRANSLATE_UTIL-translate_func: {} and {}".format(e,sys.exc_info()[0]),MODULE_CONTEXT,e)
            out = CustomResponse(Status.SEVER_MODEL_ERR.value, out['response_body'])  
        except Exception as e:
            # out['status'] = statusCode["SYSTEM_ERR"]
            # out['status']['why'] = str(e)
            out['response_body'] = []
            log_exception("Unexpected error:%s and %s"% (e,sys.exc_info()[0]),MODULE_CONTEXT,e) 
            out = CustomResponse(Status.SYSTEM_ERR.value, out['response_body'])    

        return (out)
     
def encode_itranslate_decode(i,sp_encoder,sp_decoder,num_map,tp_tokenizer,num_hypotheses=3):
    try:
        log_info("Inside encode_itranslate_decode function",MODULE_CONTEXT)
        model_path = get_model_path(i['id'])
        translator = ctranslate2.Translator(model_path)
        i['src'] = str(sp.encode_line(sp_encoder,i['src']))
        i_final = format_converter(i['src'])

        if 'target_prefix' in i and len(i['target_prefix']) > 0 and i['target_prefix'].isspace() == False:
            log_info("target prefix: {}".format(i['target_prefix']),MODULE_CONTEXT) 
            i['target_prefix'] = i['target_prefix']
            i['target_prefix'] = replace_num_target_prefix(i,num_map)
            if tp_tokenizer is not None:
                i['target_prefix'] = tp_tokenizer(i['target_prefix'])
            i['target_prefix'] = str(sp.encode_line(sp_decoder,i['target_prefix']))
            tp_final = format_converter(i['target_prefix'])
            tp_final[-1] = tp_final[-1].replace(']',",")
            m_out = translator.translate_batch([i_final],beam_size = 5, target_prefix = [tp_final],num_hypotheses=num_hypotheses)
        else:
            m_out = translator.translate_batch([i_final],beam_size = 5,num_hypotheses=num_hypotheses)

        translation = multiple_hypothesis_decoding(m_out[0],sp_decoder)        
        return translation
        
    except Exception as e:
        log_exception("Unexpexcted error in encode_itranslate_decode: {} and {}".format(e,sys.exc_info()[0]),MODULE_CONTEXT,e)
        raise 

def encode_translate_decode(i,translation_server,sp_encoder,sp_decoder):
    try:
        log_info("Inside encode_translate_decode function",MODULE_CONTEXT)
        model_path = get_model_path(i['id'])
        translator = ctranslate2.Translator(model_path)
        i['src'] = str(sp.encode_line(sp_encoder,i['src']))
        log_info("SP encoded sent: %s"%i['src'],MODULE_CONTEXT)
        input_sw = i['src']
        i_final = format_converter(i['src'])
        # translation, scores, n_best, times = translation_server.run([i])
        m_out = translator.translate_batch([i_final],beam_size = 5,num_hypotheses=1)
        log_info("output from model: %s"%m_out[0],MODULE_CONTEXT)
        output_sw = m_out[0]
        print(m_out)
        scores = m_out[0][0]['score']
        # translation = sp.decode_line(sp_decoder,translation[0])
        translation = multiple_hypothesis_decoding(m_out[0],sp_decoder)[0]
        log_info("SP decoded sent: %s"%translation,MODULE_CONTEXT)
        return translation,scores,input_sw,output_sw
    except ServerModelError as e:
        log_exception("ServerModelError error in encode_translate_decode: {} and {}".format(e,sys.exc_info()[0]),MODULE_CONTEXT,e)
        raise
        
    except Exception as e:
        log_exception("Unexpexcted error in encode_translate_decode: {} and {}".format(e,sys.exc_info()[0]),MODULE_CONTEXT,e)
        raise
        
def format_converter(input):
    inp_1 = input.split(', ')
    inp_2 = [inpt+',' if inpt != inp_1[-1] else inpt for inpt in inp_1 ]
    return inp_2

def get_model_path(model_id):
    with open(ICONFG_FILE) as f:
        confs = json.load(f)
        model_root = confs['models_root']
        models = confs['models']
        path = [ model["path"] for model in models if model["id"] == model_id]
        final_path =  os.path.join(model_root, path[0])
        return final_path

def replace_num_target_prefix(i_,num_map):
    num_tp = re.findall(patterns['p3']['regex'],i_['target_prefix'])
    try:
        for i in num_tp:
            replacement_tag =  [pair['tag'] for pair in num_map if str(pair['no.'])== i]
            if len(replacement_tag) > 0:
                replacement_tag = replacement_tag[0]
                i_['target_prefix'] = i_['target_prefix'].replace(i,replacement_tag)
        log_info("target_prefix after replacing numbers with tag: {}".format(i_['target_prefix']),MODULE_CONTEXT)
        return i_['target_prefix']
    except Exception as e:
        log_exception("Error in interavtive translation-replace_num_target_prefix:{}".format(e),MODULE_CONTEXT,e)
        return i_['target_prefix']

def multiple_hypothesis_decoding(hypotheses,sp_decoder):
    try:
        translations = list()
        for i in hypotheses:
            translation = " ".join(i['tokens'])
            translation = sp.decode_line(sp_decoder,translation)
            translations.append(translation)
        return translations
    except Exception as e:
        log_exception("Error in interactive translation-multiple_hypothesis_decoding:{}".format(e),MODULE_CONTEXT,e)
        raise
       