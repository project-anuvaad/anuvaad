#!/bin/python
import logging
import os

import numpy as np
import time
from scipy.spatial import distance
from laser.laser import Laser
from utilities.alignmentutils import AlignmentUtils
from repository.alignmentrepository import AlignmentRepository
from validator.alignmentvalidator import AlignmentValidator
from kafkawrapper.alignmentproducer import Producer
from .alignwflowservice import AlignWflowService

log = logging.getLogger('file')
directory_path = os.environ.get('SA_DIRECTORY_PATH', r'C:\Users\Vishal\Desktop\anuvaad\Facebook LASER\resources\Input\length-wise')
res_suffix = 'match-'
man_suffix = 'almost-'
nomatch_suffix = 'no-'
file_path_delimiter = '/'
align_job_topic = "anuvaad-etl-alignment-jobs-v3"


alignmentutils = AlignmentUtils()
repo = AlignmentRepository()
laser = Laser()
producer = Producer()
util = AlignmentUtils()
validator = AlignmentValidator()
wflowservice = AlignWflowService()


class AlignmentService:
    def __init__(self):
        pass

    # Service method to register the alignment job
    def register_job(self, object_in):
        job_id = util.generate_job_id()
        response = {"input": object_in, "jobID": job_id, "status": "START"}
        self.update_job_details(response, True)
        producer.push_to_queue(response, align_job_topic)
        return response


    # Service method to register the alignment job
    def wf_process(self, object_in):
        object_in["taskID"] = util.generate_task_id()
        self.update_job_details(object_in, True)
        result = self.process(object_in, True)
        return result

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
        object_in["endTime"] = eval(str(time.time()).replace('.', ''))
        if cause is not None:
            object_in["cause"] = cause
        self.update_job_details(object_in, False)

    # Service layer to fetch vectors for all the source and target sentences.
    def build_index(self, source, target_corp, src_loc, trgt_loc):
        source_embeddings, target_embeddings = laser.vecotrize_sentences(source, target_corp, src_loc, trgt_loc)
        return source_embeddings, target_embeddings

    # Service layer to fetch target sentence for a given source sentence.
    def get_target_sentence(self, target_embeddings, source_embedding, src_sent):
        data = np.array(target_embeddings)
        data = data.reshape(data.shape[0], data.shape[2])
        distances = distance.cdist(np.array(source_embedding), data, "cosine")[0]
        min_index = np.argmin(distances)
        min_distance = 1 - distances[min_index]
        min_cs, max_cs = alignmentutils.get_cs_on_sen_cat(src_sent)
        if min_distance >= max_cs:
            return min_index, min_distance, "MATCH"
        elif min_cs <= min_distance < max_cs:
            return min_index, min_distance, "ALMOST-MATCH"


    # Wrapper method to categorise sentences into MATCH, ALMOST-MATCH and NO-MATCH
    def process(self, object_in, iswf):
        log.info("Alignment process starts for job: " + str(object_in["jobID"]))
        source_reformatted = []
        target_refromatted = []
        manual_src = []
        manual_trgt = []
        path = object_in["input"]["source"]["filepath"]
        path_indic = object_in["input"]["target"]["filepath"]
        full_path = directory_path + file_path_delimiter + path
        full_path_indic = directory_path + file_path_delimiter + path_indic
        object_in["status"] = "INPROGRESS"
        object_in["startTime"] = eval(str(time.time()).replace('.', ''))
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
                                           lines_with_no_match, path, path_indic)
                if output_dict is not None:
                    result = self.build_final_response(path, path_indic, output_dict, object_in)
                    self.update_job_details(result, False)
                    if iswf:
                        wflowservice.update_wflow_details(result, object_in, None)
                else:
                    self.update_job_status("FAILED", object_in, "Exception while writing the output")
                    if iswf:
                        error = validator.get_error("OUTPUT_ERROR", "Exception while writing the output")
                        wflowservice.update_wflow_details(None, object_in, error)
            except Exception as e:
                log.error("Exception while writing the output: ", str(e))
                self.update_job_status("FAILED", object_in, "Exception while writing the output")
                if iswf:
                    error = validator.get_error("OUTPUT_ERROR", "Exception while writing the output: " + str(e))
                    wflowservice.update_wflow_details(None, object_in, error)
                return {}
            log.info("Sentences aligned Successfully! JOB ID: " + str(object_in["jobID"]))
        else:
            return {}

    # Service layer to parse the input file
    def parse_in(self, full_path, full_path_indic, object_in, iswf):
        try:
            source, target_corp = alignmentutils.parse_input_file(full_path, full_path_indic)
            return source, target_corp
        except Exception as e:
            log.exception("Exception while parsing the input: " + str(e))
            self.update_job_status("FAILED", object_in, "Exception while parsing the input")
            if iswf:
                error = validator.get_error("INPUT_ERROR", "Exception while parsing the input: " + str(e))
                wflowservice.update_wflow_details(None, object_in, error)
            return None, None

    # Wrapper to build sentence embeddings
    def build_embeddings(self, source, target_corp, object_in, iswf):
        try:
            src_loc = object_in["input"]["source"]["locale"]
            trgt_loc = object_in["input"]["target"]["locale"]
            source_embeddings, target_embeddings = self.build_index(source, target_corp, src_loc, trgt_loc)
            return source_embeddings, target_embeddings
        except Exception as e:
            log.exception("Exception while vectorising the sentences: " + str(e))
            self.update_job_status("FAILED", object_in, "Exception while vectorising sentences")
            if iswf:
                error = validator.get_error("LASER_ERROR", "Exception while vectorising sentences: " + str(e))
                wflowservice.update_wflow_details(None, object_in, error)
            return None

    # Wrapper method to align and categorise sentences
    def get_alignments(self, source_embeddings, target_embeddings, source, object_in, iswf):
        match_dict = {}
        manual_dict = {}
        lines_with_no_match = []
        try:
            for i, embedding in enumerate(source_embeddings):
                trgt = self.get_target_sentence(target_embeddings, embedding, source[i])
                if trgt is not None:
                    if trgt[2] is "MATCH":
                        match_dict[i] = trgt[0], trgt[1]
                    else:
                        manual_dict[i] = trgt[0], trgt[1]
                else:
                    lines_with_no_match.append(source[i])
            return match_dict, manual_dict, lines_with_no_match
        except Exception as e:
            log.exception("Exception while aligning sentences: " + str(e))
            self.update_job_status("FAILED", object_in, "Exception while aligning sentences")
            if iswf:
                error = validator.get_error("ALIGNEMENT_ERROR", "Exception while aligning sentences: " + str(e))
                wflowservice.update_wflow_details(None, object_in, error)
            return None


    # Service layer to generate output
    def generate_output(self, source_reformatted, target_refromatted, manual_src, manual_trgt, nomatch_src, path, path_indic):
        try:
            output_source = directory_path + file_path_delimiter + res_suffix + path
            output_target = directory_path + file_path_delimiter + res_suffix + path_indic
            output_manual_src = directory_path + file_path_delimiter + man_suffix + path
            output_manual_trgt = directory_path + file_path_delimiter + man_suffix + path_indic
            output_nomatch = directory_path + file_path_delimiter + nomatch_suffix + path
            alignmentutils.write_output(source_reformatted, output_source)
            alignmentutils.write_output(target_refromatted, output_target)
            alignmentutils.write_output(manual_src, output_manual_src)
            alignmentutils.write_output(manual_trgt, output_manual_trgt)
            alignmentutils.write_output(nomatch_src, output_nomatch)
            return self.get_response_paths(output_source, output_target,
                                           output_manual_src, output_manual_trgt, output_nomatch)
        except Exception as e:
            log.exception("Exception while writing output to files: " + str(e))
            return None

    # Service layer to upload the files generated as output to the alignment process
    def get_response_paths(self, output_src, output_trgt, output_manual_src, output_manual_trgt, output_nomatch):
        try:
            output_src = alignmentutils.upload_file_binary(output_src)
            output_trgt = alignmentutils.upload_file_binary(output_trgt)
            output_manual_src = alignmentutils.upload_file_binary(output_manual_src)
            output_manual_trgt = alignmentutils.upload_file_binary(output_manual_trgt)
            output_nomatch = alignmentutils.upload_file_binary(output_nomatch)
            output_dict = {"source": output_src, "target": output_trgt, "manual_src": output_manual_src,
                           "manual_trgt": output_manual_trgt, "nomatch": output_nomatch}
            return output_dict
        except Exception as e:
            log.exception("Exception while uploading output files: " + str(e))
            return None

    # Response formatter
    def build_final_response(self, source, target, output, object_in):
        result = {"status": "COMPLETED",
                  "jobID": object_in["jobID"],
                  "startTime": object_in["startTime"],
                  "endTime": eval(str(time.time()).replace('.', '')),
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

