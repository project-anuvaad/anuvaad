from repositories.pdf_operation import PdfOperation
import logging

pdf_ops = PdfOperation()
log = logging.getLogger('file')

class Pdf2HtmlService(object):
    def __init__(self):
        pass

    # after successful pdf to html conversion returning html and image file directory 
    def pdf2html(self,DOWNLOAD_folder, input_pdf_file):
        output_htmlfiles_path, output_pngfiles_path = pdf_ops.pdf_to_html(DOWNLOAD_folder, input_pdf_file)
        log.info("successfully received output filepath for HTML and PNG files")
        return output_htmlfiles_path, output_pngfiles_path