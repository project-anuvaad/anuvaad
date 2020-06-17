#!/bin/python
import binascii
import codecs
import json
import os
import datetime as dt

import requests
import numpy as np
import csv
import time


class AlignmentUtils:

    def __init__(self):
        pass

    # Utility to generate a unique random job ID
    def generate_job_id(self):
        return str(time.time()).replace('.', '')