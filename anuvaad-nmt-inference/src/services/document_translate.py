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
# from config import sentencepiece_model_loc as sp_model
from config.regex_patterns import patterns
from onmt.translate import ServerModelError
import config
import datetime
from services import load_models


class NMTTranslateService:
    @staticmethod
    def batch_translator(input_dict):

        model_id = input_dict['id']
        src_list = input_dict['src_list']
        num_sentence = len(src_list)
        input_subwords_list = [None] * num_sentence
        output_subwords_list = [None] * num_sentence
        tagged_src_list = [None] * num_sentence
        tagged_tgt_list = [None] * num_sentence
        tgt_list = [None] * num_sentence
        score_list = [None] * num_sentence
        out = {}

        date_original_array = [None] * num_sentence
        url_original_array = [None] * num_sentence
        num_array_array = [None] * num_sentence
        num_map_array = [None] * num_sentence
        prefix_array = [None] * num_sentence

        sp_encoder, translator, sp_decoder = get_models(model_id)

        # pred_score = list()
        # input_subwords,output_subwords = list(),list()
        # i_src,tgt = list(),list()
        # tagged_tgt,tagged_src = list(),list()
        input_sentence_array_prepd = [None] * num_sentence
        try:
            for i,sent in enumerate(src_list):
                log_info("input sentence:{}".format(sent),MODULE_CONTEXT)   
                input_sentence = sent.strip()
                special_case_sentence_indices = []
                if special_case_handler.special_case_fits(input_sentence):
                    special_case_sentence_indices.append(i)
                    # log_info("sentence fits in special case, returning accordingly and not going to model",MODULE_CONTEXT)
                    # tgt_list[i] = special_case_handler.handle_special_cases(input_sentence,model_id)
                    # score_list[i] = 1
                    # input_subwords_list[i],output_subwords_list[i],tagged_tgt_list[i],tagged_src_list[i] = \
                    #     "","",tgt_list[i],input_sentence

                else:
                    log_info("translating using NMT-model:{}".format(model_id),MODULE_CONTEXT)
                    prefix_array[i], input_sentence = special_case_handler.prefix_handler(input_sentence)
                    input_sentence,date_original_array[i],url_original_array[i],num_array_array[i],num_map_array[i] = \
                        tagger_util.tag_number_date_url(input_sentence)
                    tagged_src_list[i] = (prefix_array[i] + " " + input_sentence).lstrip() 
                
                input_sentence_array_prepd[i] = input_sentence
                
            if model_id == 5:
                "hi-en exp-1"
                input_sentence_array_tokenized = [sentence_processor.indic_tokenizer(sentence) for sentence in input_sentence_array_prepd]
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)     
                translation_array = [sentence_processor.moses_detokenizer(translation) for translation in translation_array]
            elif model_id == 6:
                "hi-en_exp-2 05-05-20"
                input_sentence_array_tokenized = [sentence_processor.indic_tokenizer(sentence) for sentence in input_sentence_array_prepd]
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)     
                translation_array = [sentence_processor.moses_detokenizer(translation) for translation in translation_array]

            elif model_id == 7:  
                "english-tamil"
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)     
            elif model_id == 10:  
                "english-gujrati"
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)     
                translation = translation.replace("ન્યાય માટે Accessક્સેસને","ન્યાયની પહોંચને")
            elif model_id == 11:  
                "english-bengali"
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)                   

            elif model_id == 15:  
                "english-kannada"
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)     
                translation = translation.replace("uc","")
            elif model_id == 16:  
                "english-telgu"
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)     
            elif model_id == 17:  
                "english-malayalam"
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)     
            elif model_id == 18:  
                "english-punjabi"
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)     
            elif model_id == 32:
                "29/10/2019 Exp-12: old_data_original+lc_cleaned+ ik names translated from google(100k)+shabdkosh(appended 29k new),BPE-24K,50knmt,shuff,pretok"
                input_sentence_array_tokenized = [sentence_processor.moses_tokenizer(sentence) for sentence in input_sentence_array_prepd]
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)                           
                translation_array = [sentence_processor.indic_detokenizer(translation) for translation  in translation_array]
            elif model_id == 42:  
                "english-marathi exp-2"
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)         
            elif model_id == 56:
                "09/12/19-Exp-5.6:" 
                input_sentence_array_prepd = [sentence.title() if sentence.isupper() else sentence for sentence in input_sentence_array_prepd]
                input_sentence_array_tokenized = [sentence_processor.moses_tokenizer(sentence) for sentence in input_sentence_array_prepd]
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)                           
                translation_array = [sentence_processor.indic_detokenizer(translation)  for translation  in translation_array]
            elif model_id == 8:
                "ta-en 1st"
                input_sentence_array_tokenized = [sentence_processor.indic_tokenizer(sentence) for sentence in input_sentence_array_prepd]
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)     
                translation_array = [sentence_processor.moses_detokenizer(translation) for translation in translation_array]   
            elif model_id == 44:
                "eng-mr-3rd"
                input_sentence_array_tokenized = [sentence_processor.moses_tokenizer(sentence) for sentence in input_sentence_array_prepd]
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)     
                translation_array = [sentence_processor.indic_detokenizer(translation)  for translation  in translation_array]         
            elif model_id == 45:
                "en-ta 4th"
                input_sentence_array_tokenized = [sentence_processor.moses_tokenizer(sentence) for sentence in input_sentence_array_prepd]
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)     
                translation_array = [sentence_processor.indic_detokenizer(translation)  for translation  in translation_array]   
            elif model_id == 47:
                "en-kn 2nd"
                input_sentence_array_tokenized = [sentence_processor.moses_tokenizer(sentence) for sentence in input_sentence_array_prepd]
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)     
                translation_array = [sentence_processor.indic_detokenizer(translation)  for translation  in translation_array] 
            elif model_id == 48:
                "kn-en 1st"
                input_sentence_array_tokenized = [sentence_processor.indic_tokenizer(sentence) for sentence in input_sentence_array_prepd]
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)     
                translation_array = [sentence_processor.moses_detokenizer(translation) for translation in translation_array]
            elif model_id == 49:
                "en-tel 2nd"
                input_sentence_array_tokenized = [sentence_processor.moses_tokenizer(sentence) for sentence in input_sentence_array_prepd]
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)     
                translation_array = [sentence_processor.indic_detokenizer(translation)  for translation  in translation_array] 
            elif model_id == 50:
                "tel-en 1st"
                input_sentence_array_tokenized = [sentence_processor.indic_tokenizer(sentence) for sentence in input_sentence_array_prepd]
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)     
                translation_array = [sentence_processor.moses_detokenizer(translation) for translation in translation_array]
            elif model_id == 51:
                "en-guj 2nd"
                input_sentence_array_tokenized = [sentence_processor.moses_tokenizer(sentence) for sentence in input_sentence_array_prepd]
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)     
                translation_array = [sentence_processor.indic_detokenizer(translation)  for translation  in translation_array] 
            elif model_id == 52:
                "guj-en 1st"
                input_sentence_array_tokenized = [sentence_processor.indic_tokenizer(sentence) for sentence in input_sentence_array_prepd]
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)     
                translation_array = [sentence_processor.moses_detokenizer(translation) for translation in translation_array]
            elif model_id == 53:
                "en-punjabi 2nd"
                input_sentence_array_tokenized = [sentence_processor.moses_tokenizer(sentence) for sentence in input_sentence_array_prepd]
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)     
                translation_array = [sentence_processor.indic_detokenizer(translation)  for translation  in translation_array] 
            elif model_id == 55:
                "punjabi-en 1st"
                input_sentence_array_tokenized = [sentence_processor.indic_tokenizer(sentence) for sentence in input_sentence_array_prepd]
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)     
                translation_array = [sentence_processor.moses_detokenizer(translation) for translation in translation_array]
            elif model_id == 57:
                "en-bengali 2nd"
                input_sentence_array_tokenized = [sentence_processor.moses_tokenizer(sentence) for sentence in input_sentence_array_prepd]
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)     
                translation_array = [sentence_processor.indic_detokenizer(translation)  for translation  in translation_array] 
            elif model_id == 58:
                "bengali-en 1st"
                input_sentence_array_tokenized = [sentence_processor.indic_tokenizer(sentence) for sentence in input_sentence_array_prepd]
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)     
                translation_array = [sentence_processor.moses_detokenizer(translation) for translation in translation_array]
            elif model_id == 59:
                "en-malay 2nd"
                input_sentence_array_tokenized = [sentence_processor.moses_tokenizer(sentence) for sentence in input_sentence_array_prepd]
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)     
                translation_array = [sentence_processor.indic_detokenizer(translation)  for translation  in translation_array] 
            elif model_id == 60:
                "malay-en 1st"
                input_sentence_array_tokenized = [sentence_processor.indic_tokenizer(sentence) for sentence in input_sentence_array_prepd]
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)     
                translation_array = [sentence_processor.moses_detokenizer(translation) for translation in translation_array]
            elif model_id == 61:
                "ta-to-en 3rd"
                input_sentence_array_tokenized = [sentence_processor.indic_tokenizer(sentence) for sentence in input_sentence_array_prepd]
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)     
                translation_array = [sentence_processor.moses_detokenizer(translation) for translation in translation_array] 
            elif model_id == 62:
                "mr-to-en 2nd"
                input_sentence_array_tokenized = [sentence_processor.indic_tokenizer(sentence) for sentence in input_sentence_array_prepd]
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)     
                translation_array = [sentence_processor.moses_detokenizer(translation) for translation in translation_array]
            elif model_id == 63:
                "en-hi exp-13 09-03-20"  
                input_sentence_array_tokenized = [sentence_processor.moses_tokenizer(sentence) for sentence in input_sentence_array_prepd]
                translation_array, input_subwords_list, output_subwords_list, score_list = \
                encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list)                           
                translation_array = [sentence_processor.indic_detokenizer(translation)  for translation  in translation_array]                                                     
            else:
                log_info("Unsupported model id: {} for given input".format(model_id),MODULE_CONTEXT)
                raise Exception("Unsupported Model ID - id: {} for given input".format(model_id))      

            for i in range(num_sentence):
                translation_array[i] = (prefix_array[i] +" "+translation_array[i]).lstrip()
                translation_array[i] = translation_array[i].replace("▁"," ")
                translation_array[i] = misc.regex_pass(translation_array[i],[patterns['p8'],patterns['p9'],patterns['p4'],patterns['p5'],
                                    patterns['p6'],patterns['p7']])
                tagged_tgt_list[i] = translation_array[i]                           
                translation_array[i] = tagger_util.replace_tags_with_original(translation_array[i],\
                    date_original_array[i],url_original_array[i],num_array_array[i],num_map_array[i])
                translation_array[i] = oc.cleaner(tagged_src_list[i],translation_array[i],model_id)
                tgt_list[i] = translation_array[i]
                log_info("translate_function-experiment-{} output: {}".format(model_id,translation_array[i]),MODULE_CONTEXT)
                
                if i in special_case_sentence_indices:
                    log_info("sentence fits in special case, returning accordingly and not going to model",MODULE_CONTEXT)
                    tgt_list[i] = special_case_handler.handle_special_cases(src_list[i].strip(),model_id)
                    score_list[i] = 1
                    input_subwords_list[i],output_subwords_list[i],tagged_tgt_list[i],tagged_src_list[i] = \
                        "","",tgt_list[i],input_sentence 
            # tgt.append(translation)
            # pred_score.append(scores)
            # input_subwords.append(input_sw), output_subwords.append(output_sw)
            # tagged_tgt.append(tag_tgt), tagged_src.append(tag_src)

            # out['response_body'] = [{"tgt": tgt[i],
            #         "pred_score": pred_score[i], "input_subwords": input_subwords[i],
            #         "output_subwords":output_subwords[i],"src":i_src[i],
            #         "tagged_tgt":tagged_tgt[i],"tagged_src":tagged_src[i]}
            #         for i in range(len(tgt))]
            out = {"tagged_src_list":tagged_src_list,"tagged_tgt_list":tagged_tgt_list,"tgt_list":tgt_list}
            # print(out)
            # out = CustomResponse(Status.SUCCESS.value, out['response_body'])
        except ServerModelError as e:
            log_exception("ServerModelError error in TRANSLATE_UTIL-translate_func: {} and {}".format(e,sys.exc_info()[0]),MODULE_CONTEXT,e)
            raise e
        except Exception as e:          
            log_exception("Unexpected error:%s and %s"% (e,sys.exc_info()[0]),MODULE_CONTEXT,e) 
            raise e

        return out

def get_models(model_id):
    try:
        _ ,sp_encoder,sp_decoder = get_model_path(model_id)
        translator = load_models.loaded_models[model_id]
        return sp_encoder, translator, sp_decoder
    except Exception as e:
        log_exception("Unexpexcted error in get_models: {} and {}".format(e,sys.exc_info()[0]),MODULE_CONTEXT,e)
        raise  

def encode_translate_decode(input_sentence_array_tokenized,sp_encoder,translator,sp_decoder,input_subwords_list,output_subwords_list,score_list):
    try:
        log_info("Inside encode_translate_decode function",MODULE_CONTEXT)
        input_subwords_list = [str(sp.encode_line(sp_encoder,sent)) for sent in input_sentence_array_tokenized]
        input_final_array = [format_converter(input_subwords) for input_subwords in input_subwords_list]
        m_out = translator.translate_batch(input_final_array,beam_size = 5,num_hypotheses=1)
        translation_array = [None] * len(output_subwords_list)
        for i, _ in enumerate(output_subwords_list):
                output_subwords_list[i] = " ".join(m_out[i][0]['tokens'])
                score_list[i] = m_out[i][0]['score']
                translation_array[i] = multiple_hypothesis_decoding(m_out[i],sp_decoder)[0]
        return translation_array, input_subwords_list, output_subwords_list, score_list
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
       
       
# def handle_custome_input(i,s0_src,s0_tgt,save):
#     '''
#     Meant for translate_anuvaad api to support save operation in UI
#     '''
#     if 'save' in i:
#         save = i["save"]
#     if "s0_src" in i:  
#         s0_src = i["s0_src"]       
#     if "s0_tgt" in i:      
#         s0_tgt = i["s0_tgt"] 
        
#     return s0_src,s0_tgt,save       