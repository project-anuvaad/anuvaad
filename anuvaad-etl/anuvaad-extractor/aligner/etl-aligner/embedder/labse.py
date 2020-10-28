#!/bin/python
import logging
import os
from collections import OrderedDict
from functools import partial

import requests
import multiprocessing
from configs.alignerconfig import laser_url
from configs.alignerconfig import no_of_processes
from anuvaad_auditor.loghandler import log_info
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('LaBSE')

log = logging.getLogger('file')

class Labse:

    def __init__(self):
        pass

    def vecotrize_sentences(self, source, target, src_loc, trgt_loc, object_in):
        log_info("Vectorizing Source.......", object_in)
        log_info("Text Locale: " + src_loc, object_in)
        embeddings_source = model.encode(source,show_progress_bar=True)
        log_info("Done.", object_in)
        log_info("Vectorizing Target.......", object_in)
        log_info("Text Locale: " + trgt_loc, object_in)
        embeddings_target = model.encode(target,show_progress_bar=True)
        log_info("Done.", object_in)
        return embeddings_source, embeddings_target
