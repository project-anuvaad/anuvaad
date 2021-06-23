import os

from anuvaad_auditor import log_info

import config
from errors.errors_exception import FileErrors
from services.pdf_converter import LibreConverter
from services.pdf_to_html import PdfToHtmlConverter
from services.service import common_obj, file_ops
from utilities.s3_utils import S3BucketUtils

''' FILE STRUCTURE WE ARE FOLLOWING TO CONVERT FILE TO HTML:
    1. In HtmlConvert input can be a pptx or docx.
    2. input file can either be converted to pdf then html of directly html.
    3. input file will always reside in upload folder.
                path: upload/<fileNAme>.docx
    4. same with the converted pdf file, it will reside in upload folder. 
    5. Name of the pdf will be same as the input file so retrieval will be easy. 
                path: upload/<fileName>.pdf
    6. When we convert HTML file, along with html file all images get created separately for that html. So, we 
    store all files in a folder and name it same as the input file name. 
                path: upload/<fileNAme>/<fileName>.html
    7. After HTML is generated we push the data to s3 in bucket anuvaad1, there we follow the same file structure 
    for html file. 
                inside bucket path: <fileNAme>/<fileName>.html
'''


class HtmlConvert(object):
    def __init__(self, input_filename, file_type):
        self.file_name_without_ext = os.path.splitext(input_filename)[0]
        self.file_type = file_type
        self.generated_html_file_path = None

    def create_html_out_dir(self, filename_without_extension):
        # All the html file should get stored with folder structure /upload/<file_name>/<HTML_FILE>
        html_output_dir = common_obj.output_path(output_path=filename_without_extension)
        if not file_ops.create_directory(html_output_dir):
            raise FileErrors("DIRECTORY_CREATION_ERROR", "Error while creating Directory.")
        return html_output_dir

    def get_input_file_path(self, file_name):
        # All input file should be coming from upload folder
        return common_obj.input_path(input_filename=file_name)

    def get_pdf_out_dir(self):
        return config.download_folder

    def push_generated_files_for_html_to_s3(self, generated_html_file_path):
        # generated files will be in folder /upload/<file_name>/<HTML_FILE> so we have to pass /upload/<file_name>
        # where all the generated files will stored
        file_dir, file_name = os.path.split(generated_html_file_path)
        s3 = S3BucketUtils()
        urls = s3.upload_dir(dir_path=file_dir)
        return urls

    def get_html_file_name_on_s3(self, generated_html_file_path):
        file_dir, file_name = os.path.split(generated_html_file_path)
        return file_name

    def get_file_url_with_specific_pattern(self, urls, pattern):
        # pattern will be either html file name or the pattern what the html file follows like '-html.html'
        return common_obj.get_url_for_specific_file(urls=urls, file_pattern=pattern)

    def push_to_s3(self, generated_html_file_path):
        if not generated_html_file_path:
            generated_html_file_path = self.generated_html_file_path

        urls = self.push_generated_files_for_html_to_s3(generated_html_file_path=generated_html_file_path)
        pattern = self.get_html_file_name_on_s3(self.file_name_without_ext)
        generated_html_file_url = self.get_file_url_with_specific_pattern(urls=urls, pattern=pattern)
        return generated_html_file_url

    def convert_to_pdf_libre(self, input_filename, input_filepath, pdf_output_dir):
        libre_converter = LibreConverter(input_filename=input_filename)
        generated_pdf_file_path = libre_converter.convert_to_pdf(pdf_output_path=pdf_output_dir,
                                                                 input_file_path=input_filepath,
                                                                 timeout=config.PDF_CONVERSION_TIMEOUT)
        return generated_pdf_file_path

    def convert_pdf_to_html_pdftohtml(self, input_filename, generated_pdf_file_path):
        html_output_dir = self.create_html_out_dir(filename_without_extension=self.file_name_without_ext)
        pdf_to_html = PdfToHtmlConverter(input_filename=input_filename)
        generated_html_file_path = pdf_to_html.convert_pdf_to_html(html_output_dir=html_output_dir,
                                                                   input_pdf_file_path=generated_pdf_file_path,
                                                                   timeout=config.PDF_TO_HTML_TIMEOUT)
        return generated_html_file_path

    def convert_docx_to_html_libre(self, input_filename, input_docx_filepath):
        html_output_dir = self.create_html_out_dir(self.file_name_without_ext)
        libre_converter = LibreConverter(input_filename=input_filename)
        generated_html_file_path = libre_converter.convert_to_html(html_output_path=html_output_dir,
                                                                   input_file_path=input_docx_filepath,
                                                                   timeout=config.PDF_TO_HTML_TIMEOUT)
        return generated_html_file_path

    def generate_html(self, input_filename):
        if self.file_type in ['docx']:
            if config.FLOW_DOCX_PDF_HTML_S3_ENABLED:
                log_info("generate_html :: DOC to HTML FLOW: FLOW_DOCX_PDF_HTML_S3_ENABLED Started. ", None)

                input_docx_filepath = self.get_input_file_path(file_name=input_filename)
                pdf_output_dir = self.get_pdf_out_dir()

                # CONVERT DOCX TO PDF: LIBRE
                generated_pdf_file_path = self.convert_to_pdf_libre(input_filename=input_filename,
                                                                    input_filepath=input_docx_filepath,
                                                                    pdf_output_dir=pdf_output_dir)
                # CONVERT PDF TO HTML: PDF TO HTML
                self.generated_html_file_path = self.convert_pdf_to_html_pdftohtml(input_filename=input_filename,
                                                                                   generated_pdf_file_path=generated_pdf_file_path)
                # PUSH TO S3
                generated_html_file_url = self.push_to_s3(generated_html_file_path=self.generated_html_file_path)

                log_info("generate_html :: DOC to HTML FLOW: FLOW_DOCX_PDF_HTML_S3_ENABLED ENDED. ", None)
                return generated_html_file_url

            elif config.FLOW_DOCX_LIBREHTML_S3_ENABLED:
                log_info("generate_html :: DOC to HTML FLOW: FLOW_DOCX_LIBREHTML_S3_ENABLED Started. ", None)

                input_docx_filepath = self.get_input_file_path(file_name=input_filename)

                # CONVERT DOCX TO HTML: LIBRE
                self.generated_html_file_path = self.convert_docx_to_html_libre(input_filename=input_filename,
                                                                                input_docx_filepath=input_docx_filepath)

                generated_html_file_url = self.push_to_s3(generated_html_file_path=self.generated_html_file_path)

                log_info("generate_html :: DOC to HTML FLOW: FLOW_DOCX_LIBREHTML_S3_ENABLED Ended. ", None)
                return generated_html_file_url

        elif self.file_type in ['pptx']:
            log_info("generate_html :: PPTX to HTML FLOW Started. ", None)

            input_pptx_filepath = self.get_input_file_path(file_name=input_filename)
            pdf_output_dir = self.get_pdf_out_dir()

            # CONVERT PPTX TO PDF: LIBRE
            generated_pdf_file_path = self.convert_to_pdf_libre(input_filename=input_filename,
                                                                input_filepath=input_pptx_filepath,
                                                                pdf_output_dir=pdf_output_dir)
            # CONVERT PDF TO HTML: PDF TO HTML
            self.generated_html_file_path = self.convert_pdf_to_html_pdftohtml(input_filename=input_filename,
                                                                               generated_pdf_file_path=generated_pdf_file_path)
            # PUSH TO S3
            generated_html_file_url = self.push_to_s3(generated_html_file_path=self.generated_html_file_path)

            log_info("generate_html :: PPTX to HTML FLOW  ENDED. ", None)
            return generated_html_file_url
