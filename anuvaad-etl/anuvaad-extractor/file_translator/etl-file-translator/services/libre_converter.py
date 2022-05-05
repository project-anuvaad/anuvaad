import os
import re
import subprocess
import sys
import time

from anuvaad_auditor import log_info

import config


class LibreConverter(object):
    def __init__(self, input_filename, json_data):
        self.json_data = json_data
        self.file_name_without_ext = os.path.splitext(input_filename)[0]

    def convert_to_html(self, html_output_dir, input_file_path, timeout=None):
        if not timeout:
            timeout = config.PDF_TO_HTML_TIMEOUT

        args = [self.libreoffice_exec(), '--headless', '--convert-to', 'html', '--outdir', html_output_dir, input_file_path]

        log_info(f"convert_to_html:: HTML conversion process STARTED.", self.json_data)
        process = subprocess.run(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=timeout)
        log_info(f"convert_to_html:: HTML conversion process ENDED.", self.json_data)

        filename = re.search('-> (.*?) using filter', process.stdout.decode())

        return os.path.join(html_output_dir, self.file_name_without_ext + '.html')

    def convert_to_pdf(self, pdf_output_path, input_file_path, timeout=None):

        if not timeout:
            timeout = config.PDF_CONVERSION_TIMEOUT

        args = [self.libreoffice_exec(), '--headless', '--convert-to', 'pdf', '--outdir', pdf_output_path,
                input_file_path]

        log_info(f"convert_to_pdf:: PDF conversion process STARTED.", self.json_data)
        process = subprocess.run(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=timeout)
        log_info(f"convert_to_pdf:: PDF conversion process ENDED.", self.json_data)

        filename = re.search('-> (.*?) using filter', process.stdout.decode())

        # if filename is None:
        #     log_info(f"convert_to_pdf: ERROR while converting to pdf, OP: {process.stdout.decode()}", None)
        #     raise LibreOfficeError(process.stdout.decode())
        # else:
        #     return filename.group(1)

        return os.path.join(pdf_output_path, self.file_name_without_ext+'.pdf')

    def libreoffice_exec(self):
        if sys.platform == 'darwin':
            return '/Applications/LibreOffice.app/Contents/MacOS/soffice'
        return 'libreoffice'


class LibreOfficeError(Exception):
    def __init__(self, output):
        self.output = output
