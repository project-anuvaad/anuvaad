import os
import time
from pathlib import Path
import json
import requests
import re
import logging
import config

log = logging.getLogger('file')

class FileOperation(object):

    def __init__(self):
        self.download_folder = None

    def file_download(self, downloading_folder):
        self.download_folder = downloading_folder
        download_dir = Path(os.path.join(os.getcwd(), self.download_folder))
        if download_dir.exists() is False:
            os.makedirs(download_dir)
        return str(download_dir)

    # def get_uploaded_filepath(self, local_filepath):
    #     api_url_base = config.base_url_path + '/upload'
    #     data = open(local_filepath, 'rb')
    #     try:
    #         log.info('uploading : %s'%local_filepath)
    #         r = requests.post(url = api_url_base, data = data, headers = {'Content-Type': 'application/x-www-form-urlencoded'})
    #         r.raise_for_status()
    #         log.info("file uploaded successfully")
    #     except requests.exceptions.HTTPError as e:
    #         log.error("file not uploaded due to %s"%(e.response.text))
    #         return None
    #     obj        = json.loads(r.text)
    #     return obj['data']

    def input_format(self, json_data):
        input_files = json_data["input"]['files']
        workflow_id = json_data['workflowCode']
        jobid = json_data['jobID']
        tool_name = json_data['tool']
        step_order = json_data['stepOrder']
        return input_files, workflow_id, jobid, tool_name, step_order   

    def accessing_files(self,files):
        filepath = files['path']
        file_type = files['type']
        locale = files['locale']
        return filepath, file_type, locale

    def input_path(self, input_filename):
        input_filepath = os.path.join('upload', input_filename)
        return input_filepath

    def one_filename_response(self, input_filename, output_filepath, in_locale, in_file_type):
        file_res = {
            "inputFile" : input_filename,
            "outputFolderPath" : output_filepath,
            "outputLocale" : in_locale,
            "outputType" : in_file_type
        }
        return file_res     

    def check_file_extension(self, file_type):
        allowed_extensions = ['pdf']
        if file_type in allowed_extensions:
            return True
        else:
            return False

    def check_path_exists(self, dir):
        if dir is not None and os.path.exists(dir) is True:
            return True
        else:
            return False
