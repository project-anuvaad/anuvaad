import os
import time
from pathlib import Path
import json
import requests
import re

class FileOperation(object):

    def __init__(self):
        self.download_folder = None

    def file_download(self, downloading_folder):
        self.download_folder = downloading_folder
        download_dir = Path(os.path.join(os.getcwd(), self.download_folder))
        if download_dir.exists() is False:
            os.makedirs(download_dir)
        return str(download_dir)

    def get_uploaded_image_filepath(self, local_image_path):
        api_url_base = 'https://auth.anuvaad.org/upload'
        data = open(local_image_path, 'rb')
        try:
            print('uploading : %s'%local_image_path)
            r = requests.post(url = api_url_base, data = data, headers = {'Content-Type': 'application/x-www-form-urlencoded'})
            r.raise_for_status()
        except requests.exceptions.HTTPError as e:
            print (e.response.text)
            return None
        obj        = json.loads(r.text)
        return obj['data']

    def segregate_png_html(self, output_dir_html):
        png_items = list()
        html_items = list()
        for item in os.listdir(output_dir_html):
            if item.endswith('.png'):
                png_items.append(item)
            elif item.endswith('.html'):
                html_items.append(item)
        return png_items, html_items

    def sorting_html_png_list(self, list_data, data_tag):
        iteration_no = len(list_data)
        output_list = list()
        if data_tag == "html":
            for i in range(iteration_no - 2):
                i+=1
                filename = data_tag + '-' + str(i) + '.' + data_tag
                output_list.append(filename)
        elif data_tag == "png":
            for i in range(iteration_no):
                i+=1
                filename = 'html' + str('%03d'%i) + '.' + data_tag
                output_list.append(filename)
        return output_list

    def making_html_nodes(self, data):
        child_data = data.child
        child_data_for_class_style = child_data[0].child[2].text
        child_data_for_tags = child_data[1].child[0]
        class_style_list = self.finding_class_styles(child_data_for_class_style)
        html_nodes_pagewise = self.replacing_class_style_inside_child_child(child_data_for_tags, class_style_list)
        return html_nodes_pagewise

    def finding_class_styles(self, text):
        pattern = r"\."
        re_text = re.split(pattern, text)
        class_style_pagewise = list()
        i = 0
        for item in re_text:
            fo_text = re.search(r"^ft", item)
            if fo_text is not None:
                class_style_text= item[item.find("{")+1:item.find("}")]
                splitted_class_style_json = self.making_json_of_class_styles(class_style_text)
                class_style_id = "ft" + str('%02d'%i)
                class_style_pagewise.append({"class" : class_style_id , "class_style" : splitted_class_style_json})
                i+=1
        return class_style_pagewise

    def making_json_of_class_styles(self, text):
        splitted_text = re.split(r"\;", text)
        class_style_wo_id = dict()
        for item in splitted_text:
            key_value_split = re.split(r"\:", item)
            if len(key_value_split) != 0 and key_value_split != ['']:
                class_style_wo_id.update({str(key_value_split[0]): str(key_value_split[1])})
        return class_style_wo_id

    def replacing_class_style_inside_child_child(self, child_tag_data, tag_class_style_list):
        html_nodes_per_page = list()
        page_no = self.page_no_of_file(child_tag_data)
        for item in child_tag_data.child:
            if item.tag == 'p':
                item_attr = item.attr
                tag_style = item_attr['style']
                tag_class = item_attr['class'][0]
                tag_class_id, tag_class_style = self.extracting_values_of_class_styles(tag_class, tag_class_style_list) 
                item_attr_style_json = self.making_json_of_class_styles(tag_style)
                x, y = self.left_top_position(item_attr_style_json)
                item_child = item.child
                if len(item_child) != 0:
                    text = item_child[0].text
                    html_node_p_tag = self.output_html_node_format(page_no, x, y, tag_class_id, tag_class_style, tag_style, text)
                    html_nodes_per_page.append(html_node_p_tag)
                else:
                    text = item.text
                    html_node_p_tag = self.output_html_node_format(page_no ,x, y, tag_class_id, tag_class_style, tag_style, text)
                    html_nodes_per_page.append(html_node_p_tag)
        return html_nodes_per_page

    def left_top_position(self, json_attr_style_data):
        x = re.sub(r'[a-z]', "", json_attr_style_data['left'])
        y = re.sub(r'[a-z]', "", json_attr_style_data['top'])
        return x, y

    def page_no_of_file(self, data):
        page_no_id = data.attr['id']
        page_no = re.findall(r'[0-9]', page_no_id)
        return page_no[0]

    def output_html_node_format(self,page_no, x, y, class_id, class_style, style, p_tag_text):
        html_node = {
            "page_no" : page_no,
            "x" : x,
            "y" : y,
            "class" : class_id,
            "class_style" : class_style,
            "style" : style,
            "text" : p_tag_text
            #"is_bold" : bold_nature
        }
        return html_node

    def extracting_values_of_class_styles(self ,tag_class, class_styles):
        for item in class_styles:
            if tag_class == item['class']: 
                tag_class_id = item['class'] 
                tag_class_style = item['class_style']
                return tag_class_id, tag_class_style