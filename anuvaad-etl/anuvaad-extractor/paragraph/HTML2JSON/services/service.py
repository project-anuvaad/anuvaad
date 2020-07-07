from repositories.html_operation import HTMLOperation
from utilities.utils import FileOperation
import logging
import json

file_ops = FileOperation()
HTMl_ops = HTMLOperation()
log = logging.getLogger('file')

class Html2JsonService(object):
    def __init__(self):
        pass

    def html2json(self,DOWNLOAD_FOLDER, output_htmlfiles_dir):
        response_html2json = HTMl_ops.html_to_json(output_htmlfiles_dir)
        log.info("successfully returned json for html to json response")
        return response_html2json