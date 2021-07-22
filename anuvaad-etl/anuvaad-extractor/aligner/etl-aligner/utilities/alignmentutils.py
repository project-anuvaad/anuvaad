#!/bin/python
import binascii
import codecs
import json
import logging
import os
import time
from shutil import copyfile
import pandas as pd 
import numpy as np
import csv
import faiss
import numpy as np
import time
import gzip
import lzma
from configs.alignerconfig import directory_path

import uuid
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.errorhandler import post_error
from anuvaad_auditor.errorhandler import post_error_wf
from anuvaad_auditor.loghandler import log_exception
from configs.alignerconfig import gpu_status


use_gpu = gpu_status
log = logging.getLogger('file')
two_files = True
no_of_words = 200
file_encoding = 'utf-16'

class AlignmentUtils:

    def __init__(self):
        pass

    # Utility to parse input files.
    def parse_input_file(self, path_eng, path_indic):
        source = []
        target_corp = []
        if two_files:
            with codecs.open(path_indic, 'r',file_encoding) as txt_file:
                for row in txt_file:
                    if len(row.rstrip()) != 0:
                        source.append(row.rstrip())
            with codecs.open(path_eng, 'r',file_encoding) as txt_file:
                for row in txt_file:
                    if len(row.rstrip()) != 0:
                        target_corp.append(row.rstrip())

        else:
            with codecs.open(path_eng, 'r',file_encoding) as csv_file:
                csv_reader = csv.reader((l.replace('\0', '') for l in csv_file))
                for row in csv_reader:
                    if len(row) != 0:
                        source.append(row[0])
                        target_corp.append(row[1])
        return source, target_corp


    def parse_json(self, path_eng, path_indic):
        #code for testing faiss based aligner
        source = []
        target_corp = []
        if two_files:
            try:
                with codecs.open(path_indic, 'r',file_encoding) as txt_file:
                    for row in txt_file:
                        if len(row.rstrip()) != 0:
                            source.append(row.rstrip())
                with codecs.open(path_eng, 'r',file_encoding) as txt_file:
                    for row in txt_file:
                        if len(row.rstrip()) != 0:
                            target_corp.append(row.rstrip())  
            except UnicodeError:
                with codecs.open(path_indic, 'r', "utf-8") as txt_file:
                    for row in txt_file:
                        if len(row.rstrip()) != 0:
                            source.append(row.rstrip())
                with codecs.open(path_eng, 'r', "utf-8") as txt_file:
                    for row in txt_file:
                        if len(row.rstrip()) != 0:
                            target_corp.append(row.rstrip())
            except:
                pass
        source = list(set(source))
        target_corp = list(set(target_corp))  
        return source, target_corp  
        #code for reading json from tokenizer output
        # source = []
        # target_corp = []
        # f = open(path_indic) 
        # response = json.load(f) 

        # for page in response['result']:
        #     for block in page['text_blocks']:
        #         for sentence in block['tokenized_sentences'] :
        #             source.append(sentence['src'])

        # f = open(path_eng) 
        # response = json.load(f) 
        # for page in response['result']:
        #     for block in page['text_blocks']:
        #         for sentence in block['tokenized_sentences'] :
        #             target_corp.append(sentence['src'])
        # return source, target_corp


    # Utility to write the output to a file
    def write_output(self, list, path):
        with codecs.open(path, 'w', file_encoding) as txt_file:
            for row in list:
                txt_file.write(row + "\r\n")

    # Utility to write the JSON output to a file
    def write_json_output(self, df, path):
        with open(path, 'w', encoding = "utf-8") as json_file:
            df.to_json(json_file, force_ascii=False, indent=2, orient='records')


    # Utility to calculate cosine distances between 2 vectors
    def cscalc(self, vector_one, vector_two):
        vector_one = np.squeeze(vector_one)
        vector_two = np.squeeze(vector_two)
        dot = np.dot(vector_one, vector_two)
        norma = np.linalg.norm(vector_one)
        normb = np.linalg.norm(vector_two)
        cos = dot / (norma * normb)
        return cos

    # Post processor to be called after input parsing is sucessfull
    # If the process is to be run only for sentences of a particular length in the input
    def post_process_input(self, word_count, source):
        source[:] = [line for line in source if (len(line.split()) < word_count)]

    # File to binary converter
    def convert_file_to_binary(self, file_path):
        x = ""
        with open(file_path, 'rb') as f:
            for chunk in iter(lambda: f.read(32), b''):
                x += str(binascii.hexlify(chunk)).replace("b", "").replace("'", "")
        b = bin(int(x, 16)).replace('b', '')
        return b

    # Utility to upload files to shared memory
    def upload_file_binary(self, file, object_in):
        op_file = str(uuid.uuid4())
        try:
            copyfile(file, os.path.join(directory_path, op_file))
            return op_file
        except Exception as e:
            log_exception("Exception while writing to shared memory: " + str(e), object_in, e)
            return None

    # Utility to decide (min,max) cs thresholds based on length of setences.
    def get_cs_on_sen_cat(self, sentence):
        sen_len = len(sentence.split())
        if 0 < sen_len <= 15:
            # SMALL
            return 0.65, 0.7
        else:
            # LARGE
            return 0.7, 0.75

    # Utility to generate a unique random task ID
    def generate_task_id(self):
        return "ALIGN-" + str(time.time()).replace('.', '')[0:13]

    # Utility to generate a unique random job ID
    def generate_job_id(self):
        return "ALIGN-" + str(time.time()).replace('.', '')[0:13]

    # Builds the error and passes it to error_manager
    def error_handler(self, code, message, object_in, iswf):
        if iswf:
            object_in["state"] = "SENTENCES-ALIGNED"
            object_in["status"] = "FAILED"
            error = post_error_wf(code, message, object_in, None)
        else:
            error = post_error(code, message, None)
        return error

    #methods for faiss based alignment
    def score(self, x, y, fwd_mean, bwd_mean, margin):
#         return margin(x.dot(y), (fwd_mean + bwd_mean) / 2)
          vector_one = np.squeeze(x)
          vector_two = np.squeeze(y)
          dot = np.dot(vector_one, vector_two)
          norma = np.linalg.norm(vector_one)
          normb = np.linalg.norm(vector_two)
          cos = dot / (norma * normb)
          return(cos)


    def score_candidates(self, x, y, candidate_inds, fwd_mean, bwd_mean, margin):
        scores = np.zeros(candidate_inds.shape)
        for i in range(scores.shape[0]):
            for j in range(scores.shape[1]):
                k = candidate_inds[i, j]
                scores[i, j] = self.score(x[i], y[k], fwd_mean[i], bwd_mean[k], margin)
        return scores


    def kNN(self, object_in, x, y, k, use_ann_search=False, ann_num_clusters=32768, ann_num_cluster_probe=3):
        start_time = time.time()
        if use_ann_search:

            log_info("Performing Approx. kNN search" , object_in)
            n_cluster = min(ann_num_clusters, int(y.shape[0]/1000))
            quantizer = faiss.IndexFlatIP(y.shape[1])
            index = faiss.IndexIVFFlat(quantizer, y.shape[1], n_cluster, faiss.METRIC_INNER_PRODUCT)
            if use_gpu:
                index = faiss.index_cpu_to_all_gpus(index)
                log_info("GPU Enabled for Faiss" , object_in)

            index.nprobe = ann_num_cluster_probe
            index.train(y)
            index.add(y)
            sim, ind = index.search(x, k)
        else:
            log_info("Performing Exact search" , object_in)

            idx = faiss.IndexFlatL2(y.shape[1])
            if use_gpu:
                idx = faiss.index_cpu_to_all_gpus(idx)  
                log_info("GPU Enabled for Faiss" , object_in)
          
            idx.add(y)
            sim, ind = idx.search(x, k)

        log_info("Matching Done: {:.2f} sec".format(time.time()-start_time) , object_in)


        return sim, ind
