from repositories.pdf_operation import PdfOperation
import logging

pdf_ops = PdfOperation()
log = logging.getLogger('file')

class Pdf2HtmlService(object):
    def __init__(self):
        pass

    def pdf2html(self,DOWNLOAD_folder, input_pdf_file):
        output_path = pdf_ops.pdf_to_html(DOWNLOAD_folder, input_pdf_file)
        log.info("successfully received output filepath for HTML and PNG files")
        return output_path