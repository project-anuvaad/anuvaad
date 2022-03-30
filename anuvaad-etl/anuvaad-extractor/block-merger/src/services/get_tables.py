import pandas as pd
from src.utilities.table.table import TableRepositories
from src.utilities.table.line import RectRepositories
from src.services.preprocess import mask_image
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
#import os
from collections import Counter
#from pathlib import Path
import cv2
import base64
from src.services.ocr_text_utilities import tesseract_ocr
from src.services import get_xml
import src.utilities.app_context as app_context


def page_num_correction(file_index, num_size=None):
    padding = '0'
    max_length = num_size
    corrction_factor = max_length - len(str(file_index + 1))
    return padding * corrction_factor + str(file_index + 1)


def change_keys(table):
    table_row = {}
    table_row['text_top'] = table['y']
    table_row['text_left'] = table['x']
    table_row['text_width'] = table['w']
    table_row['text_height'] = table['h']
    return table_row


def most_frequent(List):
    try:
        occurence_count = Counter(List)
    except:
        pass
    return occurence_count.most_common(1)[0][0]


def get_line_df(lines):
    line_df = []
    if len(lines) > 0:
        for line in lines:
            line_row = change_keys(line)
            line_row['attrib'] = 'LINE'
            line_df.append(line_row)

    return pd.DataFrame(line_df)


def get_table_df(tables):
    table_df = []
    if len(tables) > 0:
        for table in tables:
            table_row = change_keys(table)
            table_row['attrib'] = 'TABLE'
            table_row['children'] = None
            table_row['text'] = None

            if len(table['rect']) > 0:
                table_row['children'] = []

                for cell in table['rect']:
                    child_row = change_keys(cell)
                    child_row['text_top'] = child_row['text_top'] + table_row['text_top']
                    child_row['text_left'] = child_row['text_left'] + table_row['text_left']
                    child_row['index'] = cell['index']
                    child_row['text'] = None
                    child_row['attrib'] = 'TABLE'
                    table_row['children'].append(child_row)

            table_df.append(table_row)

    table_df = pd.DataFrame(table_df)

    return table_df


def edit(dic, df, extract_by='mid_point'):
    left_key = 'text_left'
    top_key = 'text_top'
    width_key = 'text_width'
    height_key = 'text_height'

    if extract_by == 'Intersection':
        region = (df[left_key] >= dic[left_key]) & (df[top_key] >= dic[top_key]) & (
                (df[top_key] + df[height_key]) <= (dic[top_key] + dic[height_key])) & (
                         (df[left_key] + df[width_key]) <= (dic[left_key] + dic[width_key]))

    if extract_by == 'starting_point':
        region = (df[left_key] >= dic[left_key]) & (df[top_key] >= dic[top_key]) & (
                (df[top_key]) <= (dic[top_key] + dic[height_key])) & (
                         (df[left_key]) <= (dic[left_key] + dic[width_key]))


    if extract_by == 'mid_point':
        region = (  (df[left_key]+ df[width_key] *0.5 )    >= dic[left_key]) \
                 & ((df[top_key] + df[height_key] *0.5     )  >= dic[top_key]) \
                 & ((df[top_key]  + df[height_key] *0.5   ) <= (dic[top_key] + dic[height_key])) \
                 & ((df[left_key]+ df[width_key] *0.5) <= (dic[left_key] + dic[width_key]))



    text_df = df[region].to_dict('records')
    df = df[~region]
    return text_df, df


def extract_and_delete_region(page_df, table_df):
    if len(table_df) > 0:
        for index, row in table_df.iterrows():

            if row['children'] != None:
                for indx, cell in enumerate(row['children']):
                    text_df, page_df = edit(cell, page_df)
                    table_df['children'][index][indx]['text'] = text_df
            else:
                text_df, page_df = edit(row, page_df)
                table_df['text'] = text_df

    return page_df, table_df



# def get_text_from_table_cells(pdf_data, p_dfs,flags):

#     try :
#         table_dfs = pdf_data['table_dfs']

#         for page_index in range(len(p_dfs)):
#             table_cells = []
#             table_df = table_dfs[page_index]
#             if len(table_df) > 0:
#                 table_df = table_df.sort_values(by=['text_top'])
#                 for t_index, row in table_df.iterrows():
#                     cells = row['children']
#                     if cells != None:
#                         for cell in cells:

#                             cell['cell_index'] = cell['index']
#                             cell['table_index'] = t_index
#                             cell.pop('index')


#                             if cell['text'] != None:
#                                 text_df = pd.DataFrame(cell['text'])
#                                 if len(text_df) >1 :
#                                     h_dfs =  get_xml.get_hdfs([text_df], pd.DataFrame() , pd.DataFrame(),1,1,table=True)
#                                 else:
#                                      h_dfs = [text_df]
#                                 p_df_data ={}
#                                 p_df_data['pdf_image_paths'] = [pdf_data['pdf_image_paths'][page_index]]
#                                 p_df_data['page_width']  = pdf_data['page_width']
#                                 p_df_data['page_height'] = pdf_data['page_height']
#                                 p_df_data['h_dfs'] = h_dfs
#                                 p_df_data['lang'] = pdf_data['lang']

#                                 if (pdf_data['lang'] != 'en') or (flags['doc_class'] != 'class_1'):
#                                     text_df = tesseract_ocr( p_df_data, {'page_layout':'single_column'})[0]
#                                 else:
#                                     text_df = h_dfs[0]


#                                 text_df['children'] = None

#                                 cell['children'] = text_df.to_json()
#                                 if len(text_df) > 0:
#                                     add_keys = ['font_size', 'font_family', 'font_color', 'attrib', 'font_family_updated',
#                                                 'font_size_updated']
#                                     for add_key in add_keys:
#                                         # print(text_df)
#                                         cell[add_key] = most_frequent(text_df[add_key])

#                                     if (cell['attrib'] == None) or (cell['attrib'] == ''):
#                                         cell['attrib'] = 'TABLE'
#                                     else:
#                                         cell['attrib'] = str(cell['attrib']) + ',TABLE'
#                                     cell['text'] = ' '.join(pd.DataFrame(cell['text'])['text'].values)

#                                     table_cells.append(cell)

#                 t_cells_df = pd.DataFrame(table_cells)

#                 p_dfs[page_index] = pd.concat([p_dfs[page_index], t_cells_df])

#         return p_dfs
#     except Exception as e:
#         log_error('Error in getting text from table cells' + str(e), app_context.application_context, e)
#         return None





def get_text_from_table_cells(pdf_data, p_dfs,flags):

    try :
        table_dfs = pdf_data['table_dfs']

        for page_index in range(len(p_dfs)):
            table_cells = []
            table_df = table_dfs[page_index]
            if len(table_df) > 0:
                table_df = table_df.sort_values(by=['text_top'])
                for t_index, row in table_df.iterrows():
                    cells = row['children']
                    if cells != None:
                        for cell in cells:

                            cell['cell_index'] = cell['index']
                            cell['table_index'] = t_index
                            cell.pop('index')


                            if cell['text'] != None:
                                text_df = pd.DataFrame(cell['text'])
                                if len(text_df) >1 :
                                    h_dfs =  get_xml.get_hdfs([text_df], pd.DataFrame() , pd.DataFrame(),1,1,table=True)
                                else:
                                     h_dfs = [text_df]
                                p_df_data ={}
                                p_df_data['pdf_image_paths'] = [pdf_data['pdf_image_paths'][page_index]]
                                p_df_data['page_width']  = pdf_data['page_width']
                                p_df_data['page_height'] = pdf_data['page_height']
                                p_df_data['h_dfs'] = h_dfs
                                p_df_data['lang'] = pdf_data['lang']

                                if (pdf_data['lang'] != 'en') or (flags['doc_class'] != 'class_1'):
                                    text_df = tesseract_ocr( p_df_data, {'page_layout':'single_column'})[0]
                                else:
                                    text_df = h_dfs[0]


                                text_df['children'] = None

                                cell['children'] = text_df.to_json()
                                if len(text_df) > 0:
                                    add_keys = ['font_size', 'font_family', 'font_color', 'attrib', 'font_family_updated',
                                                'font_size_updated']
                                    for add_key in add_keys:
                                        # print(text_df)
                                        cell[add_key] = most_frequent(text_df[add_key])

                                    if (cell['attrib'] == None) or (cell['attrib'] == ''):
                                        cell['attrib'] = 'TABLE'
                                    else:
                                        cell['attrib'] = str(cell['attrib']) + ',TABLE'
                                    cell['text'] = ' '.join(pd.DataFrame(cell['text'])['text'].values)

                                else :
                                    cell['text'] = ''
                                    cell['children'] = None
                            else :
                                cell['text'] = ''
                                cell['children'] = None
                            table_cells.append(cell)

                t_cells_df = pd.DataFrame(table_cells)

                p_dfs[page_index] = pd.concat([p_dfs[page_index], t_cells_df])

        return p_dfs
    except Exception as e:
        log_error('Error in getting text from table cells' + str(e), app_context.application_context, e)
        return None,

def get_text_table_line_df(pdf_data,flags, check=False):
    xml_dfs = pdf_data['in_dfs']
    img_dfs= pdf_data['img_dfs']
    #if flags['doc_class'] == 'class_1':
    pdf_bg_img_filepaths = pdf_data['pdf_bg_img_filepaths']
    #else :
    #    pdf_bg_img_filepaths = pdf_data['pdf_image_paths']

    log_info("TableExtractor service started", app_context.application_context)

    in_dfs = []
    table_dfs = []
    line_dfs = []
    bg_dfs = []

    for index, _ in enumerate(xml_dfs):
        in_df = xml_dfs[index]
        img_df = img_dfs[index]
        bg_image_path = pdf_bg_img_filepaths[index]

        try:
            table_image = cv2.imread(bg_image_path, 0)
            bg_image = cv2.imread(bg_image_path)
            image_width, image_height = table_image.shape[1], table_image.shape[0]
            if check:
                cv2.imwrite('bg_org.png', table_image)

        except Exception as e:
            log_error("Service TableExtractor Error in loading background html image", app_context.application_context,
                      e)
            return None, None, None, None

        table_image = mask_image(table_image, img_df, image_width, image_height, app_context.application_context,
                                 margin=0, fill=255)
        if check:
            cv2.imwrite('bg_org_masked.png', table_image)
        try:
            tables = TableRepositories(table_image)

            if check:
                cv2.imwrite('tables_org.png', tables.slate)
        except  Exception as e:
            log_error("Service TableExtractor Error in finding tables", app_context.application_context, e)
            return None, None, None, None

        try:
            rects = RectRepositories(table_image)
            lines, _ = rects.get_tables_and_lines()

        except  Exception as e:
            log_error("Service TableExtractor Error in finding lines", app_context.application_context, e)
            return None, None, None, None

        line_df = get_line_df(lines)
        tables_df = get_table_df(tables.response['response']['tables'])
        filtered_in_df, table_df = extract_and_delete_region(in_df, tables_df)

        if flags['doc_class'] == 'class_1':
            pass
        else:
            bg_image  = mask_image(bg_image,in_df,image_width,image_height,app_context.application_context,margin=0,fill=255)

        # mask tables and lines from bg image
        # bg_image  = mask_image(bg_image,table_df,image_width,image_height,app_context.application_context,margin=0,fill=255)
        # bg_image = mask_image(bg_image, line_df,image_width,image_height, app_context.application_context, margin=0, fill=255)
        bg_binary = base64.b64encode(cv2.imencode('.png', bg_image)[1])  # base64.b64encode(bg_image)

        bg_df = pd.DataFrame([[0, 0, image_width, image_height, bg_binary, 'BGIMAGE']],
                             columns=['text_top', 'text_left', 'text_width', 'text_height', 'base64', 'attrib'])

        bg_dfs.append(bg_df)
        in_dfs.append(filtered_in_df)
        table_dfs.append(table_df)
        line_dfs.append(line_df)

    return in_dfs, table_dfs, line_dfs, bg_dfs

