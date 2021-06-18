import os
import subprocess

from errors.errors_exception import FileErrors


class PdfToHtml(object):
    def __init__(self, input_filename):
        self.file_name_without_ext = os.path.splitext(input_filename)[0]

    def get_new_html_file_name(self):
        return os.path.join(self.file_name_without_ext + '-html.html')

    # pdftohtml -s Quintessence\ of\ Class\ 1-5.pdf HTML/Quintessence\ of\ Class\ 1-5.html
    # Usage: pdftohtml [options] <PDF-file> [<html-file> <xml-file>]

    # working_dir    = os.path.join(workspace_output_dir, 'pdftohtml')
    # create_directory(working_dir)
    #
    # working_dir     = os.path.join(working_dir, 'xml')
    # create_directory(working_dir)
    #
    # shutil.copy(filepath, os.path.join(working_dir, os.path.basename(filepath)))
    #
    #     cmd             = ( 'pdftohtml -xml %s' % (os.path.join(working_dir, os.path.basename(filepath))) )

    # Usage: pdftohtml [options] <PDF-file> [<html-file> <xml-file>]
    def convert_pdf_to_html(self, input_pdf_file_path, html_output_dir, timeout=None):
        args = ['pdftohtml', '-s', input_pdf_file_path, html_output_dir]
        process = subprocess.run(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=timeout)
        # filename = re.search('-> (.*?) using filter', process.stdout.decode())
        if process.stderr.decode() != '':
            raise FileErrors("convert_pdf_to_html", "Error while Converting pdf to html.")
        generated_html_file_name = self.get_new_html_file_name()
        return generated_html_file_name
