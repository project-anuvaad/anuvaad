import os
import re
import subprocess
import sys

from anuvaad_auditor import log_info


class PdfConverter(object):
    def __init__(self, input_filename):
        self.file_name_without_ext = os.path.splitext(input_filename)[0]

    def convert_to_pdf(self, pdf_output_path, input_file_path, timeout=None):
        args = [self.libreoffice_exec(), '--headless', '--convert-to', 'pdf', '--outdir', pdf_output_path,
                input_file_path]

        log_info("convert_to_pdf:: PDF conversion process STARTED.", None)
        process = subprocess.run(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=timeout)
        log_info("convert_to_pdf:: PDF conversion process STARTED.", None)

        filename = re.search('-> (.*?) using filter', process.stdout.decode())

        if filename is None:
            raise LibreOfficeError(process.stdout.decode())
        else:
            return filename.group(1)

    def libreoffice_exec(self):
        if sys.platform == 'darwin':
            return '/Applications/LibreOffice.app/Contents/MacOS/soffice'
        return 'libreoffice'


class LibreOfficeError(Exception):
    def __init__(self, output):
        self.output = output
