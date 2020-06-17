#!/bin/python
import codecs
import logging
import os

import datetime as dt
from flask import jsonify
from utilities.alignmentutils import AlignmentUtils
from repository.alignmentrepository import AlignmentRepository
from kafkawrapper.producer import Producer

log = logging.getLogger('file')
alignmentutils = AlignmentUtils()
repo = AlignmentRepository()
producer = Producer()


class AlignmentService:
    def __init__(self):
        pass

    # Service method to register the alignment job
    def register_job(self, object_in):
        repo.create_job(object_in)
        log.info("JOB ID: " + str(object_in["jobID"]))
        del object_in['_id']
        producer.push_to_queue(object_in)

    # Validator that validates the input request for initiating the alignment job
    def validate_input(self, data):
        if 'source' not in data.keys():
            return self.get_error("SOURCE_NOT_FOUND", "Details of the source not available")
        else:
            source = data["source"]
            if 'filepath' not in source.keys():
                return self.get_error("SOURCE_FILE_NOT_FOUND", "Details of the source file not available")
            elif 'locale' not in source.keys():
                return self.get_error("SOURCE_LOCALE_NOT_FOUND", "Details of the source locale not available")
        if 'target' not in data.keys():
            return self.get_error("TARGET_NOT_FOUND", "Details of the target not available")
        else:
            target = data["target"]
            if 'filepath' not in target.keys():
                return self.get_error("TARGET_FILE_NOT_FOUND", "Details of the target file not available")
            elif 'locale' not in target.keys():
                return self.get_error("TARGET_LOCALE_NOT_FOUND", "Details of the target locale not available")

    # Error formatter
    def get_error(self, code, message):
        return jsonify({"status": "ERROR", "code": code, "message": message})

    # Service method to fetch job details from the mongo collection
    def search_jobs(self, job_id):
        return repo.search_job(job_id)


