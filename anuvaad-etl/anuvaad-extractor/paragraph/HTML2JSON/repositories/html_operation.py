from html_2_json.html2json import Element
import os
import re
import time
import logging
import config

log = logging.getLogger('file')

class HTMLOperation(object):

    def __init__(self):
        pass

    def html_to_json(self, input_html_filepath):
        try:
            html_files = self.segregate_png_html(input_html_filepath)
            sorted_html_files = self.sorting_html_list(html_files, "html")
            response_htmlTOjson = list()
            for item in sorted_html_files:
                html_filepath = os.path.join(input_html_filepath,item)
                with open(html_filepath,'r', encoding='utf-8') as f:
                    data = f.read()
                    data_wo_br_tag = data.replace("<br/>", "")
                    element = Element("<html>")
                    json_data = element.parse(data_wo_br_tag)
                    data_html_nodes = self.making_html_nodes(json_data)
                    response_htmlTOjson.append({"html_nodes" : data_html_nodes})
                    log.info("--------page done----------")
            log.info("html to json completed")
            return response_htmlTOjson     
        except Exception as e:
            log.error("Error occured while converting html to json: %s"%e)

    def segregate_png_html(self, input_dir_html):
        html_items = list()
        for item in os.listdir(input_dir_html):
            html_items.append(item)
        return html_items

    def sorting_html_list(self, list_data, data_tag):
        iteration_no = len(list_data)
        output_list = list()
        if data_tag == "html":
            for i in range(iteration_no - 2):
                i+=1
                filename = data_tag + '-' + str(i) + '.' + data_tag
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
                    bold_nature = self.find_bold_nature(item_child[0])
                    html_node_p_tag = self.output_html_node_format(page_no, x, y, tag_class_id, tag_class_style, tag_style, text, bold_nature)
                    html_nodes_per_page.append(html_node_p_tag)
                else:
                    text = item.text
                    bold_nature = self.find_bold_nature(item)
                    html_node_p_tag = self.output_html_node_format(page_no ,x, y, tag_class_id, tag_class_style, tag_style, text, bold_nature)
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

    def output_html_node_format(self,page_no, x, y, class_id, class_style, style, p_tag_text, bold_nature):
        html_node = {
            "page_no" : page_no,
            "x" : x,
            "y" : y,
            "class" : class_id,
            "class_style" : class_style,
            "style" : style,
            "text" : p_tag_text,
            "is_bold" : bold_nature
        }
        return html_node

    def find_bold_nature(self, item_attr_child):
        if item_attr_child.tag == 'b':
           bold_nature = True
        else:
            bold_nature = False
        return bold_nature

    def extracting_values_of_class_styles(self ,tag_class, class_styles):
        for item in class_styles:
            if tag_class == item['class']: 
                tag_class_id = item['class'] 
                tag_class_style = item['class_style']
                return tag_class_id, tag_class_style
