import os

from anuvaad_auditor import log_info

import config
from errors.errors_exception import FileErrors
from services.pdf_converter import LibreConverter
from services.pdf_to_html import PdfToHtml
from services.service import common_obj, file_ops
from utilities.s3_utils import S3BucketUtils


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

    def push_generated_files_for_html_to_s3(self, generated_html_file_path):
        # generated files will be in folder /upload/<file_name>/<HTML_FILE> so we have to pass /upload/<file_name>
        # where all the generated files will stored
        file_dir, file_name = os.path.split(generated_html_file_path)
        s3 = S3BucketUtils()
        urls = s3.upload_dir(dir_path=file_dir)
        return urls

    def get_file_url_with_specific_pattern(self, urls, pattern):
        # pattern will be either html file name or the pattern what the html file follows like '-html.html'
        return common_obj.get_url_for_specific_file(urls=urls, file_pattern=pattern)

    def generate_html(self, input_filename):
        if self.file_type in ['docx']:
            if config.FLOW_DOCX_PDF_HTML_S3_ENABLED:
                input_docx_filepath = common_obj.input_path(input_filename)
                pdf_output_dir = config.download_folder

                log_info("generate_html :: DOC to PDF Conversion STARTED ", None)

                pdf_converter = LibreConverter(input_filename=input_filename)
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
                return s3_obj.get_url_for_specific_file(urls=urls, file_pattern=config.GENERATED_HTML_FILE_PATTERN)

            elif config.FLOW_DOCX_LIBREHTML_S3_ENABLED:
                input_docx_filepath = self.get_input_file_path(input_filename)
                html_output_dir = self.create_html_out_dir(self.file_name_without_ext)

                log_info("generate_html :: DOC to HTML Conversion STARTED ", None)

                libre_converter = LibreConverter(input_filename=input_filename)
                generated_html_file_path = libre_converter.convert_to_html(html_output_path=html_output_dir,
                                                                           input_file_path=input_docx_filepath,
                                                                           timeout=config.PDF_TO_HTML_TIMEOUT)
                urls = self.push_generated_files_for_html_to_s3(generated_html_file_path=generated_html_file_path)
                return self.get_file_url_with_specific_pattern(urls=urls, pattern=self.file_name_without_ext + '.html')


        elif self.file_type in ['pptx']:
            input_pptx_filepath = common_obj.input_path(input_filename)
            pdf_output_dir = config.download_folder

            pdf_converter = LibreConverter(input_filename=input_filename)
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
