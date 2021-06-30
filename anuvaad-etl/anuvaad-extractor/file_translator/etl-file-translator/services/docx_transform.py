import copy
import os
import uuid

from anuvaad_auditor import log_info

import config
from docx import Document
from docx.oxml import CT_P, CT_Tbl, CT_SDT
from docx.text.paragraph import Paragraph
from errors.errors_exception import FileErrors
from services.service import common_obj


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

    def generate_json_for_run(self, run, file_id='', table='', cell='', row='', sdt='', sdtc='', para_idx='',
                              run_idx=''):
        new_run_template = copy.deepcopy(self.run_struct)
        new_run_template['text'] = run.text
        new_run_template['block_id'] = common_obj.generate_id(file_id=file_id, table=table, cell=cell, row=row, sdt=sdt,
                                                              sdtc=sdtc, para=para_idx, run=run_idx)
        return new_run_template

    '''generate_json_for_para accept para object and using that it tries to create a json structure'''

    def generate_json_for_para(self, para, file_id='', table='', cell='', row='', para_idx='', sdt='', sdtc=''):
        new_para_template = copy.deepcopy(self.para_struct)
        runs = common_obj.get_runs(para, para_obj=True)
        new_para_template['text'] = common_obj.get_para_text(runs)
        new_para_template['block_id'] = common_obj.generate_id(file_id=file_id, table=table, cell=cell, row=row,
                                                               sdt=sdt, sdtc=sdtc, para=para_idx)
        return new_para_template

    def generate_para_struct_json_for_run(self, run, file_id='', table='', cell='', row='', sdt='', sdtc='',
                                          para_idx='', run_idx=''):
        new_para_template = copy.deepcopy(self.para_struct)
        new_para_template['text'] = run.text
        new_para_template['block_id'] = common_obj.generate_id(file_id=file_id, table=table, cell=cell, row=row,
                                                               sdt=sdt, sdtc=sdtc, para=para_idx, run=run_idx)
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
        sequence_sdt_index = 0

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
                try:
                    if len(document.paragraphs) <= sequence_para_index:
                        raise FileErrors("DOCX_PARAGRAPH_DATA_GEN_ERROR", "Paragraph Data mismatched in the Docx")

                    para_count += 1

                    para = document.paragraphs[sequence_para_index]
                    json_para = self.generate_json_for_para(para=para, file_id=file_id,
                                                            para_idx=str(sequence_para_index))

                    words_no = common_obj.word_count(json_para.get('text'))
                    word_count += words_no

                    for idr, run in enumerate(common_obj.get_runs(para, para_obj=True)):
                        run_count += 1
                        json_run = self.generate_json_for_run(run=run, file_id=file_id,
                                                              para_idx=str(sequence_para_index),
                                                              run_idx=str(idr))
                        json_para['children'].append(json_run)

                    page_list[page_number - 1]['text_blocks'].append(json_para)
                    sequence_para_index += 1
                except Exception as e:
                    log_info(f"generate_json_structure :: JSON CREATION FAILED FOR PARAGRAPH:{sequence_para_index}"
                             f"ERROR:{str(e)}", None)

            elif config.DOCX_TABLE_OF_CONTENT_GEN and isinstance(child, CT_SDT):
                try:
                    for sdtc, sdt_content in enumerate(child.sdtContent_lst):
                        for parax, para in enumerate(sdt_content.p_lst):
                            para = Paragraph(para, sdtc)

                            for idr, run in enumerate(common_obj.get_runs(para, para_obj=True)):
                                run_count += 1
                                json_run = self.generate_para_struct_json_for_run(run=run, file_id=file_id,
                                                                                  sdt=str(sequence_sdt_index),
                                                                                  sdtc=str(sdtc),
                                                                                  para_idx=str(parax),
                                                                                  run_idx=str(idr))
                                words_no = common_obj.word_count(json_run.get('text'))
                                word_count += words_no
                                json_run['children'].append(copy.deepcopy(json_run))
                                page_list[page_number - 1]['text_blocks'].append(json_run)

                    sequence_sdt_index += 1
                except Exception as e:
                    log_info(f"generate_json_structure :: JSON CREATION FAILED FOR SDT:{sequence_sdt_index}"
                             f"ERROR:{str(e)}", None)


            elif config.DOCX_TABLE_DATA_GEN and isinstance(child, CT_Tbl):
                try:
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

                                for id_run, run in enumerate(common_obj.get_runs(para, para_obj=True)):
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
                except Exception as e:
                    log_info(f"generate_json_structure :: JSON CREATION FAILED FOR TABLE:{sequence_table_index}"
                             f"ERROR:{str(e)}", None)
        log_info(f'Generated JSON FILE for file: {self.file_name_without_ext}', None)
        return base_json

    def translate_docx_file(self, document, trans_map):  # TODO
        file_id = self.file_name_without_ext
        log_info("translate_docx_file :: Translation Docx Process started.", None)

        if config.DOCX_PARAGRAPH_GEN and config.DOCX_PARAGRAPH_TRANS:
            for idx, para in enumerate(document.paragraphs):
                try:
                    runs = common_obj.get_runs(para, para_obj=True)
                    para_id = common_obj.generate_id(file_id=file_id, para=str(idx))
                    if para_id in trans_map:
                        self.distribute_over_runs(runs, trans_para=trans_map[para_id])
                    else:
                        raise FileErrors("translate_docx_file:", "PARA ID :{} not found in fetch content".format(para_id))
                except Exception as e:
                    log_info(f"translate_docx_file :: DISTRIBUTE OVER RUN FAILED FOR PARAGRAPH SEQ:{idx}"
                             f"ERROR: {str(e)}", None)

        if config.DOCX_TABLE_DATA_GEN and config.DOCX_TABLE_DATA_TRANS:
            for idt, table in enumerate(document.tables):
                try:
                    for idr, row in enumerate(table.rows):
                        try:
                            for idc, cell in enumerate(row.cells):
                                for idp, para in enumerate(cell.paragraphs):
                                    try:
                                        runs = common_obj.get_runs(para, para_obj=True)
                                        para_id = common_obj.generate_id(file_id=file_id,
                                                                         table=str(idt),
                                                                         row=str(idr),
                                                                         cell=str(idc),
                                                                         para=str(idp))
                                        if para_id in trans_map:
                                            self.distribute_over_runs(runs, trans_para=trans_map[para_id])
                                        else:
                                            raise FileErrors("translate_docx_file:", "PARA ID :{} not found in fetch content".format(para_id))
                                    except Exception as e:
                                        log_info(
                                            f"translate_docx_file :: DISTRIBUTE OVER RUN FAILED FOR TABLE SEQ:{idt}, row:{idr}, cell:{idc}, para:{idp} "
                                            f"ERROR: {str(e)}", None)
                        except Exception as e:
                            log_info(f"translate_docx_file :: DISTRIBUTE OVER RUN FAILED FOR TABLE SEQ:{idt}, row:{idr} "
                                     f"ERROR: {str(e)}", None)
                except Exception as e:
                    log_info(f"translate_docx_file :: DISTRIBUTE OVER RUN FAILED FOR TABLE SEQ:{idt}"
                             f"ERROR: {str(e)}", None)

        if config.DOCX_TABLE_OF_CONTENT_GEN and config.DOCX_TABLE_OF_CONTENT_TRANS:
            try:
                sequence_sdt_index = 0
                for ide, child in enumerate(document.element.body):
                    if isinstance(child, CT_SDT):
                        try:
                            for sdtc, sdt_content in enumerate(child.sdtContent_lst):
                                for parax, para in enumerate(sdt_content.p_lst):
                                    try:
                                        para = Paragraph(para, sdtc)
                                        for idr, run in enumerate(common_obj.get_runs(para, para_obj=True)):
                                            run_id = common_obj.generate_id(file_id=file_id,
                                                                            sdt=str(sequence_sdt_index),
                                                                            sdtc=str(sdtc),
                                                                            para=str(parax),
                                                                            run=str(idr))
                                            run = common_obj.get_runs(run, run_obj=run)
                                            if run_id in trans_map:
                                                self.distribute_over_runs(run, trans_para=trans_map[run_id])
                                            else:
                                                log_info(f"translate_docx_file: PARA ID :{para_id} not found in fetch content", None)
                                    except Exception as e:
                                        log_info(
                                            f"translate_docx_file :: DISTRIBUTE OVER RUN FAILED FOR TABLE SDT:{sequence_sdt_index}, sdtc:{sdtc}, para:{parax}"
                                            f"ERROR: {str(e)}", None)
                            sequence_sdt_index += 1
                        except Exception as e:
                            log_info(f"translate_docx_file :: DISTRIBUTE OVER RUN FAILED FOR SDT:{sequence_sdt_index}, child seq: {ide}, ERROR: {str(e)}", None)

            except Exception as e:
                log_info(f"translate_docx_file :: DISTRIBUTE OVER RUN FAILED FOR SDT:{sequence_sdt_index}, ERROR: {str(e)}", None)

        return document

    def write_docx_file(self, document):
        file_name = str(uuid.uuid4()) + '.docx'
        file_out_path = common_obj.input_path(file_name)
        document.save(file_out_path)
        return file_name

    def remove_table_of_content(self):
        pass
