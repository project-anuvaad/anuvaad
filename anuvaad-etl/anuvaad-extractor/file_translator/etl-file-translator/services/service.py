import json
import os
import re

from anuvaad_auditor import log_error

import config
from docx.oxml import CT_R, CT_HYPERLINK, CT_MATH, CT_DRAWING, CT_SMARTTAG
from docx.text.run import Run
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
        input_filepath = os.path.join(config.download_folder, input_filename)
        return input_filepath

    # generating out filepath
    def output_path(self, output_path):
        op_path = os.path.join(config.download_folder, output_path)
        return op_path

    def is_only_line_breaks_n_tabs(self, text):
        return re.sub(r"((\n){0,}(\t){0,})", '', text) == ''

    def generate_id(self, file_id='', table='', cell='', row='', slide='', shape='', sdt='', sdtc='', para='', sub_para='', run='', txbxContent=''):
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
        if sdt != '':
            idx += '_SDT-' + str(sdt)
        if sdtc != '':
            idx += '_SDTC-' + str(sdtc)
        if txbxContent != '':
            idx += '_TXBXCONTENT-' + str(txbxContent)
        if para != '':
            idx += '_PARA-' + str(para)
        if sub_para != '':
            idx += '_SUBPARA-' + str(sub_para)
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

    def get_inner_runs(self, iterable_obj):
        run_list = []
        inner_runs = iterable_obj.xpath('.//w:r')
        if inner_runs:
            for irun in inner_runs:
                run_obj = Run(irun, iterable_obj)
                run_list.append(run_obj)
        return run_list

    def get_runs(self, iterable_obj, para_obj=False, run_obj=False, run_lst=False, file_type=config.TYPE_DOCX):
        if len([i for i in [para_obj, run_obj, run_lst] if i]) > 1:
            raise Exception('::Get Runs:: more than one can not be True')
        if len([i for i in [para_obj, run_obj, run_lst] if not i]) == 0:
            raise Exception('::Get Runs:: All can not be False')
        if para_obj and file_type == config.TYPE_PPTX:
            return iterable_obj.runs
        if para_obj:
            runs = []
            temp_list = []
            for rid, child in enumerate(iterable_obj._element):
                if isinstance(child, CT_R):
                    run_obj = Run(child, iterable_obj)
                    temp_list.append(run_obj)
                elif isinstance(child, CT_MATH):
                    runs.append(temp_list)
                    temp_list = []
                elif isinstance(child, CT_DRAWING):
                    runs.append(temp_list)
                    temp_list = []
                elif isinstance(child, CT_HYPERLINK):
                    runs.append(temp_list)
                    temp_list = []
                    runs.append(self.get_inner_runs(child))
                elif isinstance(child, CT_SMARTTAG):
                    runs.append(temp_list)
                    temp_list = []
                    runs.append(self.get_inner_runs(child))
            runs.append(temp_list)
            parent_run_list = [x for x in runs if x]
            return parent_run_list
        if run_obj:
            return [iterable_obj]
        if run_lst:
            return iterable_obj

    def merge_runs(self, runs):
        merged_runs = []
        for run in runs:
            for r in run:
                merged_runs.append(r)
        return merged_runs

    def distribute_over_runs(self, iterable_obj, trans_para):
        start_run = True
        last_processed_run = None
        for idx, ru in enumerate(iterable_obj):
            if common_obj.is_only_line_breaks_n_tabs(ru.text):
                continue
            run_word_len = len([i for i in ru.text.split(' ') if i not in ['', ' ']])
            trans_para_word_len = len([i for i in trans_para.split(' ') if i not in ['', ' ']])

            if ru.text.startswith(" ") or ru.text.startswith(u'\xa0'):
                if trans_para.startswith("*_*") is False:
                    # When run text starts with a space and
                    # trans_para does not already have the inserted spl. characters
                    trans_para = '*_*' + trans_para
            if ru.text.endswith(" ") or ru.text.endswith(u'\xa0'):
                if trans_para.endswith("*_*") is False:
                    # When run text ends with a space and
                    # trans_para does not already have the inserted spl. characters
                    trans_para = trans_para + '*_*'
            if len(ru.text) >= 2:
                # if the length of run text >2 (it is not only a comma or full-stop) and the 2nd character is a space
                if ru.text[0] in [',','.'] and ru.text[1] == ' ':
                    if trans_para.startswith("*_*") is False:
                        trans_para = '*_*' + trans_para

            if (trans_para.strip() in ['', ' '] or trans_para.replace('*_*','') in ['', ' ']) and len(ru.text) != 0:
                # When trans para is already blank (or only *_*) but still there are runs having data in them
                ru.text = ''
                trans_para = ''
            elif idx == len(iterable_obj) - 1 and start_run:  # If current run is both last and First run
                ru.text = trans_para
                start_run = False
                trans_para = ''
            elif idx == len(iterable_obj) - 1 and not start_run:
                # If current run is the last run
                if not trans_para.startswith('*_*'):
                    ru.text = ' ' + trans_para
                else:
                    ru.text = trans_para
                trans_para = ''
            elif run_word_len >= trans_para_word_len:  # When run has more no of words than the trans para
                # in that case the whole translated para will go in to the current run
                if not start_run and not (trans_para.startswith(' ') or trans_para.startswith('*_*')):
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
                # spacing changes are based on whether trans_para contains leading special characters
                if trans_para.startswith("*_*") is False:
                    ru.text = ' ' + ' '.join(trans_para.split(' ', run_word_len)[0:run_word_len])
                else:
                    ru.text = '' + ' '.join(trans_para.split(' ', run_word_len)[0:run_word_len])
                trans_para = trans_para.split(' ', run_word_len)[-1]
                last_processed_run = ru
            ru.text = ru.text.replace('*_*', ' ')

        # Trans para is not empty, In that case take the last_processed_run and put the remaining trans para in it
        # This is for the case where translated para has more word then all runs and last runs has \n or \t
        # because of which it got skipped
        if (trans_para.strip() not in ['', ' '] or trans_para.replace('*_*','') not in ['', ' ']) and last_processed_run is not None:
            if not start_run and not trans_para.startswith(' '):
                last_processed_run.text = last_processed_run.text + ' ' + trans_para
                last_processed_run.text = last_processed_run.text.replace('*_*', ' ')
            else:
                last_processed_run.text = last_processed_run.text + trans_para
                last_processed_run.text = last_processed_run.text.replace('*_*', ' ')
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

    def is_page_size_exceeded(self, DOCX=False, PPTX=False, HTML=False, para_count=0, run_count=0, word_count=0):
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

                return False
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

                return False
        if HTML:
            if config.WORD_WISE_PAGE_LIMIT:
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

    def get_url_for_specific_file(self, urls, out_dir, file_name, extension, tool):
        file_pattern = os.path.join(out_dir, file_name)

        if tool == config.TOOL_PDF_TO_HTML:
            file_pattern = file_pattern + '-html.html'
        else:
            file_pattern = file_pattern + extension

        if not isinstance(urls, list):
            return None
        for url in urls:
            if file_pattern in url:
                return url

    def is_directory_empty(self, dir_path):
        try:
            if len(os.listdir(dir_path)) != 0:
                return False
            else:
                return True

        except Exception as e:
            log_error("is_directory_empty : Invalid dir_path passed... " + str(e), None, e)


common_obj = Common()
