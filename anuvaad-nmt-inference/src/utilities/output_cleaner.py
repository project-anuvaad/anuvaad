'''
Aims to modify/clean the translated sentence(output) to match the gramatical standards
Falls under non-nlp processing
'''
from anuvaad_auditor.loghandler import log_info, log_exception
from utilities import MODULE_CONTEXT
import utilities.misc as misc

def cleaner(src,tgt,tgt_language):
    if tgt_language in ["hi","bn"]:
        return purnaviram_applier(src,tgt)
    else:
        return tgt


def purnaviram_applier(src,tgt):
    '''
    For english to hindi translation
    '''
    try:
        if tgt is None or len(tgt.split()) == 0:
            return tgt
        if len(src.split()) < 5:
            return tgt
        if src.endswith('.') and tgt.endswith('।'):
            return tgt
        elif src.endswith('.') and tgt[-1] != '।':
            if tgt.endswith('.'):
                #log_info("Replacing '.' with purnaviram",MODULE_CONTEXT)
                tgt = tgt[:-1] + str("।")
            else:
                #log_info("Adding the missing purnaviram",MODULE_CONTEXT)
                tgt = tgt + str("।")
            return tgt
        else:
            return tgt    

    except Exception as e:
        log_exception("Error in purnaviram applier, returning original tgt: {}".format(e),MODULE_CONTEXT,e)
        return tgt

def postprocess_sentences_wo_stop(language, sentence_array, sent_indices_wo_stop):
    '''
    Removes stop puncuation from sentences in the array according to the language and the 
    indices provided. This is the post processing step for input sentences
    that did not have stop puncuation. Used in batch translation.
    '''
    try:
        if language is None:
            return sentence_array
        else:
            #log_info("Inside postprocess_sentences_wo_stop",MODULE_CONTEXT)
            stop_puncs = misc.get_language_stop_puncs(language)
            for i in sent_indices_wo_stop:
                sentence_array[i] = misc.remove_stop_punc(sentence_array[i],stop_puncs)

            return sentence_array
    
    except Exception as e:
        log_exception("Error in process_sentences_wo_stop: {}".format(e),MODULE_CONTEXT,e)
        return sentence_array

def postprocess_a_sentence_wo_stop(language, sentence, is_missing_stop_punc):
    '''
    Removes stop puncuation from sentences according to the language. 
    This is the post processing step for input sentence
    that did not have stop puncuation. Used in single sentence translation.
    '''
    try:
        if language is None:
            return sentence
        else:
            #log_info("Inside postprocess_a_sentence_wo_stop",MODULE_CONTEXT)
            stop_puncs = misc.get_language_stop_puncs(language)
            if is_missing_stop_punc:
                sentence = misc.remove_stop_punc(sentence,stop_puncs)

            return sentence
    
    except Exception as e:
        log_exception("Error in process_sentences_wo_stop: {}".format(e),MODULE_CONTEXT,e)
        return sentence

