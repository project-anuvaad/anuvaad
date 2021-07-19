import os
import subprocess

from anuvaad_auditor import log_info

import config


class PdfToHtmlConverter(object):
    def __init__(self, input_filename, json_data):
        self.json_data = json_data
        self.file_name_without_ext = os.path.splitext(input_filename)[0]

    def get_new_html_file_name(self, file_name):
        # Naming convention of pdftohtml converter is, the main html has postfix '-html.html'
        if file_name:
            return os.path.join(file_name + '-html.html')
        else:
            return os.path.join(self.file_name_without_ext + '-html.html')

    def get_new_html_file_path(self, html_output_dir, generated_html_file_name):
        return os.path.join(html_output_dir, generated_html_file_name)

    # Usage: pdftohtml [options] <PDF-file> [<html-file> <xml-file>]
    def convert_pdf_to_html(self, input_pdf_file_path, html_output_dir, file_name='', timeout=None):
        # PDFTOHTML take out directory with the 'file name' you want to name it
        # if you provide upload/123/sample, it will generate files under upload/123 and 
        # all the file will have prefix 'sample'
        if not timeout:
            timeout = config.PDF_TO_HTML_TIMEOUT

        if file_name:
            # file_name shouldn't have extension, it should have only file name
            html_file_path = os.path.join(html_output_dir, file_name)
        else:
            html_file_path = os.path.join(html_output_dir, self.file_name_without_ext)

        args = ['pdftohtml', '-s', input_pdf_file_path, html_file_path]
        log_info("convert_pdf_to_html:: PDF to HTML conversion process STARTED.", self.json_data)
        process = subprocess.run(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=timeout)
        log_info("convert_pdf_to_html:: PDF to HTML conversion process ENDED.", self.json_data)

        generated_html_file_name = self.get_new_html_file_name(file_name=file_name)
        generated_html_file_path = self.get_new_html_file_path(html_output_dir=html_output_dir,
                                                               generated_html_file_name=generated_html_file_name)
        log_info(f"convert_pdf_to_html:: Generated html file path: {generated_html_file_path}", self.json_data)
        return generated_html_file_path
