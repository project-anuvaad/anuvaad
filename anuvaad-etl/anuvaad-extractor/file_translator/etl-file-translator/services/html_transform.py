import os
import copy

from anuvaad_auditor import log_info
import config

from services.service import common_obj
from bs4 import BeautifulSoup
from bs4.element import Tag
from  bs4.element import Script, Stylesheet, TemplateString, Comment
from bs4 import NavigableString
import uuid


class HTMLTransform(object):
    def __init__(self, input_filename, json_data):
        self.json_data = json_data
        self.file_name_without_ext = os.path.splitext(input_filename)[0]
        self.file_id = self.file_name_without_ext

        self.para_counter = -1
        self.run_counter = -1

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
    
    def get_id(self,para_count,subpara_count=0,run_count=None):
        if run_count == None:
            block_id = self.file_id+'_PARA-'+str(para_count)+'_SUBPARA-'+str(subpara_count)
        else:
            block_id = self.file_id+'_PARA-'+str(para_count)+'_SUBPARA-'+str(subpara_count)+'_RUN-'+str(run_count)
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
    
    def generate_json_for_page(self, page_number):
        new_page_template = copy.deepcopy(self.page_struct)
        new_page_template['page_no'] = page_number
        return new_page_template
    
    def translate_html_file(self,html_doc,trans_map):
        trans_para_counter = -1
        children_tag_count = 0
        log_info("translate_html_file :: Translation Html process started.",self.json_data)
        for idt,tag in enumerate(html_doc.find_all(True)):
            if not tag.can_be_empty_element:
                if children_tag_count > 0:
                    children_tag_count -= 1
                    continue
                content_type = self.get_contents_type(tag.contents)
                if content_type in ['MIX']:
                    trans_para_counter += 1
                    children_tag_count += self.get_children_tag_count(tag.contents)
                    for i,c in enumerate(tag.contents):
                        block_id = self.get_id(trans_para_counter,i)
                        if isinstance(c,Tag):
                            if c.text.strip() == "":
                                continue
                        else:
                            if c.strip() == "":
                                continue
                        if trans_map.get(block_id) is not None:
                            c.string.replace_with(trans_map[block_id])
                elif content_type in ['STRING']:
                    trans_para_counter += 1
                    block_id = self.get_id(trans_para_counter)
                    if trans_map.get(block_id) is not None:
                        tag.string.replace_with(trans_map[block_id])
        return html_doc
    
    def write_html_file(self,html_doc):
        file_name = str(uuid.uuid4())+'.html'
        file_out_path = common_obj.input_path(file_name)
        with open(file_out_path,'w',encoding='utf-8') as f:
            f.write(html_doc.prettify())
        return file_name

    
    def generate_json_structure(self, html_doc):
        children_tag_count = 0
        para_count = 0
        run_count = 0
        word_count = 0
        page_number = 1
        self.page_list.append(self.generate_json_for_page(page_number))
        for idt,tag in enumerate(html_doc.find_all(True)):
            if common_obj.is_page_size_exceeded(HTML=True,para_count=para_count,run_count=run_count,word_count=word_count):
                para_count, run_count, word_count = common_obj.reset_page_limit(para_count=para_count,run_count=run_count,word_count=word_count)
                page_number += 1
                log_info(
                    "generate_json_structure :: Page limit exceeded generating new page obj, new page index: %s" % page_number,
                    None)
                self.page_list.append(self.generate_json_for_page(page_number))
            if not tag.can_be_empty_element:
                para_struct = copy.deepcopy(self.para_struct)
                if children_tag_count > 0:
                    children_tag_count -= 1
                    continue
                content_type = self.get_contents_type(tag.contents)
                if content_type in ['MIX']:
                    self.para_counter += 1
                    children_tag_count += self.get_children_tag_count(tag.contents)
                    for i,c in enumerate(tag.contents):
                        self.run_counter += 1
                        para_struct = copy.deepcopy(self.para_struct)
                        run_struct = copy.deepcopy(common_obj.run_struct)
                        para_struct['block_id'] = self.get_id(self.para_counter,i)
                        run_struct['block_id'] = self.get_id(self.para_counter,i,self.run_counter)
                        if isinstance(c,Tag):
                            if c.text.strip() == "":
                                continue
                            para_struct['text'] = c.text
                            word_count += common_obj.word_count(c.text)
                            run_struct['text'] = c.text
                        else:
                            if c.strip() == "":
                                continue
                            para_struct['text'] = c
                            word_count += common_obj.word_count(c)
                            run_struct['text'] = c
                        para_struct['children'].append(run_struct)
                        if para_struct != self.para_struct:
                            self.page_list[page_number - 1]['text_blocks'].append(para_struct)
                        self.run_counter = -1
                    
                elif content_type in ['STRING']:
                    self.para_counter += 1
                    para_struct['text'] = tag.text
                    word_count += common_obj.word_count(tag.text)
                    para_struct['block_id'] = self.get_id(self.para_counter)
                    for i,c in enumerate(tag.contents):
                        if c.strip() == "":
                            continue
                        self.run_counter += 1
                        run_struct = copy.deepcopy(self.run_struct)
                        run_struct['text'] = c
                        run_struct['block_id'] = self.get_id(self.para_counter,i,self.run_counter)
                        para_struct['children'].append(run_struct)
                    if para_struct != self.para_struct:
                        self.page_list[page_number - 1]['text_blocks'].append(para_struct)
                    self.run_counter = -1
        log_info(f'Generated JSON FILE for file: {self.file_name_without_ext}', self.json_data)
        return self.base_json

