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
        output_filepath, output_filename = file_ops.output_path(DOWNLOAD_FOLDER)
        write_file = open(output_filepath, 'w', encoding='utf-16')
        log.info("json output file writing started")
        json_data = json.dumps(response_html2json)
        write_file.write("%s"%json_data)
        write_file.close()
        log.info("successfully craeted json file for html to json response")
        return output_filename