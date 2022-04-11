from repositories.pdf_operation import PdfOperation
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from errors.errors_exception import ServiceError

pdf_ops = PdfOperation()

class Pdf2HtmlService(object):
    def __init__(self, DOWNLOAD_folder):
        self.DOWNLOAD_folder = DOWNLOAD_folder

    # after successful pdf to html conversion returning html and image file directory 
    def pdf2html(self, input_pdf_file, jobid):
        try:
            output_htmlfiles_path, output_pngfiles_path = pdf_ops.pdf_to_html(self.DOWNLOAD_folder, input_pdf_file)
            log_info("pdf2html","successfully received output filepath for HTML and PNG files", jobid)
            return output_htmlfiles_path, output_pngfiles_path
        except:
            log_exception("pdf2html","Error occured during pdf to html conversion", jobid, None)
            raise ServiceError(400, "pdf2html failed. Something went wrong during conversion.")