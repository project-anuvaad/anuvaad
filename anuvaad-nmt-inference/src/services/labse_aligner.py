from anuvaad_auditor.loghandler import log_info, log_exception
from utilities import MODULE_CONTEXT
import sys
import tools.indic_tokenize as indic_tok
from sentence_transformers import SentenceTransformer
import numpy as np
from scipy.spatial import distance
import config

model = SentenceTransformer(config.LABSE_PATH,device='cpu')

class LabseAlignerService:
    @staticmethod  
    def phrase_aligner(inputs):
        '''
        This function is meant to align src phrases with best possible tgt phrase using LABSE model
        '''
        out = {}
        aligned_phrases = {}
        try:
            #log_info("Performing phrase alignenment using LABSE",MODULE_CONTEXT)
            #log_info("Input for phrase_aligner:{}".format(inputs),MODULE_CONTEXT)
            src_phrases, tgt = inputs.get("src_phrases"), inputs.get("tgt")
            
            for src_phrase in src_phrases:
                length_src_phrase = len(src_phrase.split())        
                tgt_token_list = split_tgt(length_src_phrase,tgt)
                embeddings_src_phrase, embeddings_tgt_tokens = generate_embeddings([src_phrase],tgt_token_list)
                alignments = get_target_sentence(embeddings_tgt_tokens, embeddings_src_phrase, length_src_phrase)
            
                if alignments is not None and alignments[2] is "MATCH":
                    aligned_phrases[src_phrase] = tgt_token_list[alignments[0]]
                elif alignments is not None and alignments[2] is "NOMATCH": 
                    log_info("No exact match found for:{} . Possible alignment {}".format(src_phrase,tgt_token_list[alignments[0]]),MODULE_CONTEXT)  
                            
            log_info("Aligned Phrases: {}".format(aligned_phrases),MODULE_CONTEXT)
            out = {"tgt":tgt,"src_phrases":src_phrases,"aligned_phrases":aligned_phrases}     
                   
        except Exception as e:
            log_exception("Error in LabseAlignerService:phrase_aligner: {} and {}".format(sys.exc_info()[0],e),MODULE_CONTEXT,e)
            log_exception("Error caught in LabseAlignerService:phrase_aligner for input: {}".format(inputs),MODULE_CONTEXT,e)
            raise

        return out

def split_tgt(length_src_phrase,tgt):
    tgt_token_list = list()
    # tokenised_tgt_ =  indic_tok.trivial_tokenize(tgt)
    tokenised_tgt = tgt.split()
    tgt_token_list = [tokenised_tgt[i:i+length_src_phrase] for i in range(len(tokenised_tgt)) if (i + length_src_phrase) <= len(tokenised_tgt)]
    tgt_token_list_plus = [tokenised_tgt[i:i+length_src_phrase+1] for i in range(len(tokenised_tgt)) if (i + length_src_phrase+1) <= len(tokenised_tgt)]
    tgt_token_list_minus = [tokenised_tgt[i:i+length_src_phrase-1] for i in range(len(tokenised_tgt)) if (i + length_src_phrase-1) <= len(tokenised_tgt) and 
                            length_src_phrase != 1]
    tgt_token_list = tgt_token_list + tgt_token_list_plus + tgt_token_list_minus
    tgt_token_list = [" ".join(j) for j in tgt_token_list]
    if len(tgt_token_list) == 0: tgt_token_list = [tgt] 
    return tgt_token_list
        
def generate_embeddings(input_1, input_2):
    '''
    Generate LABSE embeddings
    Note: Inputs are array of strings
    '''           
    embeddings_input_1 = model.encode(input_1,show_progress_bar=True)
    embeddings_input_2 = model.encode(input_2,show_progress_bar=True)    
    log_info("LABSE embedding generation finished",MODULE_CONTEXT)
    return embeddings_input_1, embeddings_input_2
    
def get_target_sentence(target_embeddings, source_embedding, length_src_phrase):
    '''
    Calculate cosine similarity using scipy distance method
    '''
    distances = distance.cdist(source_embedding, target_embeddings, "cosine")[0]
    min_index = np.argmin(distances)
    min_distance = 1 - distances[min_index]
    log_info("Match score: {}".format(min_distance),MODULE_CONTEXT)
    if min_distance >= 0.5:
        return min_index, min_distance, "MATCH"
    else:
        return min_index, min_distance, "NOMATCH"     
        