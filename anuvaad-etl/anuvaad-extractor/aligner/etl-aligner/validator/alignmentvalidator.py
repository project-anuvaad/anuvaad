#!/bin/python
import codecs
import logging
import os

from flask import jsonify


class AlignmentValidator:
    def __init__(self):
        pass

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



