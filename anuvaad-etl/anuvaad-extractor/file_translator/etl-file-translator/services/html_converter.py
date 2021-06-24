import os

from anuvaad_auditor import log_info

import config
from errors.errors_exception import FileErrors
from services.libre_converter import LibreConverter
from services.pdftohtml_converter import PdfToHtmlConverter
from services.pydocx_converter import PyDocxConverter
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
    
    COVERTER SUPPORTED:
    1. docx to pdf: Libre
    2. docx to html: Libre, pydocx
    3. pptx to pdf: Libre
    4. pdf to html: pdftohtml 
'''


class HtmlConvert(object):
    def __init__(self, input_filename, file_type):
        self.file_name_without_ext = os.path.splitext(input_filename)[0]
        self.file_type = file_type
        self.generated_html_file_path = None

    def check_compatibility_of_tool(self, input_type, output_type, tool):
        if tool == config.TOOL_LIBRE:
            if input_type == config.TYPE_DOCX:
                if output_type == config.TYPE_PDF:
                    return True
                elif output_type == config.TYPE_HTML:
                    return True
            elif input_type == config.TYPE_PPTX:
                if output_type == config.TYPE_PDF:
                    return True

        elif tool == config.TOOL_PYDOCX:
            if input_type == config.TYPE_DOCX:
                if output_type == config.TYPE_HTML:
                    return True

        elif tool == config.TOOL_PDF_TO_HTML:
            if input_type == config.TYPE_PDF:
                if output_type == config.TYPE_HTML:
                    return True
        else:
            return False

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

    def convert_docx_to_html_pydocx(self, input_filename, input_docx_filepath):
        html_output_dir = self.create_html_out_dir(filename_without_extension=self.file_name_without_ext)
        pydocx_obj = PyDocxConverter(input_filename=input_filename)
        generated_html_file_path = pydocx_obj.convert_to_html(html_output_dir=html_output_dir,
                                                              input_docx_file_path=input_docx_filepath)
        return generated_html_file_path

    def convert_to_pdf_libre(self, input_filename, input_filepath):
        pdf_output_dir = self.get_pdf_out_dir()
        libre_converter = LibreConverter(input_filename=input_filename)
        generated_pdf_file_path = libre_converter.convert_to_pdf(pdf_output_path=pdf_output_dir,
                                                                 input_file_path=input_filepath)
        return generated_pdf_file_path

    def convert_pdf_to_html_pdftohtml(self, input_filename, generated_pdf_file_path):
        html_output_dir = self.create_html_out_dir(filename_without_extension=self.file_name_without_ext)
        pdf_to_html = PdfToHtmlConverter(input_filename=input_filename)
        generated_html_file_path = pdf_to_html.convert_pdf_to_html(html_output_dir=html_output_dir,
                                                                   input_pdf_file_path=generated_pdf_file_path)
        return generated_html_file_path

    def convert_docx_to_html_libre(self, input_filename, input_docx_filepath):
        html_output_dir = self.create_html_out_dir(self.file_name_without_ext)
        libre_converter = LibreConverter(input_filename=input_filename)
        generated_html_file_path = libre_converter.convert_to_html(html_output_dir=html_output_dir,
                                                                   input_file_path=input_docx_filepath)
        return generated_html_file_path

    def convert_directly_to_html(self, input_filename, tool=None):
        if not tool:
            raise FileErrors("DOCX_HTML_CONVERTER_TOOL_MISSING", "convert_docx_directly_to_html: Tool is missing.")

        if not self.check_compatibility_of_tool(input_type=self.file_type, output_type=config.TYPE_PDF, tool=tool):
            raise FileErrors("DOCX_HTML_CONVERTER_TOOL_INCOMPATIBLE",
                             "convert_docx_directly_to_html: Tool is Incompatible.")

        input_filepath = self.get_input_file_path(file_name=input_filename)

        if tool == config.TOOL_LIBRE:
            return self.convert_docx_to_html_libre(input_filename=input_filename, input_docx_filepath=input_filepath)
        elif tool == config.TOOL_PYDOCX:
            return self.convert_docx_to_html_pydocx(input_filename=input_filename, input_docx_filepath=input_filepath)
        else:
            raise FileErrors("DOCX_HTML_CONVERTER_TOOL_INVALID", "convert_docx_directly_to_html: pass a valid tool.")

    def convert_to_pdf(self, input_filename, tool=''):
        if not tool:
            raise FileErrors("DOCX_PDF_CONVERTER_TOOL_MISSING", "convert_to_pdf: Tool is missing.")

        if not self.check_compatibility_of_tool(input_type=self.file_type, output_type=config.TYPE_PDF, tool=tool):
            raise FileErrors("DOCX_PDF_CONVERTER_TOOL_INCOMPATIBLE", "convert_to_pdf: Tool is Incompatible.")

        input_filepath = self.get_input_file_path(file_name=input_filename)

        if tool == config.TOOL_LIBRE:
            return self.convert_to_pdf_libre(input_filename=input_filename, input_filepath=input_filepath)
        else:
            raise FileErrors("DOCX_PDF_CONVERTER_TOOL_INVALID", "convert_docx_to_pdf: pass a valid tool.")

    def generate_html(self, input_filename):
        if self.file_type in ['docx']:
            if config.FLOW_DOCX_LIBRE_PDF_PDFTOHTML_HTML_S3_ENABLED:
                log_info("generate_html :: DOC to HTML FLOW: FLOW_DOCX_LIBRE_PDF_PDFTOHTML_HTML_S3_ENABLED Started. ",
                         None)

                # CONVERT DOCX TO PDF: LIBRE
                generated_pdf_file_path = self.convert_to_pdf(input_filename=input_filename,
                                                              tool=config.TOOL_LIBRE)
                # CONVERT PDF TO HTML: PDF TO HTML
                self.generated_html_file_path = self.convert_pdf_to_html_pdftohtml(input_filename=input_filename,
                                                                                   generated_pdf_file_path=generated_pdf_file_path)
                # PUSH TO S3
                generated_html_file_url = self.push_to_s3(generated_html_file_path=self.generated_html_file_path)

                log_info("generate_html :: DOC to HTML FLOW: FLOW_DOCX_LIBRE_PDF_PDFTOHTML_HTML_S3_ENABLED ENDED. ",
                         None)
                return generated_html_file_url

            elif config.FLOW_DOCX_LIBREHTML_S3_ENABLED:
                log_info("generate_html :: DOC to HTML FLOW: FLOW_DOCX_LIBREHTML_S3_ENABLED Started. ", None)

                # CONVERT DOCX TO HTML: LIBRE
                self.generated_html_file_path = self.convert_directly_to_html(input_filename=input_filename,
                                                                              tool=config.TOOL_LIBRE)

                generated_html_file_url = self.push_to_s3(generated_html_file_path=self.generated_html_file_path)

                log_info("generate_html :: DOC to HTML FLOW: FLOW_DOCX_LIBREHTML_S3_ENABLED Ended. ", None)
                return generated_html_file_url

            elif config.FLOW_DOCX_PYDOCXHTML_S3_ENABLED:
                log_info("generate_html :: DOC to HTML FLOW: FLOW_DOCX_PYDOCXHTML_S3_ENABLED Started. ", None)

                # CONVERT DOCX TO HTML: PYDOCX
                self.generated_html_file_path = self.convert_directly_to_html(input_filename=input_filename,
                                                                              tool=config.TOOL_PYDOCX)

                generated_html_file_url = self.push_to_s3(generated_html_file_path=self.generated_html_file_path)

                log_info("generate_html :: DOC to HTML FLOW: FLOW_DOCX_PYDOCXHTML_S3_ENABLED Ended. ", None)

                return generated_html_file_url

        elif self.file_type in ['pptx']:
            log_info("generate_html :: PPTX to HTML FLOW Started. ", None)

            # CONVERT PPTX TO PDF: LIBRE
            generated_pdf_file_path = self.convert_to_pdf(input_filename=input_filename, tool=config.TOOL_LIBRE)

            # CONVERT PDF TO HTML: PDF TO HTML
            self.generated_html_file_path = self.convert_pdf_to_html_pdftohtml(input_filename=input_filename,
                                                                               generated_pdf_file_path=generated_pdf_file_path)
            # PUSH TO S3
            generated_html_file_url = self.push_to_s3(generated_html_file_path=self.generated_html_file_path)

            log_info("generate_html :: PPTX to HTML FLOW  ENDED. ", None)
            return generated_html_file_url
