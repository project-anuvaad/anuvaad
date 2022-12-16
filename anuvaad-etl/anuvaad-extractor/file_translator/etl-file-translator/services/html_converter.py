import os
import shutil

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
    def __init__(self, input_filename, file_type, json_data):
        self.json_data = json_data
        self.file_name_without_ext = os.path.splitext(input_filename)[0]
        self.file_type = file_type
        self.generated_html_file_path = None
        # All the below variable set based on flow configuration
        self.input_file_dir = None
        self.pdf_file_dir = None
        self.html_file_dir = None
        self.output_files = {
            "HTML": {
                "LIBRE": "",
                "PDFTOHTML": "",
                "PYDOCX": ""
            },
            "PDF": {
                "LIBRE": ""
            }
        }

    def check_compatibility_of_tool(self, input_type, output_type, tool):
        input_type = input_type.upper()
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

    def create_html_out_dir(self, user_given_path=''):
        # All the html file should get stored with folder structure /upload/<file_name>/<HTML_FILE>
        if user_given_path:
            html_output_dir = common_obj.output_path(output_path=user_given_path)
        else:
            html_output_dir = common_obj.output_path(output_path=self.file_name_without_ext)

        if not file_ops.create_directory(html_output_dir):
            raise FileErrors("DIRECTORY_CREATION_ERROR", "Error while creating Directory.")
        return html_output_dir

    def get_input_file_path(self, file_name):
        # All input file should be coming from upload folder
        return common_obj.input_path(input_filename=file_name)

    def create_pdf_out_dir(self, user_given_path=''):
        if user_given_path:
            pdf_out_dir = common_obj.output_path(output_path=user_given_path)
        else:
            pdf_out_dir = common_obj.output_path(output_path=self.file_name_without_ext)

        if not file_ops.create_directory(pdf_out_dir):
            raise FileErrors("DIRECTORY_CREATION_ERROR", "Error while creating Directory.")
        return pdf_out_dir

    def push_generated_files_to_s3(self, generated_files_dir):
        s3 = S3BucketUtils()
        urls = s3.upload_dir(dir_path=generated_files_dir)
        return urls

    def get_html_file_name_on_s3(self, generated_html_file_path, tool):
        file_dir, file_name = os.path.split(generated_html_file_path)

        if tool == config.TOOL_PDF_TO_HTML:
            file_name = file_name + '-html.html'
        if tool == config.TOOL_LIBRE:
            file_name = file_name + '.html'

        return file_name

    def push_to_s3(self, generated_file_dir, tool=''):
        urls = self.push_generated_files_to_s3(generated_files_dir=generated_file_dir)
        return urls

    def convert_docx_to_html_pydocx(self, input_filename, input_docx_filepath):
        html_output_dir = self.html_file_dir
        pydocx_obj = PyDocxConverter(input_filename=input_filename)
        generated_html_file_path = pydocx_obj.convert_to_html(html_output_dir=html_output_dir,
                                                              input_docx_file_path=input_docx_filepath)
        return generated_html_file_path

    def convert_to_pdf_libre(self, input_filename, input_filepath):
        pdf_output_dir = self.pdf_file_dir
        libre_converter = LibreConverter(input_filename=input_filename, json_data=self.json_data)
        generated_pdf_file_path = libre_converter.convert_to_pdf(pdf_output_path=pdf_output_dir,
                                                                 input_file_path=input_filepath)
        return generated_pdf_file_path

    def convert_pdf_to_html_pdftohtml(self, input_filename, generated_pdf_file_path):
        html_output_dir = self.html_file_dir
        pdf_to_html = PdfToHtmlConverter(input_filename=input_filename, json_data=self.json_data)
        generated_html_file_path = pdf_to_html.convert_pdf_to_html(html_output_dir=html_output_dir,
                                                                   input_pdf_file_path=generated_pdf_file_path)
        return generated_html_file_path

    def convert_docx_to_html_libre(self, input_filename, input_docx_filepath):
        html_output_dir = self.html_file_dir
        libre_converter = LibreConverter(input_filename=input_filename, json_data=self.json_data)
        generated_html_file_path = libre_converter.convert_to_html(html_output_dir=html_output_dir, input_file_path=input_docx_filepath)
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
        self.input_file_dir = config.download_folder
        self.pdf_file_dir = self.create_pdf_out_dir()
        self.html_file_dir = self.create_html_out_dir()

        if self.file_type in [config.TYPE_DOCX]:
            if config.FLOW_DOCX_LIBRE_PDF_PDFTOHTML_HTML_S3_ENABLED:  # TODO make change in the return
                log_info("generate_html :: DOC to HTML FLOW: FLOW_DOCX_LIBRE_PDF_PDFTOHTML_HTML_S3_ENABLED Started. ", self.json_data)

                # CONVERT DOCX TO PDF: LIBRE
                generated_pdf_file_path = self.convert_to_pdf(input_filename=input_filename, tool=config.TOOL_LIBRE)
                # CONVERT PDF TO HTML: PDF TO HTML
                self.generated_html_file_path = self.convert_pdf_to_html_pdftohtml(input_filename=input_filename,
                                                                                   generated_pdf_file_path=generated_pdf_file_path)
                # PUSH TO S3
                urls = self.push_to_s3(generated_file_dir=self.generated_html_file_path)

                log_info("generate_html :: DOC to HTML FLOW: FLOW_DOCX_LIBRE_PDF_PDFTOHTML_HTML_S3_ENABLED ENDED. ", self.json_data)
                return urls

            elif config.FLOW_DOCX_LIBREHTML_S3_ENABLED:  # TODO make change in the return
                log_info("generate_html :: DOC to HTML FLOW: FLOW_DOCX_LIBREHTML_S3_ENABLED Started. ", self.json_data)

                # CONVERT DOCX TO HTML: LIBRE
                self.generated_html_file_path = self.convert_directly_to_html(input_filename=input_filename, tool=config.TOOL_LIBRE)

                urls = self.push_to_s3(generated_file_dir=self.generated_html_file_path)

                log_info("generate_html :: DOC to HTML FLOW: FLOW_DOCX_LIBREHTML_S3_ENABLED Ended. ", self.json_data)
                return urls

            elif config.FLOW_DOCX_PYDOCXHTML_S3_ENABLED:  # TODO make change in the return
                log_info("generate_html :: DOC to HTML FLOW: FLOW_DOCX_PYDOCXHTML_S3_ENABLED Started. ", self.json_data)

                # CONVERT DOCX TO HTML: PYDOCX
                self.generated_html_file_path = self.convert_directly_to_html(input_filename=input_filename, tool=config.TOOL_PYDOCX)

                urls = self.push_to_s3(generated_file_dir=self.generated_html_file_path)

                log_info("generate_html :: DOC to HTML FLOW: FLOW_DOCX_PYDOCXHTML_S3_ENABLED Ended. ", self.json_data)

                return urls

            elif config.FLOW_DOCX_LIBREHTML_LIBREPDF_PDFTOHTML_HTML_S3_ENABLED:
                '''This Flow will have two steps:
                    1. DOCX to HTML using LIBRE.
                    2. DOCX TO PDF(LIBRE) THEN PDF to  HTML(PDFTOHTML).'''

                log_info("generate_html :: DOC to HTML FLOW: FLOW_DOCX_LIBREHTML_LIBREPDF_PDFTOHTML_HTML_S3_ENABLED Started.", self.json_data)

                # Step 1: DOCX TO HTML using LIBRE.
                log_info("generate_html :: DOCX to HTML FLOW1 START : FLOW_DOCX_LIBREHTML_LIBREPDF_PDFTOHTML_HTML_S3_ENABLED Started. ", self.json_data)
                html_out_flow1 = os.path.join(self.file_name_without_ext, config.TOOL_LIBRE)
                self.html_file_dir = self.create_html_out_dir(html_out_flow1)
                self.generated_html_file_path = self.convert_directly_to_html(input_filename=input_filename, tool=config.TOOL_LIBRE)

                if common_obj.is_directory_empty(dir_path=self.html_file_dir):
                    raise FileErrors("DIRECTORY_EMPTY", f"Error while generating HTML or PDF file, Dir Path: {self.html_file_dir}")

                urls = self.push_to_s3(generated_file_dir=self.html_file_dir)
                generated_html_file_url_FLOW1 = common_obj.get_url_for_specific_file(urls=urls, out_dir=self.html_file_dir,
                                                                                     file_name=self.file_name_without_ext, extension='.html',
                                                                                     tool=config.TOOL_LIBRE)
                self.output_files[config.TYPE_HTML][config.TOOL_LIBRE] = generated_html_file_url_FLOW1

                log_info("generate_html :: DOCX to HTML FLOW1 END : FLOW_DOCX_LIBREHTML_LIBREPDF_PDFTOHTML_HTML_S3_ENABLED Ened. ", self.json_data)

                # Step 2: DOCX TO PDF using LIBRE then PDF to HTML using HTMLTOPDF.
                # CONVERT DOCX TO PDF: LIBRE
                log_info("generate_html :: DOCX to HTML FLOW2 START : FLOW_DOCX_LIBREHTML_LIBREPDF_PDFTOHTML_HTML_S3_ENABLED Started. ", self.json_data)

                html_out_flow2 = os.path.join(self.file_name_without_ext, config.TOOL_PDF_TO_HTML)
                self.pdf_file_dir = self.create_pdf_out_dir(html_out_flow2)
                self.html_file_dir = self.create_html_out_dir(html_out_flow2)

                generated_pdf_file_path = self.convert_to_pdf(input_filename=input_filename, tool=config.TOOL_LIBRE)

                # CONVERT PDF TO HTML: PDF TO HTML
                self.generated_html_file_path = self.convert_pdf_to_html_pdftohtml(input_filename=input_filename,
                                                                                   generated_pdf_file_path=generated_pdf_file_path)

                if common_obj.is_directory_empty(dir_path=self.html_file_dir):
                    raise FileErrors("DIRECTORY_EMPTY", f"Error while generating HTML or PDF file, Dir Path: {self.html_file_dir}")

                # PUSH TO S3
                urls = self.push_to_s3(generated_file_dir=self.html_file_dir)
                generated_html_file_url_FLOW2 = common_obj.get_url_for_specific_file(urls=urls, out_dir=self.html_file_dir,
                                                                                     file_name=self.file_name_without_ext, extension='.html',
                                                                                     tool=config.TOOL_PDF_TO_HTML)
                self.output_files[config.TYPE_HTML][config.TOOL_PDF_TO_HTML] = generated_html_file_url_FLOW2

                generated_pdf_file_url_FLOW2 = common_obj.get_url_for_specific_file(urls=urls, out_dir=self.html_file_dir,
                                                                                    file_name=self.file_name_without_ext, extension='.pdf',
                                                                                    tool=config.TOOL_LIBRE)
                self.output_files[config.TYPE_PDF][config.TOOL_LIBRE] = generated_pdf_file_url_FLOW2

                log_info("generate_html :: DOCX to HTML FLOW2 END : FLOW_DOCX_LIBREHTML_LIBREPDF_PDFTOHTML_HTML_S3_ENABLED Ened. ", self.json_data)

                return self.output_files





        elif self.file_type in [config.TYPE_PPTX]:
            log_info("generate_html :: PPTX to HTML FLOW Started. ", None)
            if config.FLOW_PPTX_LIBRE_PDF_PDFTOHTML_HTML_S3_ENABLED:

                self.input_file_dir = config.download_folder
                self.pdf_file_dir = self.create_pdf_out_dir(self.file_name_without_ext)
                self.html_file_dir = self.create_html_out_dir(self.file_name_without_ext)


                log_info("generate_html :: PPTX to HTML START : FLOW_PPTX_LIBRE_PDF_PDFTOHTML_HTML_S3_ENABLED Started.", None)

                # CONVERT PPTX TO PDF: LIBRE
                generated_pdf_file_path = self.convert_to_pdf(input_filename=input_filename, tool=config.TOOL_LIBRE)

                # CONVERT PDF TO HTML: PDF TO HTML
                self.generated_html_file_path = self.convert_pdf_to_html_pdftohtml(input_filename=input_filename,
                                                                                   generated_pdf_file_path=generated_pdf_file_path)

                if common_obj.is_directory_empty(dir_path=self.html_file_dir):
                    raise FileErrors("DIRECTORY_EMPTY", f"Error while generating HTML or PDF file, Dir Path: {self.html_file_dir}")

                # PUSH TO S3
                urls = self.push_to_s3(generated_file_dir=self.html_file_dir)

                generated_pdf_file_url = common_obj.get_url_for_specific_file(urls=urls, out_dir=self.pdf_file_dir,
                                                                              file_name=self.file_name_without_ext, extension='.pdf',
                                                                              tool=config.TOOL_LIBRE)
                self.output_files[config.TYPE_PDF][config.TOOL_LIBRE] = generated_pdf_file_url

                generated_html_file_url = common_obj.get_url_for_specific_file(urls=urls, out_dir=self.html_file_dir,
                                                                                     file_name=self.file_name_without_ext, extension='.html',
                                                                                     tool=config.TOOL_PDF_TO_HTML)
                self.output_files[config.TYPE_HTML][config.TOOL_PDF_TO_HTML] = generated_html_file_url


                log_info("generate_html :: PPTX to HTML FLOW  END: FLOW_PPTX_LIBRE_PDF_PDFTOHTML_HTML_S3_ENABLED Ended.", self.json_data)
                return self.output_files

            elif config.FLOW_PPTX_LIBRE_PDF_S3_ENABLED:

                self.input_file_dir = config.download_folder
                self.pdf_file_dir = self.create_pdf_out_dir(self.file_name_without_ext)

                log_info("generate_html :: PPTX to PDF START : FLOW_PPTX_LIBRE_PDF_S3_ENABLED Started.", self.json_data)

                # CONVERT PPTX TO PDF: LIBRE
                generated_pdf_file_path = self.convert_to_pdf(input_filename=input_filename, tool=config.TOOL_LIBRE)

                # PUSH TO S3
                urls = self.push_to_s3(generated_file_dir=self.pdf_file_dir)
                generated_pdf_file_url = common_obj.get_url_for_specific_file(urls=urls, out_dir=self.pdf_file_dir,
                                                                              file_name=self.file_name_without_ext, extension='.pdf',
                                                                              tool=config.TOOL_LIBRE)
                self.output_files[config.TYPE_PDF][config.TOOL_LIBRE] = generated_pdf_file_url

                log_info("generate_html :: PPTX to PDF END : FLOW_PPTX_LIBRE_PDF_S3_ENABLED Ended.", self.json_data)
                return self.output_files

        elif self.file_type in [config.TYPE_HTML]:
            log_info("generate_html :: HTML FLOW Started.", self.json_data)

            input_filepath = self.get_input_file_path(file_name=input_filename)
            shutil.copy2(src=input_filepath, dst=self.html_file_dir)

            if common_obj.is_directory_empty(dir_path=self.html_file_dir):
                raise FileErrors("DIRECTORY_EMPTY", f"Error while generating HTML or PDF file, Dir Path: {self.html_file_dir}")

            # PUSH TO S3
            urls = self.push_to_s3(generated_file_dir=self.html_file_dir)

            generated_html_file_url = common_obj.get_url_for_specific_file(urls=urls, out_dir=self.html_file_dir,
                                                                                 file_name=self.file_name_without_ext, extension='.html',
                                                                                 tool=None)
            self.output_files[config.TYPE_HTML][config.TOOL_PDF_TO_HTML] = generated_html_file_url
            self.output_files[config.TYPE_HTML][config.TOOL_LIBRE] = generated_html_file_url
            self.output_files[config.TYPE_PDF][config.TOOL_LIBRE] = ""

            log_info("generate_html :: HTML FLOW Ended.", self.json_data)
            return self.output_files










