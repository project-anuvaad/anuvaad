#!/bin/python
import binascii
import codecs
import json
import logging
import os
import time

import requests
import numpy as np
import csv

log = logging.getLogger('file')
two_files = True
no_of_words = 200
file_encoding = 'utf-16'
#upload_url = os.environ.get('FILE_UPLOAD_URL', 'https://auth.anuvaad.org/upload')
upload_url = "https://auth.anuvaad.org/upload"


class SentenceExtractionUtils:

    def __init__(self):
        pass

    

    # Utility to generate a unique random task ID
    def generate_task_id(self):
        return "ALIGN-" + str(time.time()).replace('.', '')

    # Utility to generate a unique random job ID
    def generate_job_id(self):
        return str(time.time()).replace('.', '')
