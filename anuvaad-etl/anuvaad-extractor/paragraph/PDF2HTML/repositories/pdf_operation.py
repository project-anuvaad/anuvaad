from utilities.utils import FileOperation
import os
import time
import logging
import config

file_ops = FileOperation()
log = logging.getLogger('file')

class PdfOperation(object):

    def __init__(self):
        pass

    def pdf_to_html(self,DOWNLOAD_FOLDER, input_pdf_file):
        try:
            output_html_filepath = file_ops.file_download(DOWNLOAD_FOLDER + '/' + str(time.time()).replace('.', ''))
            os.system('pdftohtml -p -c {} {}'.format(input_pdf_file, output_html_filepath + '/html'))
            log.info("pdf to html with pdftohtml command completed")
            return output_html_filepath
        except Exception as e:
            log.error("Error occured while converting pdf to html: %s"%e)
