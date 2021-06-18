import copy
import os

import uuid
from pptx import Presentation

import config
from errors.errors_exception import FileErrors
from services.service import common_obj


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

                        page_list[page_number-1]['text_blocks'].append(json_para)
                page_number += 1
                page_list.append(self.generate_json_for_page(page_number))

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