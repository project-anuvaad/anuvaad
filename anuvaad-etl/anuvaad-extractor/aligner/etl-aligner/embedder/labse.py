#!/bin/python
import logging
from anuvaad_auditor.loghandler import log_info
from sentence_transformers import SentenceTransformer,models
from configs.alignerconfig import labse_folder_path
from configs.alignerconfig import gpu_status

use_gpu = gpu_status

if use_gpu:
    model = SentenceTransformer(labse_folder_path, device='cuda')
else:
    model = SentenceTransformer(labse_folder_path)

log = logging.getLogger('file')

class Labse:

    def __init__(self):
        pass

    def vecotrize_sentences_labse(self, source, target, src_loc, trgt_loc, object_in):


        log_info("No of sentences in Source :" + str(len(source)) , object_in)
        log_info("No of sentences in Target :" + str(len(target)) , object_in)

        log_info("LaBSE: Encoding Source sentences", object_in)
        log_info("LaBSE: Text Locale: " + src_loc, object_in)
        embeddings_source = model.encode(source, show_progress_bar=True, convert_to_numpy=True)
        log_info("LaBSE: Source Encoding Done.", object_in)

        log_info("LaBSE: Encoding Target sentences", object_in)
        log_info("LaBSE: Text Locale: " + trgt_loc, object_in)
        embeddings_target = model.encode(target, show_progress_bar=True, convert_to_numpy=True)
        log_info("LaBSE: Target Encoding Done.", object_in)

        return embeddings_source, embeddings_target