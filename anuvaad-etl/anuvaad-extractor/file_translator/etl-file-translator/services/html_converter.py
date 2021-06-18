import os

from anuvaad_auditor import log_info
from pydocx import PyDocX

import config
from services.html_reader_writer import HtmlReaderWriter
from services.pdf_converter import PdfConverter
from services.pdf_to_html import PdfToHtml
from services.service import common_obj


class HtmlConvert(object):
    def __init__(self, input_filename, file_type):
        self.file_name_without_ext = os.path.splitext(input_filename)[0]
        self.file_type = file_type

    def generate_html(self, input_filename):
        if self.file_type in ['docx']:
            input_docx_filepath = common_obj.input_path(input_filename)
            output_html_filepath = common_obj.input_path(self.file_name_without_ext + '.html')
            with open(input_docx_filepath, "rb") as docx_file:
                html = PyDocX.to_html(docx_file)
                f = open(output_html_filepath, "w")
                f.write(html)
                f.close()
            return output_html_filepath
        elif self.file_type in ['pptx']:
            input_pptx_filepath = common_obj.input_path(input_filename)
            pdf_output_dir = config.download_folder

            pdf_converter = PdfConverter(input_filename=input_filename)
            generated_pdf_file_path = pdf_converter.convert_to_pdf(pdf_output_path=pdf_output_dir,
                                                                   input_file_path=input_pptx_filepath, timeout=120)
            file_path, file_name = os.path.split(generated_pdf_file_path)
            new_pdf_file_path = common_obj.input_path(file_name)

            log_info("generate_html PPTX:: PPTX to PDF Conversion successful ", None)

            pdf_to_html = PdfToHtml(input_filename=input_filename)
            html_output_file = common_obj.input_path(self.file_name_without_ext)
            generated_html_file_name = pdf_to_html.convert_pdf_to_html(html_output_dir=html_output_file,
                                                                       input_pdf_file_path=new_pdf_file_path,
                                                                       timeout=120)
            generated_html_file_path = common_obj.input_path(generated_html_file_name)

            html_reader_writer = HtmlReaderWriter(input_filename=input_filename,
                                                  html_file_path=generated_html_file_path,
                                                  html_file_out_path=common_obj.input_path(
                                                      self.file_name_without_ext + '.html'))
            output_html_filepath = html_reader_writer.alter_img_src_to_url_and_save()
            return output_html_filepath
