import os

from pydocx import PyDocX


class PyDocxConverter(object):
    def __init__(self, input_filename):
        self.file_name_without_ext = os.path.splitext(input_filename)[0]

    def get_new_html_file_name(self, file_name):
        if file_name:
            return os.path.join(file_name + '.html')
        else:
            return os.path.join(self.file_name_without_ext + '.html')

    def get_new_html_file_path(self, html_output_dir, html_file_name):
        return os.path.join(html_output_dir, html_file_name)

    def convert_to_html(self, html_output_dir, input_docx_file_path, file_name=''):
        html_file_name = self.get_new_html_file_name(file_name)
        generated_html_file_path = self.get_new_html_file_path(html_output_dir=html_output_dir,
                                                               html_file_name=html_file_name)
        with open(input_docx_file_path, "rb") as docx_file:
            html = PyDocX.to_html(docx_file)
            f = open(generated_html_file_path, "w")
            f.write(html)
            f.close()
        return generated_html_file_path
