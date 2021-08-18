import os
import copy

from anuvaad_auditor import log_info
import config

from services.service import common_obj
from bs4 import BeautifulSoup
from bs4.element import Tag
from  bs4.element import Script, Stylesheet, TemplateString, Comment
from bs4 import NavigableString


class HTMLTransform(object):
    def __init__(self, input_filename, json_data):
        self.json_data = json_data
        self.file_name_without_ext = os.path.splitext(input_filename)[0]
        self.file_id = self.file_name_without_ext

        # Json Structure
        self.outer_struct = common_obj.outer_struct
        self.page_struct = common_obj.page_struct
        self.para_struct = common_obj.para_struct
        self.run_struct = common_obj.run_struct

        #HTML document object
        self.html_doc = None

        # json object
        self.base_json = copy.deepcopy(self.outer_struct)
        self.page_list = self.base_json['result']
    
    def get_id(self,tag_name,tag_index,child_tag_index=None,child_tag_name=None):
        block_id = self.file_id+'-'+tag_name+'-'+str(tag_index)
        if child_tag_index is not None:
            block_id = block_id+'-'+str(child_tag_index)
        if child_tag_name is not None:
            block_id = block_id+'-'+child_tag_name
        return block_id

    # reading content of html file and creating a BeautifulSoup obj
    def read_html_file(self, input_filename):
        log_info("read_html_file :: started the reading html file: %s" % input_filename, self.json_data)
        input_html_filepath = common_obj.input_path(input_filename)
        with open(input_html_filepath,'r',encoding="utf-8") as f:
            html = f.read()
        input_html = BeautifulSoup(html,"html.parser")
        self.html_doc = input_html
        return input_html
    
    def write_json_file(self, transformed_obj):
        out_file_name = config.HTML_FILE_PREFIX + self.file_name_without_ext + '.json'
        return common_obj.write_json_file(out_file_name=out_file_name, transformed_obj=transformed_obj)
    
    def get_contents_type(self,contents):
        unique_types = set()
        for idc, content in enumerate(contents):
            if isinstance(content, Script) or isinstance(content, Stylesheet) or isinstance(content, TemplateString) or isinstance(content, Comment):
                continue
            if isinstance(content, NavigableString) and str(content) != '\n':
                unique_types.add('STRING')
            elif isinstance(content, Tag):
                unique_types.add('TAG')

        if len(unique_types) > 1:
            return 'MIX'
        elif len(unique_types) == 1:
            if 'STRING' in unique_types:
                return 'STRING'
            elif 'TAG' in unique_types:
                return 'TAG'

        return 'BLANK'
    
    def get_children_tag_count(self,contents, count=0):
        for idc, content in enumerate(contents):
            if isinstance(content, Tag):
                count += 1
                count = self.get_children_tag_count(content.contents, count=count)
        return count
    
    def generate_json_structure(self, html_doc):
        children_tag_count = 0
        page_struct = copy.deepcopy(self.page_struct)
        page_struct["page_no"] = 1
        self.page_list.append(page_struct)
        for idt,tag in enumerate(html_doc.find_all(True)):
            if not tag.can_be_empty_element:
                para_struct = copy.deepcopy(self.para_struct)
                if children_tag_count > 0:
                    children_tag_count -= 1
                    continue
                content_type = self.get_contents_type(tag.contents)
                if content_type in ['MIX']:
                    children_tag_count += self.get_children_tag_count(tag.contents)
                    para_struct['text'] = tag.text
                    para_struct['block_id'] = self.get_id(tag.name,idt)
                    for i,c in enumerate(tag.contents):
                        run_struct = copy.deepcopy(self.run_struct)
                        if isinstance(c,Tag):
                            if c.text.strip() == "":
                                continue
                            run_struct['text'] = c.text
                            run_struct['attrib'] = c.attrs
                            run_struct['block_id'] = self.get_id(tag.name,idt,i,c.name)
                        else:
                            if c.strip() == "":
                                continue
                            run_struct['text'] = c
                            run_struct['block_id'] = self.get_id(tag.name,idt,i)
                        para_struct['children'].append(run_struct)
                elif content_type in ['STRING']:
                    para_struct['text'] = tag.text
                    para_struct['block_id'] = self.get_id(tag.name,idt)
                    for i,c in enumerate(tag.contents):
                        if c.strip() == "":
                            continue
                        run_struct = copy.deepcopy(self.run_struct)
                        run_struct['text'] = c
                        run_struct['block_id'] = self.get_id(tag.name,idt,i)
                        para_struct['children'].append(run_struct)
                if para_struct != self.para_struct:
                    self.page_list[0]['text_blocks'].append(para_struct)
        log_info(f'Generated JSON FILE for file: {self.file_name_without_ext}', self.json_data)
        return self.base_json

