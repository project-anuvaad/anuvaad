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

    # after successful html to json conversion returning json filename
    # writing json object into json file 
    def html2json(self,DOWNLOAD_FOLDER, output_htmlfiles_dir, output_filepath):
        response_html2json = HTMl_ops.html_to_json(output_htmlfiles_dir)
        with open(output_filepath, 'w') as f:
            json_object = json.dumps(response_html2json)
            f.write(json_object)
        log.info("successfully json file write done for html to json response")