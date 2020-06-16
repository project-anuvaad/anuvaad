import os
import json
from flask_restful import Resource
from flask.json import jsonify
from flask import request
from src.services.service import ParagraphExtraction
from src.utilities.utils import FileOperation
import werkzeug
from werkzeug.utils import secure_filename
# import config
import logging
import time

para_extraction_service = ParagraphExtraction()

class PdfParagraph(Resource):

    def post(self):
        #task_id = str("TOK-" + str(time.time()).replace('.', ''))
        #task_starttime = str(time.time()).replace('.', '')
        json_data = request.get_json(force = True)
        input_file_name = json_data['Pdf_file']
        response_out = para_extraction_service.para_extraction(input_file_name)
        return response_out
        