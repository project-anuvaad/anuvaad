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
        source_reformatted = []
        target_refromatted = []
        source_target_ref_score = []
        manual_src = []
        manual_trgt = []
        manual_src_tgt_score = []
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
                source_target_ref_score.append(match_dict[key][1])
                # print("\nKEY=",key,match_dict[key],match_dict[key][1],source[key],target_corp[match_dict[key][0]])
            if len(manual_dict.keys()) > 0:
                for key in manual_dict:
                    manual_src.append(source[key])
                    manual_trgt.append(target_corp[manual_dict[key][0]])
                    manual_src_tgt_score.append(manual_dict[key][1])
            try:

                df = pd.DataFrame(list(zip(source_reformatted, target_refromatted, source_target_ref_score)),columns = ['src', 'tgt','cs'])

                output_dict = self.generate_output(source_reformatted, target_refromatted, manual_src, manual_trgt,
                                           lines_with_no_match, path, path_indic, object_in, df)
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
    def generate_output(self, source_reformatted, target_refromatted, manual_src, manual_trgt,
                        nomatch_src, path, path_indic, object_in,df):
        try:
            log_info("Generating the Json output.....", object_in)
            output_json = directory_path + file_path_delimiter +  object_in["jobID"]+ "-aligner-op.json"
            alignmentutils.write_json_output(df, output_json)
            return {"json_out" : output_json }
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