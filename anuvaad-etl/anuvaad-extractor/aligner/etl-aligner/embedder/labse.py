#!/bin/python
import logging

from anuvaad_auditor.loghandler import log_info
from sentence_transformers import SentenceTransformer
from configs.alignerconfig import labse_folder_path


model = SentenceTransformer(labse_folder_path)

log = logging.getLogger('file')

class Labse:

    def __init__(self):
        pass

    def vecotrize_sentences_labse(self, source, target, src_loc, trgt_loc, object_in):
        log_info("Generating embedding using Labse model", object_in)
        log_info("LaBSE: Vectorizing Source.......", object_in)
        log_info("LaBSE: Text Locale: " + src_loc, object_in)
        embeddings_source = model.encode(source, show_progress_bar=True)
        log_info("LaBSE: Done.", object_in)
        log_info("LaBSE: Vectorizing Target.......", object_in)
        log_info("LaBSE: Text Locale: " + trgt_loc, object_in)
        embeddings_target = model.encode(target, show_progress_bar=True)
        log_info("LaBSE: Done.", object_in)
        return embeddings_source, embeddings_target
