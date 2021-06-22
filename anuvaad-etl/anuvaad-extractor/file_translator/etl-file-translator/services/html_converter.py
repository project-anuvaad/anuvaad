import os

from anuvaad_auditor import log_info

import config
from errors.errors_exception import FileErrors
from services.pdf_converter import PdfConverter
from services.pdf_to_html import PdfToHtml
from services.service import common_obj, file_ops
from utilities.s3_utils import S3BucketUtils


class HtmlConvert(object):
    def __init__(self, input_filename, file_type):
        self.file_name_without_ext = os.path.splitext(input_filename)[0]
        self.file_type = file_type
        self.generated_html_file_path = None

    def generate_html(self, input_filename):
        if self.file_type in ['docx']:
            input_docx_filepath = common_obj.input_path(input_filename)
            pdf_output_dir = config.download_folder

            pdf_converter = PdfConverter(input_filename=input_filename)
            generated_pdf_file_path = pdf_converter.convert_to_pdf(pdf_output_path=pdf_output_dir,
                                                                   input_file_path=input_docx_filepath,
                                                                   timeout=config.PDF_CONVERSION_TIMEOUT)

            file_path, file_name = os.path.split(generated_pdf_file_path)
            new_pdf_file_path = common_obj.input_path(file_name)

            log_info("generate_html DOC:: DOC to PDF Conversion successful ", None)

            pdf_to_html = PdfToHtml(input_filename=input_filename)
            html_output_dir = common_obj.input_path(self.file_name_without_ext)

            if not file_ops.create_directory(html_output_dir):
                raise FileErrors("DIRECTORY_CREATION_ERROR", "Error while creating Directory.")

            html_output_file = os.path.join(html_output_dir, self.file_name_without_ext)

            self.generated_html_file_path = pdf_to_html.convert_pdf_to_html(html_output_dir=html_output_file,
                                                                            input_pdf_file_path=new_pdf_file_path,
                                                                            timeout=config.PDF_TO_HTML_TIMEOUT)
            dir, file = os.path.split(self.generated_html_file_path)
            s3_obj = S3BucketUtils()
            urls = s3_obj.upload_dir(dir_path=dir)
            return s3_obj.get_url_for_specific_file(urls=urls, file_pattern='-html.html')


        elif self.file_type in ['pptx']:
            input_pptx_filepath = common_obj.input_path(input_filename)
            pdf_output_dir = config.download_folder

            pdf_converter = PdfConverter(input_filename=input_filename)
            generated_pdf_file_path = pdf_converter.convert_to_pdf(pdf_output_path=pdf_output_dir,
                                                                   input_file_path=input_pptx_filepath,
                                                                   timeout=config.PDF_CONVERSION_TIMEOUT)
            file_path, file_name = os.path.split(generated_pdf_file_path)
            new_pdf_file_path = common_obj.input_path(file_name)

            log_info("generate_html PPTX:: PPTX to PDF Conversion successful ", None)

            pdf_to_html = PdfToHtml(input_filename=input_filename)
            html_output_dir = common_obj.input_path(self.file_name_without_ext)

            if not file_ops.create_directory(html_output_dir):
                raise FileErrors("DIRECTORY_CREATION_ERROR", "Error while creating Directory.")

            html_output_file = os.path.join(html_output_dir, self.file_name_without_ext)

            self.generated_html_file_path = pdf_to_html.convert_pdf_to_html(html_output_dir=html_output_file,
                                                                            input_pdf_file_path=new_pdf_file_path,
                                                                            timeout=config.PDF_TO_HTML_TIMEOUT)

        if config.PUSH_GENERATED_HTML_TO_S3:
            file_dir, file_name = os.path.split(self.generated_html_file_path)
            s3 = S3BucketUtils()
            urls = s3.upload_dir(dir_path=file_dir)
            out_html_path = s3.get_url_for_specific_file(urls=urls, file_pattern='-html.html')
            return out_html_path
        else:
            out_html_path = self.generated_html_file_path
            return out_html_path
