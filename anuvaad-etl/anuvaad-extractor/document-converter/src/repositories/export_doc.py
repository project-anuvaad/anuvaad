import requests
import config
import os
import json
from utilities import DocumentUtilities,FileUtilities,MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
from zipfile import ZipFile
from reportlab.pdfgen import canvas
from jsonpath_rw import jsonpath, parse
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer  
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle   
from reportlab.lib.enums import TA_CENTER,TA_JUSTIFY       
from reportlab.pdfbase import pdfmetrics      
from reportlab.pdfbase.ttfonts import TTFont   
from reportlab.lib.fonts import addMapping
from reportlab.lib.pagesizes import letter, A4
from reportlab.pdfgen import canvas
import pdftotext

doc_utils = DocumentUtilities()

def zipfile_creation(filepath):
    zip_file = filepath.split('.')[0] + '.zip'
    with ZipFile(zip_file, 'w') as myzip:
        myzip.write(filepath)
        myzip.close()
    os.remove(filepath)
    return zip_file.split('/')[-1]

class DocumentExporterRepository(object):

    def __init__(self):
        pass
        # self.DOWNLOAD_FOLDER = DOWNLOAD_FOLDER
        # self.output_filepath  = os.path.join(self.DOWNLOAD_FOLDER ,"test")

    # getting document json data from fetch-content end point of content-handler.
    def get_data_from_ocr_content_handler(self, record_id, start_page=0, end_page=0):
        
        
        try:
            token="xxxx"#auth-token,"auth-token":token
            headers = {"Content-Type": "application/json"}
            request_url = doc_utils.generate_url(config.OCR_CONTENT_HANDLER_HOST, record_id, 0, 0)
            print(request_url,"**********")
            log_info("Intiating request to fetch data from %s"%request_url, MODULE_CONTEXT)
            response = requests.get(request_url, headers = headers)
            response_data = response.content
            log_info("Received data from fetch-content end point of ocr-content-handler", MODULE_CONTEXT)
            dict_str = response_data.decode("UTF-8")
            dict_json_data = json.loads(dict_str)
            return dict_json_data
        except Exception as e:
            log_exception("Can not fetch content in content handler:{}".format(str(e)), MODULE_CONTEXT, e)

    # converting document json data into pandas dataframes.
    def get_page_paragraphs_lines(self, page):
        try:
            page_paragraphs    = []
            page_lines         = []
    
            if 'regions'in page.keys():
                for para_region in page['regions']:
                    if 'class' in para_region.keys() and 'regions' in para_region.keys():
                        if para_region['class'] == 'PARA':
                            lines = []
                            for line_region in para_region['regions']:
                                if 'class' in line_region.keys() and 'regions' in line_region.keys():
                                    if line_region['class'] == 'LINE':
                                        words = []
                                        for word_region in line_region['regions']:
                                            if 'class' in word_region.keys() and 'text' in word_region.keys():
                                                if word_region['class'] == 'WORD':
                                                    words.append(word_region['text'])

                                        lines.append(' '.join(words) + '\n')
                                        page_lines.append({'boundingBox': doc_utils.vertices_to_boundingbox(line_region['boundingBox']['vertices']), 
                                                    'text': ' '.join(words)})

                            page_paragraphs.append({'boundingBox': doc_utils.vertices_to_boundingbox(para_region['boundingBox']['vertices']), 
                                                'text': ''.join(lines)})
            return page_paragraphs, page_lines
        except Exception as e:
            log_exception("Page regions formation error", MODULE_CONTEXT, e)


    def create_pdf(self,pages, pdf_filepath, font_name, font_size=40, scale_factor=4):

        doc_utils.load_font('arial-unicode-ms', config.FONT_DIR)
        
        w, h                      = doc_utils.get_page_dimensions(pages[0])
        pagesize                  = (w/scale_factor, h/scale_factor)
        c                         = canvas.Canvas(pdf_filepath, pagesize=pagesize)
  
        for page in pages:

            paragraphs, lines     = self.get_page_paragraphs_lines(page)
                
            for line in lines:
                boundingBox, text = line['boundingBox'], line['text']
                x, y, _, _        = boundingBox
                y                 = h - y
                doc_utils.draw_line_text(c, x/scale_factor, y/scale_factor, text, 1.75, 105, font_name, font_size/scale_factor)
            c.showPage()
        c.save()
        log_info('PDF created: %s' % (pdf_filepath),MODULE_CONTEXT)
        return pdf_filepath


    def create_pdf_to_text(self,pdf_filepath):
        try:
            with open(pdf_filepath, "rb") as f:
                pages = pdftotext.PDF(f)
        except Exception as e:
            log_exception("Exception on generating txt from pdf :{}".format(str(e)),MODULE_CONTEXT,e)
            return False
        
        text_filename = os.path.splitext(os.path.basename(pdf_filepath))[0] + '.txt'
        text_filepath = os.path.join(os.path.dirname(pdf_filepath), text_filename)

        try:
            with open(text_filepath, 'w') as txt:
                txt.write("\n\n".join(pages))
        except Exception as e:
            log_exception("Exception on generating txt from pdf :{}".format(str(e)),MODULE_CONTEXT,e)
            return False
        return text_filepath