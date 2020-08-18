from utilities.utils import FileOperation
import os
import time
import logging
import config
import shutil

file_ops = FileOperation()
log = logging.getLogger('file')

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
            log.info("files received after pdf2html operation.")
            dest_html, dest_png = self.segregate_png_html(output_html_filepath, DOWNLOAD_FOLDER, new_foldername_html_png_files)
            return dest_html, dest_png
        except Exception as e:
            log.error("Error occured while converting pdf to html: %s"%e)

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
            log.info("html and png files segregation completed")
            return des_html, des_png
        except Exception as e:
            log.error("Error occured during segregation of html and png files %s"%e)