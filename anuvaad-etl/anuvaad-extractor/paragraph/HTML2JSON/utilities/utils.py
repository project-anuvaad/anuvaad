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

    def create_file_download_dir(self, downloading_folder):
        self.download_folder = downloading_folder
        download_dir = Path(os.path.join(os.getcwd(), self.download_folder))
        if download_dir.exists() is False:
            os.makedirs(download_dir)
        return str(download_dir)

    def input_format(self, json_data):
        input_files = json_data["input"]['files']
        workflow_id = json_data['workflowCode']
        jobid = json_data['jobID']
        tool_name = json_data['tool']
        step_order = json_data['stepOrder']
        return input_files, workflow_id, jobid, tool_name, step_order   

    def accessing_files(self,files):
        html_filepath = files['htmlFolderPath']
        image_folderpath = files['imageFolderPath']
        file_type = files['type']
        locale = files['locale']
        return html_filepath, image_folderpath, file_type, locale

    def input_path(self, input_filename):
        input_filepath = os.path.join('upload', input_filename)
        return input_filepath

    def one_filename_response(self, input_filename, output_image_folderpath, output_html2json_filepath, in_locale):
        file_res = {
            "inputFile" : input_filename,
            "inputImageFolderPath" : output_image_folderpath,
            "outputHtml2JsonFilePath" : output_html2json_filepath,
            "outputLocale" : in_locale,
            "outputType" : "json"
        }
        return file_res     

    def check_file_extension(self, file_type):
        allowed_extensions = ['folder']
        if file_type in allowed_extensions:
            return True
        else:
            return False

    def check_path_exists(self, dir):
        if dir is not None and os.path.exists(dir) is True:
            return True
        else:
            return False

    def output_path(self, DOWNLOAD_FOLDER):
        output_filename = str(time.time()).replace('.', '') + '.json'
        output_filepath = os.path.join(DOWNLOAD_FOLDER, output_filename)
        return output_filepath , output_filename