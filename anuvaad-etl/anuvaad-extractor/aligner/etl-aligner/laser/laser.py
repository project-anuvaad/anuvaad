#!/bin/python
import logging
import os
from collections import OrderedDict
from functools import partial

import requests
import multiprocessing
from anuvaad_auditor.loghandler import log_info

log = logging.getLogger('file')
laser_url = os.environ.get('LASER_PATH', 'http://127.0.0.1:8050/vectorize')
no_of_processes = 2

class Laser:

    def __init__(self):
        pass

    # Method to make REST calls to LASER and fetch sentence embeddings
    def get_vect(self, query_tuple, lang):
        query_in = query_tuple[1]
        params = {"q": query_in, "lang": lang}
        resp = requests.get(url=laser_url, params=params).json()
        return query_tuple[0], resp["embedding"]

    # Wrapper method that forks multiple process for vectorisation and combines all the results
    def vecotrize_sentences(self, source, target, src_loc, trgt_loc):
        pool = multiprocessing.Pool(no_of_processes)
        log_info("vecotrize_sentences", "Vectorizing Source.......", None)
        log_info("vecotrize_sentences", "Text Locale: " + src_loc, None)
        processed_source = self.convert_to_list_of_tuples(source)
        func = partial(self.get_vect, lang = src_loc)
        source_list = pool.map_async(func, processed_source).get()
        log_info("vecotrize_sentences", "Done.", None)
        log_info("vecotrize_sentences", "Vectorizing Target.......", None)
        log_info("vecotrize_sentences", "Text Locale: " + trgt_loc, None)
        processed_target = self.convert_to_list_of_tuples(target)
        func = partial(self.get_vect, lang = trgt_loc)
        target_list = pool.map_async(func, processed_target).get()
        log_info("vecotrize_sentences", "Done.", None)
        pool.close()
        return self.align_lists(source_list, target_list)

    # Utility for type conversion from list of strings to list of tuples.
    def convert_to_list_of_tuples(self, list):
        final_list = []
        for i, line in enumerate(list):
            tup = i, line
            final_list.append(tup)
        return final_list

    # Utility to align lists
    def align_lists(self, source, target):
        source_emb = list(OrderedDict(sorted(dict(source).items())).values())
        trgt_emb = list(OrderedDict(sorted(dict(target).items())).values())
        return source_emb, trgt_emb

