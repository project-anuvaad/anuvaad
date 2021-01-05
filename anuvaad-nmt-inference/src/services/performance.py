import ctranslate2
import os
import json 
import re
import sys
import time
import math
import numpy as np
from models import CustomResponse, Status
from anuvaad_auditor.loghandler import log_info, log_exception
from utilities import MODULE_CONTEXT
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
from .document_translate import NMTTranslateService


class NMTTranslatePerformanceService:
    '''
    Class to translate and show the profiling of the document translation steps
    '''
    @staticmethod
    def batch_translator(input_dict,max_batch_size,batch_type):
        '''
        Given an input in the form {'model_id':int,'src_list':list}
        returns a dictionary of time taken in various steps during the
        translation of sentences in the list
        '''
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

        time_model_loading, time_preprocessing, time_tokenizing, time_encoding, \
            time_translating, time_decoding, time_detokenizing, time_postprocessing = [0] * 8

        start_loading = time.time()
        sp_encoder, translator, sp_decoder = get_models(model_id)
        time_model_loading = time.time() - start_loading

        input_sentence_array_prepd = [None] * num_sentence
        special_case_sentence_indices = []
        start_preprocessing = time.time()
        try:
            for i,sent in enumerate(src_list):
                input_sentence = sent.strip()
                if special_case_handler.special_case_fits(input_sentence):
                    special_case_sentence_indices.append(i)
                    log_info("sentence fits in special case, capturing index to process at last",MODULE_CONTEXT)
                else:                   
                    prefix_array[i], input_sentence = special_case_handler.prefix_handler(input_sentence)
                    input_sentence,date_original_array[i],url_original_array[i],num_array_array[i],num_map_array[i] = \
                        tagger_util.tag_number_date_url(input_sentence)
                    tagged_src_list[i] = (prefix_array[i] + " " + input_sentence).lstrip() 
                
                input_sentence_array_prepd[i] = input_sentence
            
            time_preprocessing = time.time() - start_preprocessing
            log_info("translating using NMT-model:{}".format(model_id),MODULE_CONTEXT)    
            if model_id == 56:
                "09/12/19-Exp-5.6:" 
                input_sentence_array_prepd = [sentence.title() if sentence.isupper() else sentence for sentence in input_sentence_array_prepd]
                start_tokenizing = time.time()
                input_sentence_array_prepd = [sentence_processor.moses_tokenizer(sentence) for sentence in input_sentence_array_prepd]
                time_tokenizing = time.time() - start_tokenizing
                translation_array, input_subwords_list, output_subwords_list, score_list, time_encoding, time_translating, time_decoding = \
                encode_translate_decode(input_sentence_array_prepd,sp_encoder,translator,sp_decoder,max_batch_size,batch_type,input_subwords_list,output_subwords_list,score_list)                           
                start_detokenizing = time.time()
                translation_array = [sentence_processor.indic_detokenizer(translation)  for translation  in translation_array]
                time_detokenizing = time.time() - start_detokenizing
            else:
                log_info("Unsupported model id: {} for given input".format(model_id),MODULE_CONTEXT)
                raise Exception("Unsupported Model ID - id: {} for given input".format(model_id))    

            start_postprocessing = time.time()
            for i in range(num_sentence):
                if i in special_case_sentence_indices:
                    log_info("sentence fits in special case, returning output accordingly and not from model",MODULE_CONTEXT)
                    tgt_list[i] = special_case_handler.handle_special_cases(src_list[i].strip(),model_id)
                    score_list[i] = 1
                    input_subwords_list[i],output_subwords_list[i],tagged_tgt_list[i],tagged_src_list[i] = \
                        "","",tgt_list[i],src_list[i].strip() 
                else:       
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

            time_postprocessing = time.time() - start_postprocessing     
            
            out = {"time_model_loading": time_model_loading,\
                "time_preprocessing": time_preprocessing,\
                "time_tokenizing": time_tokenizing,\
                "time_encoding": time_encoding,\
                "time_translating": time_translating,\
                "time_decoding": time_decoding,\
                "time_detokenizing": time_detokenizing,\
                "time_postprocessing": time_postprocessing}
        except ServerModelError as e:
            log_exception("ServerModelError error in TRANSLATE_UTIL-translate_func: {} and {}".format(e,sys.exc_info()[0]),MODULE_CONTEXT,e)
            raise e
        except Exception as e:          
            log_exception("Exception caught in NMTTranslateService:batch_translator:%s and %s"% (e,sys.exc_info()[0]),MODULE_CONTEXT,e) 
            raise e

        return out


class BatchNMTPerformanceService:
    '''
    Class to find performance of document translation
    '''
    @staticmethod
    def find_performance(input_text_file,model_id,batch_size):
        '''
        Given an input english text file (with one sentence per line)
        returns average number of words translated per second by the
        document translator
        '''
        try:
            with open(input_text_file,'r') as f:
                input_text_array = f.readlines()
                input_text_array = [sent[:-1] for sent in input_text_array]

            word_count = 0
            for sentence in input_text_array:
                word_count += len(sentence.split())

            batch_input_array = []
            num_of_batch = len(input_text_array) // batch_size
            for i in range(num_of_batch):
                prev_index = i * batch_size
                if (prev_index + batch_size) < len(input_text_array):
                    input_batch = {'id': model_id, 'src_list': input_text_array[prev_index: prev_index + batch_size]}
                else:
                    input_batch = {'id': model_id, 'src_list': input_text_array[prev_index: ]}
                batch_input_array.append(input_batch)

            time_taken_array = []
            out_tgt_array = []
            for batch_input in batch_input_array:
                start = time.time()
                out_batch = NMTTranslateService.batch_translator(batch_input)
                time_taken = time.time() - start
                time_taken_array.append(time_taken)
                out_tgt_array.append(out_batch['tgt_list'])           
            avg_words_per_sec = word_count / sum(time_taken_array)
            out_tgt_array = [sentence for out_batch in out_tgt_array for sentence in out_batch]

            return avg_words_per_sec, out_tgt_array
        
        except Exception as e:
            status = Status.SYSTEM_ERR.value
            log_exception("Exception caught in performance check: {} ".format(e),MODULE_CONTEXT,e)
            out = CustomResponse(status, [])  

        return out

    @staticmethod
    def find_performance_pipeline(input_text_file,model_id,batch_size,max_batch_size,batch_type):
        '''
        Given an input english text file (with one sentence per line)
        returns average time taken per word for each step in the 
        pipeline of translation.
        '''
        try:
            with open(input_text_file,'r') as f:
                input_text_array = f.readlines()
                input_text_array = [sent[:-1] for sent in input_text_array]
            # input_text_array = input_text_array[:500]
            word_count = 0
            for sentence in input_text_array:
                word_count += len(sentence.split())

            batch_input_array = []
            num_of_batch = len(input_text_array) // batch_size
            for i in range(num_of_batch):
                prev_index = i * batch_size
                if (prev_index + batch_size) < len(input_text_array):
                    input_batch = {'id': model_id, 'src_list': input_text_array[prev_index: prev_index + batch_size]}
                else:
                    input_batch = {'id': model_id, 'src_list': input_text_array[prev_index: ]}
                batch_input_array.append(input_batch)

            time_model_loading_array, time_preprocessing_array, time_tokenizing_array, time_encoding_array, \
            time_translating_array, time_decoding_array, time_detokenizing_array, time_postprocessing_array = [],[],[],[],[],[],[],[]
            for batch_input in batch_input_array:
                time_taken_dict = NMTTranslatePerformanceService.batch_translator(batch_input,max_batch_size,batch_type)
                time_model_loading_array.append(time_taken_dict["time_model_loading"])
                time_preprocessing_array.append(time_taken_dict["time_preprocessing"])
                time_tokenizing_array.append(time_taken_dict[ "time_tokenizing"])
                time_encoding_array.append(time_taken_dict["time_encoding"])
                time_translating_array.append(time_taken_dict["time_translating"])
                time_decoding_array.append(time_taken_dict["time_decoding"])
                time_detokenizing_array.append(time_taken_dict["time_detokenizing"])
                time_postprocessing_array.append(time_taken_dict["time_postprocessing"])          

            return sum(time_model_loading_array) /word_count, sum(time_preprocessing_array) /word_count,\
                sum(time_tokenizing_array) /word_count, sum(time_encoding_array) /word_count,\
                    sum(time_translating_array) /word_count, sum(time_decoding_array) /word_count,\
                        sum(time_detokenizing_array) /word_count, sum(time_postprocessing_array) /word_count
        
        except Exception as e:
            status = Status.SYSTEM_ERR.value
            log_exception("Exception caught in performance check: {} ".format(e),MODULE_CONTEXT,e)
            out = CustomResponse(status, [])  

        return out

def get_models(model_id):
    try:
        _ ,sp_encoder,sp_decoder = get_model_path(model_id)
        translator = load_models.loaded_models[model_id]
        return sp_encoder, translator, sp_decoder
    except Exception as e:
        log_exception("Exception caught in document_translate service:get_models: {} ".format(e),MODULE_CONTEXT,e)
        raise  

def encode_translate_decode(input_sentence_array_prepd,sp_encoder,translator,sp_decoder,max_batch_size,batch_type,input_subwords_list,output_subwords_list,score_list):
    try:
        log_info("Inside encode_translate_decode function",MODULE_CONTEXT)
        start_encoding = time.time()
        input_subwords_list = [str(sp.encode_line(sp_encoder,sent)) for sent in input_sentence_array_prepd]
        input_final_array = [format_converter(input_subwords) for input_subwords in input_subwords_list]
        time_encoding = time.time() - start_encoding
        start_translating = time.time()
        m_out = translator.translate_batch(input_final_array,beam_size = 5,num_hypotheses=1,max_batch_size=max_batch_size,batch_type=batch_type)
        time_translating = time.time() - start_translating
        translation_array = [None] * len(output_subwords_list)
        start_decoding = time.time()
        for i, _ in enumerate(output_subwords_list):
                output_subwords_list[i] = " ".join(m_out[i][0]['tokens'])
                score_list[i] = m_out[i][0]['score']
                translation_array[i] = multiple_hypothesis_decoding(m_out[i],sp_decoder)[0]
        time_decoding = time.time() - start_decoding

        return translation_array, input_subwords_list, output_subwords_list, score_list, time_encoding, time_translating, \
            time_decoding

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
        if len(path) == 0:
            raise Exception("Model id:{} is not valid".format(model_id))
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
          