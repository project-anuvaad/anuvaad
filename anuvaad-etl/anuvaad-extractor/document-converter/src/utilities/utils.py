import os
from pathlib import Path
import base64
import math
import uuid
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.fonts import addMapping
from reportlab.pdfbase import pdfmetrics
from zipfile import ZipFile
from config import DATA_OUTPUT_DIR

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

    def zipfile_creation(filepath):
        arcname = filepath.replace(f"{DATA_OUTPUT_DIR}/","")
        zip_file = filepath.split('.')[0] + '.zip'
        with ZipFile(zip_file, 'w') as myzip:
            myzip.write(filepath,arcname)
        os.remove(filepath)
        return zip_file.split('/')[-1]

        
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

    def url_generation(self, url_pre, record_id, start_page, end_page):
        url_modified = url_pre + '/anuvaad/content-handler/v0/fetch-content?record_id={}&start_page={}&end_page={}'.format(record_id, start_page, end_page)
        return url_modified

    def generate_url(self, url_pre, record_id, start_page, end_page):
        url_modified = url_pre + '/anuvaad/ocr-content-handler/v0/ocr/fetch-document?recordID={}&start_page={}&end_page={}'.format(record_id, start_page, end_page)
        return url_modified

    def vertices_to_boundingbox(self,vertices):
        c1, c2, c3, c4  = vertices[0], vertices[1], vertices[2], vertices[3]
        left, top       = c1['x'], c1['y']
        width, height   = (c3['x'] - c1['x']), (c3['y'] - c1['y'])
        return (left, top, width, height)

    def get_page_dimensions(self,page):
        _, _, w, h = self.vertices_to_boundingbox(page['boundingBox']['vertices'])
        return w, h

    def draw_line_text(self,page_canvas, x, y, text, word_space=1.75, horizontal_scale=105, font_name=None, font_size=8):
        txtobj = page_canvas.beginText()
        txtobj.setTextOrigin(x, y)
        txtobj.setWordSpace(word_space)
        txtobj.setHorizScale(horizontal_scale)
        txtobj.setFont(font_name, font_size)
        txtobj.textLine(text=text)
        page_canvas.drawText(txtobj)

    def load_font(self,font_name='arial-unicode-ms', font_dir=None):
        pdfmetrics.registerFont(TTFont(font_name, os.path.join(font_dir, font_name + '.ttf')))

   