import copy
import json
import os
import re
import uuid

import requests
from anuvaad_auditor import log_info
from docx import Document
from docx.oxml.table import CT_Tbl
from docx.oxml.text.paragraph import CT_P
from pptx import Presentation
from pydocx import PyDocX

import config
from errors.errors_exception import FileErrors, FormatError
from utilities.utils import FileOperation

file_ops = FileOperation()


class Common(object):
    def __init__(self):
        self.outer_struct = {
            "result": [],
            "file_locale": ""
        }
        self.page_struct = {
            "page_no": "",
            "page_width": "",
            "page_height": "",
            "lines": [],
            "tables": [],
            "images": [],
            "text_blocks": []
        }
        self.para_struct = {
            "text_top": "",
            "text_left": "",
            "text_width": "",
            "text_height": "",
            "text": "",
            "font_color": "",
            "attrib": "",
            "font_family": "",
            "font_size": "",
            "children": [],
            "avg_line_height": "",
            "cell_index": "",
            "table_index": "",
            "block_id": ""
        }
        self.run_struct = {
            "text_top": "",
            "text_left": "",
            "text_width": "",
            "text_height": "",
            "text": "",
            "font_color": "",
            "attrib": "",
            "font_family": "",
            "font_size": "",
            "children": "",
            "block_id": ""
        }

    # generating input filepath for input filename
    def input_path(self, input_filename):
        input_filepath = os.path.join('upload', input_filename)
        return input_filepath

    def is_only_line_breaks_n_tabs(self, text):
        return re.sub(r"((\n){0,}(\t){0,})", '', text) == ''

    def generate_id(self, file_id='', table='', cell='', row='', slide='', shape='', para='', run=''):
        idx = ''
        if file_id != '':
            idx += str(file_id)
        if table != '':
            idx += '_TABLE-' + str(table)
        if row != '':
            idx += '_ROW-' + str(row)
        if cell != '':
            idx += '_CELL-' + str(cell)
        if slide != '':
            idx += '_SLIDE-' + str(slide)
        if shape != '':
            idx += '_SHAPE-' + str(shape)
        if para != '':
            idx += '_PARA-' + str(para)
        if run != '':
            idx += '_RUN-' + str(run)

        return idx

    def get_para_text(self, iterable_obj):
        para_text = ''

        for ru in iterable_obj:
            if common_obj.is_only_line_breaks_n_tabs(ru.text):
                continue
            else:
                para_text += ru.text
        return para_text

    def get_runs(self, iterable_obj, para_obj=False, run_obj=False, run_lst=False):
        if len([i for i in [para_obj, run_obj, run_lst] if i]) > 1:
            raise Exception('::Get Runs:: more than one can not be True')
        if len([i for i in [para_obj, run_obj, run_lst] if not i]) == 0:
            raise Exception('::Get Runs:: All can not be False')
        if para_obj:
            return iterable_obj.runs
        if run_obj:
            return [iterable_obj]
        if run_lst:
            return iterable_obj

    def distribute_over_runs(self, iterable_obj, trans_para):
        start_run = True
        last_processed_run = None
        for idx, ru in enumerate(iterable_obj):
            if common_obj.is_only_line_breaks_n_tabs(ru.text):
                continue
            run_word_len = len([i for i in ru.text.split(' ') if i not in ['', ' ']])
            trans_para_word_len = len([i for i in trans_para.split(' ') if i not in ['', ' ']])

            if trans_para.strip() in ['', ' '] and len(ru.text) != 0:
                # When trans para is already blank but still there are runs having data in them
                ru.text = ''
            elif idx == len(iterable_obj) - 1 and start_run:  # If current run is both last and First run
                ru.text = trans_para
                start_run = False
                trans_para = ''
            elif idx == len(iterable_obj) - 1 and not start_run:  # If current run is the last run
                ru.text = ' ' + trans_para
                trans_para = ''
            elif run_word_len >= trans_para_word_len:  # When run has more no of words than the trans para
                # in that case the whole translated para will go in to the current run
                if not start_run and not trans_para.startswith(' '):
                    ru.text = ' ' + trans_para
                else:
                    ru.text = trans_para
                trans_para = ''
            elif start_run:  # If current run is the first run then it will be starting of the sentence
                # in that case there will be no space in the beginning
                ru.text = ' '.join(trans_para.split(' ', run_word_len)[0:run_word_len])
                start_run = False
                trans_para = trans_para.split(' ', run_word_len)[-1]
                last_processed_run = ru

            else:  # If current run is the not the starting of a sentence we are appending this sentence with another
                # sentence in that case there will be space in between those
                ru.text = ' ' + ' '.join(trans_para.split(' ', run_word_len)[0:run_word_len])
                trans_para = trans_para.split(' ', run_word_len)[-1]
                last_processed_run = ru

        # Trans para is not empty, In that case take the last_processed_run and put the remaining trans para in it
        # This is for the case where translated para has more word then all runs and last runs has \n or \t
        # because of which it got skipped
        if trans_para.strip() not in ['', ' '] and last_processed_run is not None:
            if not start_run and not trans_para.startswith(' '):
                last_processed_run.text = ' ' + trans_para
            else:
                last_processed_run.text = trans_para
            trans_para = ''

    def write_json_file(self, out_file_name, transformed_obj):
        out_json_filepath = self.input_path(out_file_name)
        file_write = open(out_json_filepath, 'w')
        json.dump(transformed_obj, file_write, indent=6)
        return out_file_name

    def word_count(self, text):
        if text:
            return len(text.split(' '))
        return 0

    def is_page_size_exceeded(self, DOCX=False, PPTX=False, para_count=0, run_count=0, word_count=0):
        if DOCX:
            if config.DOCX_PAGE_LIMIT_ENABLE:
                if config.PARA_WISE_PAGE_LIMIT:
                    if config.MAX_PARA_IN_A_PAGE <= para_count:
                        return True

                elif config.RUN_WISE_PAGE_LIMIT:
                    if config.MAX_RUN_IN_A_PAGE <= run_count:
                        return True

                elif config.WORD_WISE_PAGE_LIMIT:
                    if config.MAX_WORD_IN_A_PAGE <= word_count:
                        return True
        if PPTX:
            if config.PPTX_PAGE_LIMIT_ENABLE:
                if config.PARA_WISE_PAGE_LIMIT:
                    if config.MAX_PARA_IN_A_PAGE <= para_count:
                        return True

                elif config.RUN_WISE_PAGE_LIMIT:
                    if config.MAX_RUN_IN_A_PAGE <= run_count:
                        return True

                elif config.WORD_WISE_PAGE_LIMIT:
                    if config.MAX_WORD_IN_A_PAGE <= word_count:
                        return True

    def reset_page_limit(self, para_count=0, run_count=0, word_count=0):
        if config.PARA_WISE_PAGE_LIMIT:
            para_count = 0

        elif config.RUN_WISE_PAGE_LIMIT:
            run_count = 0

        elif config.WORD_WISE_PAGE_LIMIT:
            word_count = 0
        return para_count, run_count, word_count


common_obj = Common()


class DocxTransform(object):
    def __init__(self, input_filename):
        self.file_name_without_ext = os.path.splitext(input_filename)[0]

        self.outer_struct = common_obj.outer_struct
        self.page_struct = common_obj.page_struct
        self.para_struct = common_obj.para_struct
        self.run_struct = common_obj.run_struct

    # reading content of docx file
    def read_docx_file(self, input_filename):
        log_info("read_docx_file :: started the reading docx file: %s" % input_filename, None)
        input_docx_filepath = common_obj.input_path(input_filename)
        input_docx = Document(input_docx_filepath)
        return input_docx

    def write_json_file(self, transformed_obj):
        out_file_name = config.DOCX_FILE_PREFIX + self.file_name_without_ext + '.json'
        return common_obj.write_json_file(out_file_name=out_file_name, transformed_obj=transformed_obj)

    def distribute_over_runs(self, iterable_obj, trans_para):
        common_obj.distribute_over_runs(iterable_obj=iterable_obj, trans_para=trans_para)

    def generate_json_for_run(self, run, file_id='', table='', cell='', row='', para_idx='', run_idx=''):
        new_run_template = copy.deepcopy(self.run_struct)
        new_run_template['text'] = run.text
        new_run_template['block_id'] = common_obj.generate_id(file_id=file_id, table=table, cell=cell, row=row,
                                                              para=para_idx, run=run_idx)
        return new_run_template

    '''generate_json_for_para accept para object and using that it tries to create a json structure'''

    def generate_json_for_para(self, para, file_id='', table='', cell='', row='', para_idx=''):
        new_para_template = copy.deepcopy(self.para_struct)
        runs = common_obj.get_runs(para, para_obj=True)
        new_para_template['text'] = common_obj.get_para_text(runs)
        new_para_template['block_id'] = common_obj.generate_id(file_id=file_id, table=table, cell=cell, row=row,
                                                               para=para_idx)
        return new_para_template

    def generate_json_for_page(self, page_number):
        new_page_template = copy.deepcopy(self.page_struct)
        new_page_template['page_no'] = page_number
        return new_page_template

    def generate_json_structure(self, document):
        base_json = copy.deepcopy(self.outer_struct)

        page_list = base_json['result']
        file_id = self.file_name_without_ext

        para_count = 0  # Total no of Para indivisual and in table combined for page limit
        run_count = 0  # Total number of runs indivisual and in table combined for page limit
        word_count = 0  # Total number of words for page limit
        page_number = 1

        sequence_para_index = 0  # Sequence wise total number of para iterated
        sequence_table_index = 0  # Sequence wise total number of table iterated

        page_list.append(self.generate_json_for_page(page_number))

        # START# NEW LOGIC TO ITERATE FILE SEQUENCIALLY
        for ide, child in enumerate(document.element.body):
            if common_obj.is_page_size_exceeded(DOCX=True, para_count=para_count, run_count=run_count,
                                                word_count=word_count):
                para_count, run_count, word_count = common_obj.reset_page_limit(para_count=para_count,
                                                                                run_count=run_count,
                                                                                word_count=word_count)
                page_number += 1
                log_info(
                    "generate_json_structure :: Page limit exceeded generating new page obj, new page index: %s" % page_number,
                    None)
                page_list.append(self.generate_json_for_page(page_number))

            if config.DOCX_PARAGRAPH_GEN and isinstance(child, CT_P):
                if len(document.paragraphs) <= sequence_para_index:
                    raise FileErrors("DOCX_PARAGRAPH_DATA_GEN_ERROR", "Paragraph Data mismatched in the Docx")

                para_count += 1

                para = document.paragraphs[sequence_para_index]
                json_para = self.generate_json_for_para(para=para, file_id=file_id,
                                                        para_idx=str(sequence_para_index))

                words_no = common_obj.word_count(json_para.get('text'))
                word_count += words_no

                for idr, run in enumerate(para.runs):
                    run_count += 1
                    json_run = self.generate_json_for_run(run=run, file_id=file_id,
                                                          para_idx=str(sequence_para_index),
                                                          run_idx=str(idr))
                    json_para['children'].append(json_run)

                page_list[page_number - 1]['text_blocks'].append(json_para)
                sequence_para_index += 1

            elif config.DOCX_TABLE_DATA_GEN and isinstance(child, CT_Tbl):
                if len(document.tables) <= sequence_table_index:
                    raise FileErrors("DOCX_TABLE_DATA_GEN_ERROR", "Table Data mismatched in the Docx")

                table = document.tables[sequence_table_index]
                idt = sequence_table_index
                for idr, row in enumerate(table.rows):
                    for idc, cell in enumerate(row.cells):
                        for idp, para in enumerate(cell.paragraphs):
                            para_count += 1
                            json_para = self.generate_json_for_para(para=para, file_id=file_id,
                                                                    table=str(idt),
                                                                    cell=str(idc),
                                                                    row=str(idr),
                                                                    para_idx=str(idp))

                            words_no = common_obj.word_count(json_para.get('text'))
                            word_count += words_no

                            for id_run, run in enumerate(para.runs):
                                run_count += 1
                                json_run = self.generate_json_for_run(run=run, file_id=file_id,
                                                                      table=str(idt),
                                                                      cell=str(idc),
                                                                      row=str(idr),
                                                                      para_idx=str(idp),
                                                                      run_idx=str(id_run))
                                json_para['children'].append(json_run)

                            page_list[page_number - 1]['text_blocks'].append(json_para)

                sequence_table_index += 1
        return base_json
        # END# NEW LOGIC TO ITERATE FILE SEQUENCIALLY

        # if config.DOCX_PARAGRAPH_GEN:
        #     for idx, para in enumerate(document.paragraphs):
        #         para_count += 1
        #         json_para = self.generate_json_for_para(para=para, file_id=file_id,
        #                                                 para_idx=str(idx))
        #
        #         for idr, run in enumerate(para.runs):
        #             json_run = self.generate_json_for_run(run=run, file_id=file_id,
        #                                                   para_idx=str(idx),
        #                                                   run_idx=str(idr))
        #             json_para['children'].append(json_run)
        #
        #         page_list[0]['text_blocks'].append(json_para)
        #
        # if config.DOCX_TABLE_DATA_GEN:
        #     for idt, table in enumerate(document.tables):
        #         for idr, row in enumerate(table.rows):
        #             for idc, cell in enumerate(set(row.cells)):
        #                 for idp, para in enumerate(cell.paragraphs):
        #                     json_para = self.generate_json_for_para(para=para, file_id=file_id,
        #                                                             table=str(idt),
        #                                                             cell=str(idc),
        #                                                             row=str(idr),
        #                                                             para_idx=str(idp))
        #
        #                     for id_run, run in enumerate(para.runs):
        #                         json_run = self.generate_json_for_run(run=run, file_id=file_id,
        #                                                               table=str(idt),
        #                                                               cell=str(idc),
        #                                                               row=str(idr),
        #                                                               para_idx=str(idp),
        #                                                               run_idx=str(id_run))
        #                         json_para['children'].append(json_run)
        #
        #                     page_list[0]['text_blocks'].append(json_para)
        #
        # return base_json

    def translate_docx_file(self, document, trans_map):  # TODO
        file_id = self.file_name_without_ext
        log_info("translate_docx_file :: Translation Docx Process started.", None)

        if config.DOCX_PARAGRAPH_GEN and config.DOCX_PARAGRAPH_TRANS:
            for idx, para in enumerate(document.paragraphs):
                runs = common_obj.get_runs(para, para_obj=True)
                para_id = common_obj.generate_id(file_id=file_id,
                                                 para=str(idx))
                if para_id in trans_map:
                    self.distribute_over_runs(runs, trans_para=trans_map[para_id])
                else:
                    raise FileErrors("translate_docx_file:", "PARA ID :{} not found in fetch content".format(para_id))
        if config.DOCX_TABLE_DATA_GEN and config.DOCX_TABLE_DATA_TRANS:
            for idt, table in enumerate(document.tables):
                for idr, row in enumerate(table.rows):
                    for idc, cell in enumerate(row.cells):
                        for idp, para in enumerate(cell.paragraphs):
                            runs = common_obj.get_runs(para, para_obj=True)
                            para_id = common_obj.generate_id(file_id=file_id,
                                                             table=str(idt),
                                                             row=str(idr),
                                                             cell=str(idc),
                                                             para=str(idp))
                            if para_id in trans_map:
                                self.distribute_over_runs(runs, trans_para=trans_map[para_id])
                            else:
                                raise FileErrors("translate_docx_file:",
                                                 "PARA ID :{} not found in fetch content".format(para_id))
        return document

    def write_docx_file(self, document):
        file_name = str(uuid.uuid4()) + '.docx'
        file_out_path = common_obj.input_path(file_name)
        document.save(file_out_path)
        return file_name


class FetchContent(object):
    def __init__(self, record_id):
        self.record_id = record_id
        self.block_trans_map = dict()

    def map_translated_text_with_blockid(self, page):
        for idx, text_block in enumerate(page['text_blocks']):
            trans_para = ''
            for id_ts, tokenized_sentence in enumerate(text_block['tokenized_sentences']):
                trans_para += tokenized_sentence['tgt']

            text_block['trans_text'] = trans_para
            block_id = text_block['block_id']
            self.block_trans_map[block_id] = trans_para

    def generate_url(self, record_id, start_page, end_page):
        url = config.FC_URL
        return url + '?record_id=' + record_id + '&start_page=' + str(start_page) + '&end_page=' + str(end_page)

    def fetch_content(self, record_id, start_page=0, end_page=0):
        log_info("fetch_content :: started fetching content for recordId: %s" % record_id, None)
        fetch_url = self.generate_url(record_id=record_id, start_page=start_page, end_page=end_page)

        # START:: TO TEST LOCALLY
        # HEADERS = {'auth-token': 'AUTH'}
        # rspn = requests.get(url=fetch_url, headers=HEADERS)
        # END :: TO TEST LOCALLY
        log_info('Fetch URL: %s' % fetch_url, None)

        rspn = requests.get(url=fetch_url)

        log_info("fetch_content :: received response for recordId: %s" % record_id, None)

        if rspn.status_code not in [200]:
            log_info('Response:: %s' % rspn.text, None)
            raise FormatError(400, "Fetch Content failed for recordId: %s" % record_id)

        return rspn.json()

    def generate_map_from_fetch_content_response(self):
        response = self.fetch_content(record_id=self.record_id)
        for page in response['data']:
            self.map_translated_text_with_blockid(page)
        log_info("generate_map_from_fetch_content_response :: Generated Map from fetch content.", None)


class PptxTransform(object):
    def __init__(self, input_filename):
        self.file_name_without_ext = os.path.splitext(input_filename)[0]

        self.outer_struct = common_obj.outer_struct
        self.page_struct = common_obj.page_struct
        self.para_struct = common_obj.para_struct
        self.run_struct = common_obj.run_struct

    # reading content of pptx file
    def read_pptx_file(self, input_filename):
        input_pptx_filepath = common_obj.input_path(input_filename)
        input_pptx = Presentation(input_pptx_filepath)
        return input_pptx

    def generate_json_for_page(self, page_number):
        new_page_template = copy.deepcopy(self.page_struct)
        new_page_template['page_no'] = page_number
        return new_page_template

    '''generate_json_for_para accept para object and using that it tries to create a json structure'''

    def generate_json_for_para(self, para, file_id='', table='', cell='', row='', slide='', shape='', para_idx=''):
        new_para_template = copy.deepcopy(self.para_struct)
        runs = common_obj.get_runs(para, para_obj=True)
        new_para_template['text'] = common_obj.get_para_text(runs)
        new_para_template['block_id'] = common_obj.generate_id(file_id=file_id, table=table, cell=cell, row=row,
                                                               slide=slide, shape=shape, para=para_idx)
        return new_para_template

    def generate_json_for_run(self, run, file_id='', table='', cell='', row='', slide='', shape='', para_idx='',
                              run_idx=''):
        new_run_template = copy.deepcopy(self.run_struct)
        new_run_template['text'] = run.text
        new_run_template['block_id'] = common_obj.generate_id(file_id=file_id, table=table, cell=cell, row=row,
                                                              slide=slide, shape=shape, para=para_idx, run=run_idx)
        return new_run_template

    def generate_json_structure(self, document):
        base_json = copy.deepcopy(self.outer_struct)

        page_list = base_json['result']
        file_id = self.file_name_without_ext

        para_count = 0
        page_number = 1

        page_list.append(self.generate_json_for_page(page_number))

        if config.PPTX_PARAGRAPH_GEN:
            for id_sld, slide in enumerate(document.slides):
                for id_shp, shape in enumerate(slide.shapes):
                    if not shape.has_text_frame:
                        continue
                    for idx, para in enumerate(shape.text_frame.paragraphs):
                        para_count += 1
                        json_para = self.generate_json_for_para(para=para,
                                                                file_id=file_id,
                                                                slide=str(id_sld),
                                                                shape=str(id_shp),
                                                                para_idx=str(idx))

                        for idr, run in enumerate(para.runs):
                            json_run = self.generate_json_for_run(run=run,
                                                                  file_id=file_id,
                                                                  slide=str(id_sld),
                                                                  shape=str(id_shp),
                                                                  para_idx=str(idx),
                                                                  run_idx=str(idr))
                            json_para['children'].append(json_run)

                        page_list[0]['text_blocks'].append(json_para)

        return base_json

    def write_json_file(self, transformed_obj):
        out_file_name = config.PPTX_FILE_PREFIX + self.file_name_without_ext + '.json'
        return common_obj.write_json_file(out_file_name=out_file_name, transformed_obj=transformed_obj)

    def distribute_over_runs(self, iterable_obj, trans_para):
        common_obj.distribute_over_runs(iterable_obj=iterable_obj, trans_para=trans_para)

    def translate_pptx_file(self, document, trans_map):
        file_id = self.file_name_without_ext

        if config.PPTX_PARAGRAPH_GEN and config.PPTX_PARAGRAPH_TRANS:
            for id_sld, slide in enumerate(document.slides):
                for id_shp, shape in enumerate(slide.shapes):
                    if not shape.has_text_frame:
                        continue
                    for idx, para in enumerate(shape.text_frame.paragraphs):
                        runs = common_obj.get_runs(para, para_obj=True)
                        para_id = common_obj.generate_id(file_id=file_id,
                                                         slide=str(id_sld),
                                                         shape=str(id_shp),
                                                         para=str(idx))
                        if para_id in trans_map:
                            self.distribute_over_runs(runs, trans_para=trans_map[para_id])
                        else:
                            raise FileErrors("translate_docx_file:",
                                             "PARA ID :{} not found in fetch content".format(para_id))
        return document

    def write_pptx_file(self, document):
        file_name = str(uuid.uuid4()) + '.pptx'
        file_out_path = common_obj.input_path(file_name)
        document.save(file_out_path)
        return file_name


class HtmlConvert(object):
    def __init__(self, input_filename):
        self.file_name_without_ext = os.path.splitext(input_filename)[0]

    def generate_html(self, input_filename):
        input_docx_filepath = common_obj.input_path(input_filename)
        output_html_filepath = common_obj.input_path(self.file_name_without_ext + '.html')
        with open(input_docx_filepath, "rb") as docx_file:
            html = PyDocX.to_html(docx_file)
            f = open(output_html_filepath, "w")
            f.write(html)
            f.close()
        return output_html_filepath
