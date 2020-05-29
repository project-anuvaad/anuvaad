import os
import json
from flask_restful import reqparse, Resource
from flask.json import jsonify
from flask import Flask, request
from src.services.service import Tokenisation
from src.utilities.utils import FileOperation
from src.utilities.model_response import Status
from src.utilities.model_response import CustomResponse
import werkzeug
from werkzeug.utils import secure_filename
import uuid
import config
from time import sleep
import logging

# sentence tokenisation
file_ops = FileOperation()
DOWNLOAD_FOLDER =file_ops.file_download(config.download_folder)

class SenTokenisePost(Resource):
    
    def post(self):
        loging.info("request received")
        json_data = request.get_json(force = True)
        logging.info("data processed",json_data)
        input_filename, in_file_type, in_locale, jobid = file_ops.json_input_format(json_data)
        input_filepath = file_ops.input_path(input_filename)
        output_filepath = file_ops.output_path(DOWNLOAD_FOLDER)
        out_file_type, out_locale = in_file_type, in_locale
        if input_filename == "" or input_filename is None:
            response = CustomResponse(Status.ERR_FILE_NOT_FOUND.value, jobid, config.taskid,
                                        input_filepath,output_filepath,in_file_type,out_file_type,in_locale,out_locale)
            return response.get_response()
        elif file_ops.check_file_extension(in_file_type) is False:
            response = CustomResponse(Status.ERR_EXT_NOT_FOUND.value, jobid, config.taskid, 
                                        input_filepath,output_filepath,in_file_type,out_file_type,in_locale,out_locale)
            return response.get_response()
        elif file_ops.check_path_exists(input_filepath) is False or file_ops.check_path_exists(DOWNLOAD_FOLDER) is False:
            response = CustomResponse(Status.ERR_DIR_NOT_FOUND.value, jobid, config.taskid,
                                        input_filepath,output_filepath,in_file_type,out_file_type,in_locale,out_locale)
            return response.get_response()
        elif in_locale == "" or in_locale is None:
            response = CustomResponse(Status.ERR_locale_NOT_FOUND.value, jobid, config.taskid,
                                        input_filepath,output_filepath,in_file_type,out_file_type,in_locale,out_locale)
            return response.get_response()
        elif jobid == "" or jobid is None:
            response = CustomResponse(Status.ERR_jobid_NOT_FOUND.value, jobid, config.taskid,
                                        input_filepath,output_filepath,in_file_type,out_file_type,in_locale,out_locale)
            return response.get_response()
        else:
            tokenisation = Tokenisation()
            input_file_data = file_ops.read_file(input_filepath)
            if len(input_file_data) == 0:
                response = CustomResponse(Status.ERR_EMPTY_FILE.value, jobid, config.taskid,
                                                input_filepath,output_filepath,in_file_type,out_file_type,in_locale,out_locale)
                return response.get_response()
            else: 
                tokenisation.tokenisation(input_file_data, output_filepath)
                response_true = CustomResponse(Status.SUCCESS.value, jobid, config.taskid,
                                                input_filepath,output_filepath,in_file_type,out_file_type,in_locale,out_locale)
                return response_true.get_response()

    
