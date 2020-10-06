import os
from pathlib import Path
import base64
import math
import uuid

class FileUtilities():

    def __init__(self):
        pass

    def file_download(self, downloading_folder):
        download_dir = Path(os.path.join(os.curdir,downloading_folder))
        if download_dir.exists() is False:
            os.makedirs(download_dir)
        return download_dir

    def output_doc_path(self, record_id, download_folder):
        output_path = os.path.join(download_folder ,record_id + '.docx')
        return output_path

        
class DocumentUtilities():

    def __init__(self):
        pass

    def get_cms(self, pixels):
        PPI          = 108
        PIXEL_PER_CM = PPI / 2.54
        return pixels / PIXEL_PER_CM

    def get_path_from_base64(self, work_dir, b64_data):
        filepath = os.path.join(work_dir, str(uuid.uuid4().hex) + '.jpg')
        with open(filepath, 'wb') as f:
            f.write(base64.b64decode(b64_data))
        return filepath

    def pixel_to_twips(self, px, dpi=108):
        INCH_TO_TWIPS  = 1440
        px_to_inches   = 1.0 / float(dpi)
        return math.ceil(px * px_to_inches * INCH_TO_TWIPS)

    def url_generation(self, url_pre, record_id, job_id, start_page, end_page):
        url_modified = url_pre + '?record_id={}&job_id={}&start_page={}&end_page={}'.format(record_id, job_id, start_page, end_page)
        return url_modified