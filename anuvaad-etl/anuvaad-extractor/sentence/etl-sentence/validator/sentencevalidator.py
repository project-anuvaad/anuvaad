#!/bin/python
import codecs
import logging
import os

from flask import jsonify


class SentenceValidator:
    def __init__(self):
        pass

    # Validator that validates the input request for initiating the alignment job
    def validate_input(self, data):
        if 'input' not in data.keys():
            return self.get_error("INPUT_NOT_FOUND", "Details of the source not available")
        else:
            source = data["input"]
            if 'path' not in source.keys():
                return self.get_error("PATH_NOT_FOUND", "Details of the source file not available")
    # Error formatter
    def get_error(self, code, message):
        return {"status": "ERROR", "code": code, "message": message}



