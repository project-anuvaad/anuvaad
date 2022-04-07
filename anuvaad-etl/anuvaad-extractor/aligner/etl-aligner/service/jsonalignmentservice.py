#!/bin/python
import logging
from multiprocessing import Process

import numpy as np
import time
from scipy.spatial import distance
from laser.laser import Laser
from embedder.labse import Labse
from utilities.alignmentutils import AlignmentUtils
from repository.alignmentrepository import AlignmentRepository
from validator.alignmentvalidator import AlignmentValidator
from kafkawrapper.alignmentproducer import Producer
from .jsonalignwflowservice import JsonAlignWflowService
from .alignmentservice import AlignmentService
from configs.alignerconfig import directory_path
from configs.alignerconfig import jsonalign_job_topic
from anuvaad_auditor.loghandler import log_info, log_exception, log_error
import pandas as pd


log = logging.getLogger('file')

file_path_delimiter = '/'


alignmentutils = AlignmentUtils()
repo = AlignmentRepository()
labse = Labse()

producer = Producer()
util = AlignmentUtils()
validator = AlignmentValidator()
jsonwflowservice = JsonAlignWflowService()
service = AlignmentService()


# We base the scoring on k nearest neighbors for each element
knn_neighbors = 2

# Min score for text pairs. Note, score can be larger than 1
min_threshold = 0.5

#Do we want to use exact search of approximate nearest neighbor search (ANN)
#Exact search: Slower, but we don't miss any parallel sentences
#ANN: Faster, but the recall will be lower
use_ann_search = False

#Number of clusters for ANN. Each cluster should have at least 10k entries
ann_num_clusters = 32768

#How many cluster to explorer for search. Higher number = better recall, slower
ann_num_cluster_probe = 3


class JsonAlignmentService:
    def __init__(self):
        pass

    # Service method to register the alignment job.
    def register_job(self, object_in):
        job_id = util.generate_job_id()

        try:
            response = {"input": object_in, "jobID": job_id, "status": "STARTED"}
            self.update_job_details(response, True)
            prod_res = producer.push_to_queue(response, jsonalign_job_topic)

            if prod_res:
                self.update_job_status("FAILED", object_in, prod_res["message"])
                response = {"input": object_in, "jobID": job_id, "status": "FAILED", "error": prod_res}
            return response
        except Exception as e:
            log_exception("Exception while registering the alignment job: " + str(e), object_in, e)
            return None


    # Service method to register the alignment job through wfm.
    def wf_process(self, object_in):
        try:
            object_in["taskID"] = util.generate_task_id()
            object_in["status"] = "STARTED"
            log_info("Registering the alignment job initiated through WF...", object_in)
            self.update_job_details(object_in, True)
            self.process(object_in, True)
            return {}
        except Exception as e:
            log_exception("Exception while registering the alignment job initiated through WF: " + str(e), object_in, e)
            return None

    # Method to update the status of job.
    def update_job_details(self, object_in, iscreate):
        return service.update_job_details(object_in, iscreate)


    # Service layer to update job status
    def update_job_status(self, status, object_in, cause):
        return service.update_job_status(status, object_in, cause)

    # Service layer to fetch vectors for all the source and target sentences.
    def build_index(self, source, target_corp, src_loc, trgt_loc, object_in):
        source_embeddings, target_embeddings = labse.vecotrize_sentences_labse(source, target_corp, src_loc, trgt_loc, object_in)
        return source_embeddings, target_embeddings

    # Service layer to fetch target sentence for a given source sentence.
    def get_target_sentence(self, reshaped_tgt, source_embedding, src_sent):
        return service.get_target_sentence(reshaped_tgt, source_embedding, src_sent)


    # Wrapper method to categorise sentences into MATCH, ALMOST-MATCH and NO-MATCH
    def process(self, object_in, iswf):
        if self.check_if_duplicate(object_in["jobID"], object_in):
            return None
        log_info("Alignment process starts for job: " + str(object_in["jobID"]), object_in)
        path = object_in["input"]["target"]["filepath"]
        path_indic = object_in["input"]["source"]["filepath"]
        full_path = directory_path + file_path_delimiter + path
        full_path_indic = directory_path + file_path_delimiter + path_indic
        object_in["status"] = "INPROGRESS"
        object_in["startTime"] = eval(str(time.time()).replace('.', '')[0:13])
        self.update_job_details(object_in, False)
        source, target_corp = self.parse_in(full_path, full_path_indic, object_in, iswf)

        embeddings = self.build_embeddings(source, target_corp, object_in, iswf)
        if embeddings is not None:
            x = embeddings[0]
            y = embeddings[1] 

            x = x / np.linalg.norm(x, axis=1, keepdims=True)
            # y = target_embeddings
            y = y / np.linalg.norm(y, axis=1, keepdims=True)
            # Perform kNN in both directions
            x2y_sim, x2y_ind = util.kNN(object_in, x, y, knn_neighbors, use_ann_search, ann_num_clusters, ann_num_cluster_probe)
            x2y_mean = x2y_sim.mean(axis=1)

            y2x_sim, y2x_ind = util.kNN(object_in, y, x, knn_neighbors, use_ann_search, ann_num_clusters, ann_num_cluster_probe)
            y2x_mean = y2x_sim.mean(axis=1)

            # Compute forward and backward scores
            margin = lambda a, b: a / b
            fwd_scores = util.score_candidates(x, y, x2y_ind, x2y_mean, y2x_mean, margin)
            bwd_scores = util.score_candidates(y, x, y2x_ind, y2x_mean, x2y_mean, margin)
            fwd_best = x2y_ind[np.arange(x.shape[0]), fwd_scores.argmax(axis=1)]
            bwd_best = y2x_ind[np.arange(y.shape[0]), bwd_scores.argmax(axis=1)]

            indices = np.stack([np.concatenate([np.arange(x.shape[0]), bwd_best]), np.concatenate([fwd_best, np.arange(y.shape[0])])], axis=1)
            scores = np.concatenate([fwd_scores.max(axis=1), bwd_scores.max(axis=1)])
            seen_src, seen_trg = set(), set()
            src_out = []
            tgt_out = []
            score_out = []
            sentences_written = 0
            for i in np.argsort(-scores):
                src_ind, trg_ind = indices[i]
                src_ind = int(src_ind)
                trg_ind = int(trg_ind)

                if scores[i] < min_threshold:
                    break

                if src_ind not in seen_src and trg_ind not in seen_trg:
                    seen_src.add(src_ind)
                    seen_trg.add(trg_ind)
                    src_out.append(source[src_ind].replace("\t", " "))
                    tgt_out.append(target_corp[trg_ind].replace("\t", " "))
                    score_out.append(scores[i])
                    sentences_written += 1
            try:
                df = pd.DataFrame(list(zip(src_out, tgt_out, score_out)),columns = ['sourceText', 'targetText','alignmentScore'])
                output_dict = self.generate_output(object_in, df)
                if output_dict is not None:

                    result = self.build_final_response(path, path_indic, output_dict, object_in)
                    self.update_job_details(result, False)
                    if iswf:
                        jsonwflowservice.update_wflow_details(result, object_in)
                else:
                    self.update_job_status("FAILED", object_in, "Exception while writing the output")
                    if iswf:
                        util.error_handler("OUTPUT_ERROR", "Exception while writing the output", object_in, True)
                    else:
                        util.error_handler("OUTPUT_ERROR", "Exception while writing the output", object_in, False)
            except Exception as e:
                log_exception("Exception while writing the output: " + str(e), object_in, e)
                self.update_job_status("FAILED", object_in, "Exception while writing the output")
                if iswf:
                    util.error_handler("OUTPUT_ERROR", "Exception while writing the output", object_in, True)
                else:
                    util.error_handler("OUTPUT_ERROR", "Exception while writing the output", object_in, False)
                return {}
            log_info("Sentences aligned Successfully! JOB ID: " + str(object_in["jobID"]), object_in)
        else:
            return {}



    def check_if_duplicate(self, job_id, object_in):
        return(service.check_if_duplicate(job_id, object_in))


    # Service layer to parse the input file
    def parse_in(self, full_path, full_path_indic, object_in, iswf):
        try:
            log_info("Parsing Json Input Files.....", object_in)
            source, target_corp = alignmentutils.parse_json(full_path, full_path_indic)
            return source, target_corp
        except Exception as e:
            log_exception("Exception while parsing the input: " + str(e), object_in, e)
            self.update_job_status("FAILED", object_in, "Exception while parsing the input")
            if iswf:
                util.error_handler("INPUT_ERROR", "Exception while parsing the input: " + str(e), object_in, True)
            else:
                util.error_handler("INPUT_ERROR", "Exception while parsing the input: " + str(e), object_in, False)
            return None, None
        
    # Wrapper to build sentence embeddings
    def build_embeddings(self, source, target_corp, object_in, iswf):
        return service.build_embeddings(source, target_corp, object_in, iswf)
     
    # Wrapper method to align and categorise sentences
    def get_alignments(self, source_embeddings, target_embeddings, source, object_in, iswf):
        return service.get_alignments(source_embeddings, target_embeddings, source, object_in, iswf)
       
    # Service layer to generate output
    def generate_output(self, object_in, df):
        try:
            log_info("Generating the Json output.....", object_in)
            json_filename = object_in["jobID"]+ "-aligner-op.json"
            output_json = directory_path + file_path_delimiter +  json_filename
            alignmentutils.write_json_output(df, output_json)
            return {"json_out" : json_filename }
        except Exception as e:
            log_exception("Exception while writing output to files: " + str(e), object_in, e)
            return None

    # Response formatter
    def build_final_response(self, source, target, output, object_in):
        result = {"status": "COMPLETED",
                  "jobID": object_in["jobID"],
                  "startTime": object_in["startTime"],
                  "endTime": eval(str(time.time()).replace('.', '')[0:13]),
                  "input": {
                      "source": source,
                      "target": target
                  },
                  "output": {
                          "json_out" : output["json_out"]
                  }}

        return result


    # Service method to fetch job details from the mongo collection
    def search_jobs(self, job_id):
        return repo.search_job(job_id)
