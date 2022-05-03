from utilities.utils import FileOperation
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
import os
import time
import config
import shutil

file_ops = FileOperation()

# pdf2html conversion
class PdfOperation(object):

    def __init__(self):
        pass

    # using pdf2html system install to convert pdf files into html and image files.
    def pdf_to_html(self,DOWNLOAD_FOLDER, input_pdf_file):
        try:
            new_foldername_html_png_files = str(time.time()).replace('.', '')
            output_html_filepath = file_ops.create_file_download_dir(DOWNLOAD_FOLDER + '/' + new_foldername_html_png_files)
            os.system('pdftohtml -p -c {} {}'.format(input_pdf_file, output_html_filepath + '/html'))
            log_info("pdf_to_html", "files received after pdf2html operation.", None)
            dest_html, dest_png = self.segregate_png_html(output_html_filepath, DOWNLOAD_FOLDER, new_foldername_html_png_files)
            return dest_html, dest_png
        except Exception as e:
            log_exception("pdf_to_html", "Error occured while converting pdf to html", None, e)

    # segregating html and image files into respective directories
    def segregate_png_html(self, output_pdf2html_dir, DOWNLOAD_FOLDER, folder_name):
        try:
            des_html = folder_name + '/html_files'   # html file directory
            des_png = folder_name + '/png_files'     #image file directory
            destination_png = file_ops.create_file_download_dir(os.path.join(DOWNLOAD_FOLDER, des_png))
            destination_html = file_ops.create_file_download_dir(os.path.join(DOWNLOAD_FOLDER, des_html))
            for item in os.listdir(output_pdf2html_dir):
                source_file = file_ops.create_file_download_dir(os.path.join(output_pdf2html_dir, item))
                if item.endswith('.png'):
                    shutil.move(source_file, destination_png)
                elif item.endswith('.html'):
                    shutil.move(source_file, destination_html)
            log_info("segregate_png_html", "html and png files segregation completed", None)
            return des_html, des_png
        except Exception as e:
            log_exception("segregate_png_html", "Error occured during segregation of html and png files", None, e)