import json
import os
import re

import config
from docx.oxml import CT_R, CT_HYPERLINK
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

    def generate_id(self, file_id='', table='', cell='', row='', slide='', shape='', sdt='', sdtc='', para='', run=''):
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
            runs = []
            for rid, child in enumerate(iterable_obj._element):
                if isinstance(child, CT_R):
                    run_obj = Run(child, iterable_obj)
                    runs.append(run_obj)
                elif isinstance(child, CT_HYPERLINK):
                    for hlrid, hl_run in enumerate(child.r_lst):
                        if isinstance(hl_run, CT_R):
                            run_obj = Run(hl_run, iterable_obj)
                            runs.append(run_obj)

            return runs
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