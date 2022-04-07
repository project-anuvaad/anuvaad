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
from .alignwflowservice import AlignWflowService
from configs.alignerconfig import directory_path
from configs.alignerconfig import align_job_topic
from anuvaad_auditor.loghandler import log_info, log_exception, log_error


log = logging.getLogger('file')
res_suffix = 'match-'
man_suffix = 'almost-'
nomatch_suffix = 'no-'
file_path_delimiter = '/'


alignmentutils = AlignmentUtils()
repo = AlignmentRepository()
labse = Labse()
laser = Laser()
producer = Producer()
util = AlignmentUtils()
validator = AlignmentValidator()
wflowservice = AlignWflowService()


class AlignmentService:
    def __init__(self):
        pass

    # Service method to register the alignment job.
    def register_job(self, object_in):
        job_id = util.generate_job_id()
        try:
            response = {"input": object_in, "jobID": job_id, "status": "STARTED"}
            self.update_job_details(response, True)
            prod_res = producer.push_to_queue(response, align_job_topic)
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
        if iscreate:
            repo.create_job(object_in)
            del object_in["_id"]
        else:
            jobID = object_in["jobID"]
            repo.update_job(object_in, jobID)

    # Service layer to update job status
    def update_job_status(self, status, object_in, cause):
        object_in["status"] = status
        object_in["endTime"] = eval(str(time.time()).replace('.', '')[0:13])
        if cause is not None:
            object_in["cause"] = cause
        self.update_job_details(object_in, False)

    # Service layer to fetch vectors for all the source and target sentences.
    def build_index(self, source, target_corp, src_loc, trgt_loc, object_in):
        source_embeddings, target_embeddings = labse.vecotrize_sentences_labse(source, target_corp, src_loc, trgt_loc, object_in)
        #source_embeddings, target_embeddings = laser.vecotrize_sentences(source, target_corp, src_loc, trgt_loc, object_in)
        return source_embeddings, target_embeddings

    # Service layer to fetch target sentence for a given source sentence.
    def get_target_sentence(self, reshaped_tgt, source_embedding, src_sent):
        source_embedding = np.array(source_embedding)
        source_embedding = source_embedding.reshape(source_embedding.shape[0],1)
        source_embedding = np.transpose(source_embedding)
        distances = distance.cdist(source_embedding, reshaped_tgt, "cosine")[0]
        min_index = np.argmin(distances)
        min_distance = 1 - distances[min_index]
        min_cs, max_cs = alignmentutils.get_cs_on_sen_cat(src_sent)
        if min_distance >= max_cs:
            return min_index, min_distance, "MATCH"
        elif min_cs <= min_distance < max_cs:
            return min_index, min_distance, "ALMOST-MATCH"


    # Wrapper method to categorise sentences into MATCH, ALMOST-MATCH and NO-MATCH
    def process(self, object_in, iswf):
        if self.check_if_duplicate(object_in["jobID"], object_in):
            return None
        log_info("Alignment process starts for job: " + str(object_in["jobID"]), object_in)
        source_reformatted = []
        target_refromatted = []
        manual_src = []
        manual_trgt = []
        path = object_in["input"]["target"]["filepath"]
        path_indic = object_in["input"]["source"]["filepath"]
        full_path = directory_path + file_path_delimiter + path
        full_path_indic = directory_path + file_path_delimiter + path_indic
        object_in["status"] = "INPROGRESS"
        object_in["startTime"] = eval(str(time.time()).replace('.', '')[0:13])
        self.update_job_details(object_in, False)
        source, target_corp = self.parse_in(full_path, full_path_indic, object_in, iswf)
        if source is None:
            return {}
        embeddings = self.build_embeddings(source, target_corp, object_in, iswf)
        if embeddings is not None:
            source_embeddings = embeddings[0]
            target_embeddings = embeddings[1]
        else:
            return {}
        alignments = self.get_alignments(source_embeddings, target_embeddings, source, object_in, iswf)
        if alignments is not None:
            match_dict = alignments[0]
            manual_dict = alignments[1]
            lines_with_no_match = alignments[2]
            for key in match_dict:
                source_reformatted.append(source[key])
                target_refromatted.append(target_corp[match_dict[key][0]])
            if len(manual_dict.keys()) > 0:
                for key in manual_dict:
                    manual_src.append(source[key])
                    manual_trgt.append(target_corp[manual_dict[key][0]])
            try:
                output_dict = self.generate_output(source_reformatted, target_refromatted, manual_src, manual_trgt,
                                           lines_with_no_match, path, path_indic, object_in)
                if output_dict is not None:
                    result = self.build_final_response(path, path_indic, output_dict, object_in)
                    self.update_job_details(result, False)
                    if iswf:
                        wflowservice.update_wflow_details(result, object_in)
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
        log_info("Duplicate Check....", object_in)
        job = self.search_jobs(job_id)
        if job:
            job = job[0]
            if job["status"] != "STARTED":
                log_info("This job is already present in the system. jobID: " + str(object_in["jobID"]), object_in)
                return True
            else:
                return False
        else:
            return False

    # Service layer to parse the input file
    def parse_in(self, full_path, full_path_indic, object_in, iswf):
        try:
            log_info("Parsing Input Files.....", object_in)
            source, target_corp = alignmentutils.parse_input_file(full_path, full_path_indic)
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
        try:
            log_info("Fetching embeddings for the sentences.....", object_in)
            src_loc = object_in["input"]["source"]["locale"]
            trgt_loc = object_in["input"]["target"]["locale"]
            source_embeddings, target_embeddings = self.build_index(source, target_corp, src_loc, trgt_loc, object_in)
            if len(source_embeddings) == 0 or len(target_embeddings) == 0:
                log_error("Embedding couldn't be fetched. Either source or target is empty", object_in, None)
                self.update_job_status("FAILED", object_in, "Embedding couldn't be fetched. Either source or target is empty")
                if iswf:
                    util.error_handler("INPUT_ERROR", "Embedding couldn't be fetched. Either source or target is empty", object_in, True)
                else:
                    util.error_handler("INPUT_ERROR", "Embedding couldn't be fetched. Either source or target is empty", object_in, False)
                return None
            return source_embeddings, target_embeddings
        except Exception as e:
            log_exception("Exception while fetching embeddings for the sentences: " + str(e), object_in, e)
            self.update_job_status("FAILED", object_in, "Exception fetching embeddings for the sentences")
            if iswf:
                util.error_handler("LASER_ERROR", "Exception fetching embeddings for the sentences: " + str(e), object_in, True)
            else:
                util.error_handler("LASER_ERROR", "Exception fetching embeddings for the sentences: " + str(e), object_in, False)

            return None

    # Wrapper method to align and categorise sentences
    def get_alignments(self, source_embeddings, target_embeddings, source, object_in, iswf):
        match_dict = {}
        manual_dict = {}
        lines_with_no_match = []
        try:
            log_info("Aligning the sentences.....", object_in)
            sentence_count, interval = 0, 0
            for i, embedding in enumerate(source_embeddings):
                trgt = self.get_target_sentence(target_embeddings, embedding, source[i])
                if trgt is not None:
                    if trgt[2] is "MATCH":
                        match_dict[i] = trgt[0], trgt[1]
                    else:
                        manual_dict[i] = trgt[0], trgt[1]
                else:
                    lines_with_no_match.append(source[i])
                interval += 1
                if interval == 200:
                    sentence_count += interval
                    log_info("No of sentences(src) processed (match + almost + nomatch): " + str(sentence_count), object_in)
                    interval = 0
            log_info("No of sentences(src) processed (match + almost + nomatch): " + str(sentence_count + interval), object_in)
            return match_dict, manual_dict, lines_with_no_match
        except Exception as e:
            log_exception("Exception while aligning sentences: " + str(e), object_in, e)
            self.update_job_status("FAILED", object_in, "Exception while aligning sentences")
            if iswf:
                util.error_handler("ALIGNMENT_ERROR", "Exception while aligning sentences: " + str(e), object_in, True)
            else:
                util.error_handler("ALIGNMENT_ERROR", "Exception while aligning sentences: " + str(e), object_in, False)
            return None

    # Service layer to generate output
    def generate_output(self, source_reformatted, target_refromatted, manual_src, manual_trgt,
                        nomatch_src, path, path_indic, object_in):
        try:
            log_info("Generating the output.....", object_in)
            output_source = directory_path + file_path_delimiter + res_suffix + path_indic
            output_target = directory_path + file_path_delimiter + res_suffix + path
            output_manual_src = directory_path + file_path_delimiter + man_suffix + path_indic
            output_manual_trgt = directory_path + file_path_delimiter + man_suffix + path
            output_nomatch = directory_path + file_path_delimiter + nomatch_suffix + path_indic
            alignmentutils.write_output(source_reformatted, output_source)
            alignmentutils.write_output(target_refromatted, output_target)
            alignmentutils.write_output(manual_src, output_manual_src)
            alignmentutils.write_output(manual_trgt, output_manual_trgt)
            alignmentutils.write_output(nomatch_src, output_nomatch)
            return {"source": res_suffix + path_indic, "target": res_suffix + path,
                       "manual_src": man_suffix + path_indic, "manual_trgt": man_suffix + path,
                       "nomatch": nomatch_suffix + path_indic}
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
                      "match": {
                          "source": output["source"],
                          "target": output["target"]
                      },
                      "almostMatch": {
                          "source": output["manual_src"],
                          "target": output["manual_trgt"]
                      },
                      "noMatch": {
                          "source": output["nomatch"]
                      }
                  }}

        return result


    # Service method to fetch job details from the mongo collection
    def search_jobs(self, job_id):
        return repo.search_job(job_id)


