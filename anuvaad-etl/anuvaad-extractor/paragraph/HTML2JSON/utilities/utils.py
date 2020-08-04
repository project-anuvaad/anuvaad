import os
from pathlib import Path
import logging
from anuvaad_em.emservice import post_error
from anuvaad_em.emservice import post_error_wf
import time

log = logging.getLogger('file')

class FileOperation(object):

    def __init__(self):
        self.download_folder = None

    # creating directory if it is not existed before.   
    def create_file_download_dir(self, downloading_folder):
        self.download_folder = downloading_folder
        download_dir = Path(os.path.join(os.getcwd(), self.download_folder))
        if download_dir.exists() is False:
            os.makedirs(download_dir)
        return str(download_dir)

    # extracting data from received json input
    def input_format(self, json_data):
        input_files = json_data["input"]['files']
        workflow_id = json_data['workflowCode']
        jobid = json_data['jobID']
        tool_name = json_data['tool']
        step_order = json_data['stepOrder']
        return input_files, workflow_id, jobid, tool_name, step_order   

    # extracting input file features
    def accessing_files(self,files):
        html_filepath = files['htmlFolderPath']
        image_folderpath = files['imageFolderPath']
        file_type = files['type']
        locale = files['locale']
        return html_filepath, image_folderpath, file_type, locale

    # generating input filepath for input filename
    def input_path(self, input_filename):
        input_filepath = os.path.join('upload', input_filename)
        return input_filepath

    # generating output filepath for output filename
    def output_path(self,index, DOWNLOAD_FOLDER):
        output_filename = '%d-'%index + str(time.time()).replace('.', '') + '.json'
        output_filepath = os.path.join(DOWNLOAD_FOLDER, output_filename)
        return output_filepath , output_filename

    # output format for individual pdf file
    def one_filename_response(self, input_filename, output_image_folderpath, output_html2json_filepath, in_locale):
        file_res = {
            "inputFile" : input_filename,
            "inputImageFolderPath" : output_image_folderpath,
            "outputHtml2JsonFilePath" : output_html2json_filepath,
            "outputLocale" : in_locale,
            "outputType" : "json"
        }
        return file_res     

    # checking file extension of received file type
    def check_file_extension(self, file_type):
        allowed_extensions = ['folder']
        if file_type in allowed_extensions:
            return True
        else:
            return False

    # checking directory exists or not
    def check_path_exists(self, dir):
        if dir is not None and os.path.exists(dir) is True:
            return True
        else:
            return False

    # error manager integration 
    def error_handler(self, object_in, iswf):
        if iswf:
                job_id = object_in["jobID"]
                task_id = object_in["taskID"]
                state = object_in['state']
                status = object_in['status']
                code = object_in['error']['code']
                message = object_in['error']['message']
                error = post_error_wf(code, message, job_id, task_id, state, status, None)
                return error
        else:
            code = object_in['error']['code']
            message = object_in['error']['message']
            error = post_error(code, message, None)
            return error