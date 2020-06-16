from src.utilities.utils import FileOperation
from bs4 import BeautifulSoup, Doctype
from lxml import html
import requests
from flask import jsonify
from html_2_json.html2json import Element
import os
import time
import requests
import json
import os

file_ops = FileOperation()

class PdfOperation(object):

    def __init__(self):
        pass

    def pdf_to_html(self, input_pdf_file):
        output_html_filepath = file_ops.file_download('upload/' + str(time.time()).replace('.', ''))
        os.system('pdftohtml -p -c {} {}'.format(input_pdf_file, output_html_filepath + '/html'))
        return output_html_filepath

    def html_to_imageprocess(self, output_html_filepath):
        png_files, y = file_ops.segregate_png_html(output_html_filepath)
        sorted_png_files = file_ops.sorting_html_png_list(png_files, "png")
        response_imagedata = list()
        for image_file in sorted_png_files:
            local_image_filepath = os.path.join(output_html_filepath,image_file)
            uploaded_image_path = file_ops.get_uploaded_image_filepath(local_image_filepath)
            uploaded_image_id = str(uploaded_image_path['filepath'])
            api_url_base = 'https://auth.anuvaad.org/extract'
            files = {'image_file_id': uploaded_image_id}
            headers = {'Content-Type': 'application/json'}
            response = requests.post(url = api_url_base, json=files, headers=headers)
            res = json.loads(response.content)
            response_imagedata.append(res)
        return response_imagedata

    def html_to_json(self, output_html_filepath):
        x , html_files = file_ops.segregate_png_html(output_html_filepath)
        sorted_html_files = file_ops.sorting_html_png_list(html_files, "html")
        response_htmlTOjson = list()
        for item in sorted_html_files:
            local_html_filepath = os.path.join(output_html_filepath,item)
            with open(local_html_filepath,'r', encoding='utf-8') as f:
                data = f.read()
                element = Element("<html>")
                json_data = element.parse(data)
                data_html_nodes = file_ops.making_html_nodes(json_data)
                response_htmlTOjson.append({"html_nodes" : data_html_nodes})
                print("--------page done----------")
        return response_htmlTOjson     
                
                
                