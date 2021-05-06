import ctranslate2
from models import CustomResponse, Status
from anuvaad_auditor.loghandler import log_info, log_exception
from utilities import MODULE_CONTEXT
import os
import json 
import sys
import re
import utilities.sentencepiece_util as sp
import utilities.sentence_processor as sentence_processor
import utilities.special_case_handler as special_case_handler
import utilities.tagger_util as tagger_util
import utilities.misc as misc
import utilities.output_cleaner as oc
from config.regex_patterns import patterns
from onmt.translate import ServerModelError
import config
import datetime
from services import load_models


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
                sentence_id.append(i.get("s_id") or "NA")
                if  any(v not in i for v in ['src','id']):
                    log_info("either id or src missing in some input",MODULE_CONTEXT)
                    out = CustomResponse(Status.ID_OR_SRC_MISSING.value, inputs)
                    return out

                log_info("input sentence:{}".format(i['src']),MODULE_CONTEXT) 
                i_src.append(i['src'])   
                i['src'] = i['src'].strip() 

                i['src_lang'], i['tgt_lang'] = misc.get_src_tgt_langauge(i['id'])
                i['src'] = misc.convert_digits_preprocess(i['src_lang'],i['src'])
  
                if special_case_handler.special_case_fits(i['src']):
                    log_info("sentence fits in special case, returning accordingly and not going to model",MODULE_CONTEXT)
                    translation = special_case_handler.handle_special_cases(i['src'],i['id'])
                    translation = [translation]
                    tag_tgt,tag_src = translation,i['src']

                else:
                    log_info("Performing interactive translation on:{}".format(i['id']),MODULE_CONTEXT)
                    i['src'],date_original,url_original,num_array,num_map = tagger_util.tag_number_date_url(i['src'])
                    tag_src = i['src'] 

                    if i['id'] == 56:
                        "english-hindi"
                        if i['src'].isupper():
                            log_info("src all Upper case hence Tital casing it",MODULE_CONTEXT)
                            i['src'] = i['src'].title()
                        tp_tokenizer = sentence_processor.indic_tokenizer
                        i['src'] = sentence_processor.moses_tokenizer(i['src'])
                        translation = encode_itranslate_decode(i,num_map,tp_tokenizer)
                        translation = [sentence_processor.indic_detokenizer(i) for i in translation]
                    elif i['id'] == 7:
                        "english-tamil"
                        translation = encode_itranslate_decode(i,num_map,tp_tokenizer)
                    elif i['id'] == 10:  
                        "english-gujarati"
                        translation = encode_itranslate_decode(i,num_map,tp_tokenizer)                                               
                    elif i['id'] == 18:  
                        "english-punjabi"
                        translation = encode_itranslate_decode(i,num_map,tp_tokenizer)
                    elif i['id'] == 42:  
                        "english-marathi"
                        translation = encode_itranslate_decode(i,num_map,tp_tokenizer)
                    elif i['id'] == 6:
                        "hindi-english"
                        tp_tokenizer = sentence_processor.moses_tokenizer
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation = encode_itranslate_decode(i,num_map,tp_tokenizer)
                        translation = [sentence_processor.moses_detokenizer(i) for i in translation]
                    elif i['id'] == 55:
                        "punjabi-english"
                        tp_tokenizer = sentence_processor.moses_tokenizer 
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation = encode_itranslate_decode(i,num_map,tp_tokenizer)
                        translation = [sentence_processor.moses_detokenizer(i) for i in translation]  
                    elif i['id'] == 52:
                        "gujarati-english"
                        tp_tokenizer = sentence_processor.moses_tokenizer 
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation = encode_itranslate_decode(i,num_map,tp_tokenizer)
                        translation = [sentence_processor.moses_detokenizer(i) for i in translation]    
                    elif i['id'] == 65:
                        "english-bengali 4th"
                        tp_tokenizer = sentence_processor.indic_tokenizer
                        i['src'] = sentence_processor.moses_tokenizer(i['src'])
                        translation = encode_itranslate_decode(i,num_map,tp_tokenizer)
                        translation = [sentence_processor.indic_detokenizer(i) for i in translation]
                    elif i['id'] == 66:
                        "bengali-english 3rd"
                        tp_tokenizer = sentence_processor.moses_tokenizer 
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation = encode_itranslate_decode(i,num_map,tp_tokenizer)
                        translation = [sentence_processor.moses_detokenizer(i) for i in translation]                                              
                    elif i['id'] in range(67,81):
                        if i['tgt_lang'] == "en":
                            tp_tokenizer = sentence_processor.moses_tokenizer 
                            i['src'] = sentence_processor.indic_tokenizer(i['src'])
                            translation = encode_itranslate_decode_v2(i,num_map,tp_tokenizer)
                            translation = [sentence_processor.moses_detokenizer(i) for i in translation] 
                        else:
                            tp_tokenizer = sentence_processor.indic_tokenizer 
                            i['src'] = sentence_processor.moses_tokenizer(i['src'])
                            translation = encode_itranslate_decode_v2(i,num_map,tp_tokenizer)
                            translation = [sentence_processor.indic_detokenizer(i) for i in translation] 
                    else:
                        log_info("unsupported model id: {} for given input".format(i['id']),MODULE_CONTEXT)
                        raise Exception("Unsupported Model ID - id: {} for given input".format(i['id']))      

                    translation = [i.replace("▁"," ") for i in translation]
                    translation = [misc.regex_pass(i,[patterns['p8'],patterns['p9'],patterns['p4'],patterns['p5'],
                                                patterns['p6'],patterns['p7']]) for i in translation]
                    tag_tgt = translation
                    translation = [tagger_util.replace_tags_with_original(i,date_original,url_original,num_array,num_map) for i in translation]
                    translation = [misc.convert_digits_postprocess(i['tgt_lang'],item) for item in translation]
                log_info("interactive translation-experiment-{} output: {}".format(i['id'],translation),MODULE_CONTEXT)  
                tgt.append(translation)
                tagged_tgt.append(tag_tgt)
                tagged_src.append(tag_src)

            out['response_body'] = [{"tgt": tgt[i],"tagged_tgt":tagged_tgt[i],
                                    "tagged_src":tagged_src[i],"s_id":sentence_id[i],"src":i_src[i]}
                    for i in range(len(tgt))]
            out = CustomResponse(Status.SUCCESS.value, out['response_body'])
        except Exception as e:
            status = Status.SYSTEM_ERR.value
            status['message'] = str(e)
            log_exception("Unexpected error:%s and %s"% (e,sys.exc_info()[0]),MODULE_CONTEXT,e) 
            out = CustomResponse(status, inputs)  

        return out

class OpenNMTTranslateService:
    @staticmethod
    def translate_func(inputs):

        inputs = inputs
        out = {}
        pred_score = list()
        sentence_id,node_id = list(),list()
        input_subwords,output_subwords = list(),list()
        i_src,tgt = list(),list()
        tagged_tgt,tagged_src = list(),list()
        s_id,n_id = [0000],[0000]
        i_s0_src,i_s0_tgt,i_save = list(),list(),list()
        i_tmx_phrases = list()

        try:
            for i in inputs:
                s0_src,s0_tgt,save = "NA","NA",False
                if all(v in i for v in ['s_id','n_id']):
                    s_id = [i['s_id']]
                    n_id = [i['n_id']]  
                    
                if  any(v not in i for v in ['src','id']):
                    log_info("either id or src missing in some input",MODULE_CONTEXT)
                    out = CustomResponse(Status.ID_OR_SRC_MISSING.value, inputs)
                    return out
               
                if any(v in i for v in ['s0_src','s0_tgt','save']):
                    s0_src,s0_tgt,save = handle_custome_input(i,s0_src,s0_tgt,save)
                    
                i_s0_src.append(s0_src),i_s0_tgt.append(s0_tgt),i_save.append(save)    

                log_info("input sentences:{}".format(i['src']),MODULE_CONTEXT) 
                i_src.append(i['src'])   
                i['src'] = i['src'].strip()

                src_language, tgt_language = misc.get_src_tgt_langauge(i['id'])
                if src_language == 'en' and i['src'].isupper():
                    i['src'] = i['src'].title()
                i['src'] = misc.convert_digits_preprocess(src_language,i['src'])

                if special_case_handler.special_case_fits(i['src']):
                    log_info("sentence fits in special case, returning accordingly and not going to model",MODULE_CONTEXT)
                    translation = special_case_handler.handle_special_cases(i['src'],i['id'])
                    scores = [1] 
                    input_sw,output_sw,tag_tgt,tag_src = "","",translation,i['src']

                else:
                    log_info("translating using NMT-model:{}".format(i['id']),MODULE_CONTEXT)
                    prefix, i['src'] = special_case_handler.prefix_handler(i['src'])
                    i['src'],date_original,url_original,num_array,num_map = tagger_util.tag_number_date_url(i['src'])
                    tag_src = (prefix +" "+ i['src']).lstrip() 

                    i['src'], is_missing_stop_punc = special_case_handler.handle_a_sentence_wo_stop(src_language,i['src'])

                    if i['id'] == 6:
                        "hi-en_exp-2 05-05-20"
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i)
                        translation = sentence_processor.moses_detokenizer(translation)

                    elif i['id'] == 7:  
                        "english-tamil"
                        translation,scores,input_sw,output_sw = encode_translate_decode(i)
                    elif i['id'] == 10:  
                        "english-gujrati"
                        translation,scores,input_sw,output_sw = encode_translate_decode(i)      
                    elif i['id'] == 18:  
                        "english-punjabi"
                        translation,scores,input_sw,output_sw = encode_translate_decode(i)
                    elif i['id'] == 42:  
                        "english-marathi exp-2"
                        translation,scores,input_sw,output_sw = encode_translate_decode(i)    
                    elif i['id'] == 56:
                        "09/12/19-Exp-5.6:" 
                        i['src'] = sentence_processor.moses_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i)                      
                        translation = sentence_processor.indic_detokenizer(translation)
                    elif i['id'] == 52:
                        "guj-en 1st"
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i)
                        translation = sentence_processor.moses_detokenizer(translation)
                    elif i['id'] == 55:
                        "punjabi-en 1st"
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i)
                        translation = sentence_processor.moses_detokenizer(translation)
                    elif i['id'] == 65:
                        "en-bengali 4th"
                        i['src'] = sentence_processor.moses_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i)
                        translation = sentence_processor.indic_detokenizer(translation) 
                    elif i['id'] == 66:
                        "bengali-en 3rd"
                        i['src'] = sentence_processor.indic_tokenizer(i['src'])
                        translation,scores,input_sw,output_sw = encode_translate_decode(i)
                        translation = sentence_processor.moses_detokenizer(translation)                                                                           
                    elif i['id'] in range(67,81):
                        if tgt_language == "en":
                            i['src'] = sentence_processor.indic_tokenizer(i['src'])
                            translation,scores,input_sw,output_sw = encode_translate_decode_v2(i)
                            translation = sentence_processor.moses_detokenizer(translation) 
                        else:
                            i['src'] = sentence_processor.moses_tokenizer(i['src'])
                            translation,scores,input_sw,output_sw = encode_translate_decode_v2(i)
                            translation = sentence_processor.indic_detokenizer(translation) 
                    else:
                        log_info("Unsupported model id: {} for given input".format(i['id']),MODULE_CONTEXT)
                        raise Exception("Unsupported Model ID - id: {} for given input".format(i['id']))      

                    translation = oc.postprocess_a_sentence_wo_stop(tgt_language, translation, is_missing_stop_punc)
                    translation = (prefix+" "+translation).lstrip()
                    translation = translation.replace("▁"," ")
                    translation = misc.regex_pass(translation,[patterns['p8'],patterns['p9'],patterns['p4'],patterns['p5'],
                                                patterns['p6'],patterns['p7']])
                    tag_tgt = translation                            
                    translation = tagger_util.replace_tags_with_original(translation,date_original,url_original,num_array,num_map)
                    translation = oc.cleaner(tag_src,translation,i['id'])
                    translation = misc.convert_digits_postprocess(tgt_language,translation)
                log_info("translate_function-experiment-{} output: {}".format(i['id'],translation),MODULE_CONTEXT) 
                tgt.append(translation)
                pred_score.append(scores)
                sentence_id.append(s_id[0]), node_id.append(n_id[0])
                input_subwords.append(input_sw), output_subwords.append(output_sw)
                tagged_tgt.append(tag_tgt), tagged_src.append(tag_src)
                i_tmx_phrases.append(i.get("tmx_phrases",[]))

            out['response_body'] = [{"tgt": tgt[i],
                    "pred_score": pred_score[i], "s_id": sentence_id[i],"input_subwords": input_subwords[i],
                    "output_subwords":output_subwords[i],"n_id":node_id[i],"src":i_src[i],
                    "tagged_tgt":tagged_tgt[i],"tagged_src":tagged_src[i],"save":i_save[i],"s0_src":i_s0_src[i],"s0_tgt":i_s0_tgt[i],
                    "tmx_phrases":i_tmx_phrases[i]}
                    for i in range(len(tgt))]
            out = CustomResponse(Status.SUCCESS.value, out['response_body'])
        except ServerModelError as e:
            status = Status.SEVER_MODEL_ERR.value
            status['message'] = str(e)
            log_exception("ServerModelError error in TRANSLATE_UTIL-translate_func: {} and {}".format(e,sys.exc_info()[0]),MODULE_CONTEXT,e)
            out = CustomResponse(status, inputs)  
        except Exception as e:
            status = Status.SYSTEM_ERR.value
            status['message'] = str(e)
            log_exception("Unexpected error:%s and %s"% (e,sys.exc_info()[0]),MODULE_CONTEXT,e) 
            out = CustomResponse(status, inputs)    

        return out
     
def encode_itranslate_decode(i,num_map,tp_tokenizer,num_hypotheses=1):
    try:
        log_info("Inside encode_itranslate_decode function",MODULE_CONTEXT)
        model_path,sp_encoder,sp_decoder = get_model_path(i['id'])
        translator = load_models.loaded_models[i['id']]
        i['src'] = str(sp.encode_line(sp_encoder,i['src']))
        i_final = format_converter(i['src'])

        if 'target_prefix' in i and len(i['target_prefix']) > 0 and i['target_prefix'].isspace() == False:
            log_info("target prefix: {}".format(i['target_prefix']),MODULE_CONTEXT) 
            i['target_prefix'] = misc.convert_digits_preprocess(i['tgt_lang'],i['target_prefix'])
            i['target_prefix'] = replace_num_target_prefix(i,num_map)
            if tp_tokenizer is not None:
                i['target_prefix'] = tp_tokenizer(i['target_prefix'])
            i['target_prefix'] = str(sp.encode_line(sp_decoder,i['target_prefix']))
            tp_final = format_converter(i['target_prefix'])
            tp_final[-1] = tp_final[-1].replace(']',",")
            m_out = translator.translate_batch([i_final],beam_size = 5, target_prefix = [tp_final],num_hypotheses=num_hypotheses,replace_unknowns=True)
        else:
            m_out = translator.translate_batch([i_final],beam_size = 5,num_hypotheses=num_hypotheses,replace_unknowns=True)

        translation = multiple_hypothesis_decoding(m_out[0],sp_decoder)    
        return translation
        
    except Exception as e:
        log_exception("Unexpexcted error in encode_itranslate_decode: {} and {}".format(e,sys.exc_info()[0]),MODULE_CONTEXT,e)
        raise 

def encode_itranslate_decode_v2(i,num_map,tp_tokenizer,num_hypotheses=1):
    try:
        log_info("Inside encode_itranslate_decode_v2 function",MODULE_CONTEXT)
        model_path,sp_encoder,sp_decoder = get_model_path(i['id'])
        translator = load_models.loaded_models[i['id']]
        i['src'] = sp.encode_line_v2(sp_encoder,i['src'])

        if 'target_prefix' in i and len(i['target_prefix']) > 0 and i['target_prefix'].isspace() == False:
            log_info("target prefix: {}".format(i['target_prefix']),MODULE_CONTEXT) 
            i['target_prefix'] = misc.convert_digits_preprocess(i['tgt_lang'],i['target_prefix'])
            i['target_prefix'] = replace_num_target_prefix(i,num_map)
            if tp_tokenizer is not None:
                i['target_prefix'] = tp_tokenizer(i['target_prefix'])
            i['target_prefix'] = sp.encode_line_v2(sp_decoder,i['target_prefix'])
            tp_final = i['target_prefix']
            tp_final[-1] = tp_final[-1].replace(']',",")
            m_out = translator.translate_batch([i['src']],beam_size = 5, target_prefix = [tp_final],num_hypotheses=num_hypotheses,replace_unknowns=True)
        else:
            m_out = translator.translate_batch([i['src']],beam_size = 5,num_hypotheses=num_hypotheses,replace_unknowns=True)

        translation = multiple_hypothesis_decoding_v2(m_out[0],sp_decoder)    
        return translation
        
    except Exception as e:
        log_exception("Unexpexcted error in encode_itranslate_decode: {} and {}".format(e,sys.exc_info()[0]),MODULE_CONTEXT,e)
        raise     

def encode_translate_decode(i):
    try:
        log_info("Inside encode_translate_decode function",MODULE_CONTEXT)
        model_path,sp_encoder,sp_decoder = get_model_path(i['id'])
        translator = load_models.loaded_models[i['id']]
        i['src'] = str(sp.encode_line(sp_encoder,i['src']))
        log_info("SP encoded sent: %s"%i['src'],MODULE_CONTEXT)
        input_sw = i['src']
        i_final = format_converter(i['src'])
        m_out = translator.translate_batch([i_final],beam_size = 5,num_hypotheses=1,replace_unknowns=True)
        output_sw = " ".join(m_out[0][0]['tokens'])
        log_info("output from model: {}".format(output_sw),MODULE_CONTEXT)
        scores = m_out[0][0]['score']
        translation = multiple_hypothesis_decoding(m_out[0],sp_decoder)[0]
        log_info("SP decoded sent: %s"%translation,MODULE_CONTEXT)
        return translation,scores,input_sw,output_sw
    except ServerModelError as e:
        log_exception("ServerModelError error in encode_translate_decode: {} and {}".format(e,sys.exc_info()[0]),MODULE_CONTEXT,e)
        raise
        
    except Exception as e:
        log_exception("Unexpexcted error in encode_translate_decode: {} and {}".format(e,sys.exc_info()[0]),MODULE_CONTEXT,e)
        raise

def encode_translate_decode_v2(i):
    try:
        log_info("Inside encode_translate_decode_v2 function",MODULE_CONTEXT)
        model_path,sp_encoder,sp_decoder = get_model_path(i['id'])
        translator = load_models.loaded_models[i['id']]
        i['src'] = sp.encode_line_v2(sp_encoder,i['src'])
        log_info("SP encoded sent: %s"%str(i['src']),MODULE_CONTEXT)
        input_sw = str(i['src'])
        m_out = translator.translate_batch([i['src']],beam_size = 5,num_hypotheses=1)
        output_sw = " ".join(m_out[0][0]['tokens'])
        log_info("output from model: {}".format(output_sw),MODULE_CONTEXT)
        scores = m_out[0][0]['score']
        translation = multiple_hypothesis_decoding_v2(m_out[0],sp_decoder)[0]
        log_info("SP decoded sent: %s"%str(translation),MODULE_CONTEXT)
        return translation,scores,input_sw,output_sw
    except ServerModelError as e:
        log_exception("ServerModelError error in encode_translate_decode_v2: {} and {}".format(e,sys.exc_info()[0]),MODULE_CONTEXT,e)
        raise     
    except Exception as e:
        log_exception("Unexpexcted error in encode_translate_decode_v2: {} and {}".format(e,sys.exc_info()[0]),MODULE_CONTEXT,e)
        raise
        
        
def format_converter(input):
    inp_1 = input.split(', ')
    inp_2 = [inpt+',' if inpt != inp_1[-1] else inpt for inpt in inp_1 ]
    return inp_2

def get_model_path(model_id):
    with open(config.ICONFG_FILE) as f:
        confs = json.load(f)
        model_root = confs['models_root']
        models = confs['models']
        path = [(model["path"],model["sp_encoder"],model["sp_decoder"]) for model in models if model["id"] == model_id]
        final_path =  os.path.join(model_root, path[0][0])
        s_encoder = os.path.join(model_root, path[0][1])
        s_decoder = os.path.join(model_root, path[0][2])
        return final_path,s_encoder,s_decoder    

def replace_num_target_prefix(i_,num_map):
    num_tp = re.findall(patterns['p12']['regex'],i_['target_prefix'])
    try:
        for pair_dict in num_map:
            if pair_dict['no.'] in num_tp:
                replacement_tag = pair_dict['tag']   
                i_['target_prefix'] = i_['target_prefix'].replace(pair_dict['no.'],replacement_tag,1)

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
    
def multiple_hypothesis_decoding_v2(hypotheses,sp_decoder):
    try:
        translations = list()
        for i in hypotheses:
            translation = " ".join(i['tokens'])
            translation = sp.decode_line_v2(sp_decoder,translation)
            translations.append(translation)
        return translations
    except Exception as e:
        log_exception("Error in interactive translation-multiple_hypothesis_decoding_v2:{}".format(e),MODULE_CONTEXT,e)
        raise    
       
       
def handle_custome_input(i,s0_src,s0_tgt,save):
    '''
    Meant for translate_anuvaad api to support save operation in UI
    '''
    if 'save' in i:
        save = i["save"]
    if "s0_src" in i:  
        s0_src = i["s0_src"]       
    if "s0_tgt" in i:      
        s0_tgt = i["s0_tgt"] 
        
    return s0_src,s0_tgt,save       