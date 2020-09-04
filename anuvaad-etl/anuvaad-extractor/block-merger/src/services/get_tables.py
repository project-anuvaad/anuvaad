import  pandas as pd
from src.utilities.table.table import TableRepositories
from src.utilities.table.line import  RectRepositories
from src.services.preprocess import mask_image
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
import os
from pathlib import Path
import cv2
import base64

def page_num_correction(file_index, num_size=None):
    padding = '0'
    max_length = num_size
    corrction_factor = max_length - len(str(file_index + 1))
    return padding * corrction_factor + str(file_index + 1)


def change_keys(table):
    table_row = {}
    table_row['text_top']    = table['y']
    table_row['text_left']   = table['x']
    table_row['text_width']  = table['w']
    table_row['text_height'] = table['h']
    return table_row


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


def edit(dic, df,extract_by = 'starting_point'):
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


def get_text_table_line_df(pages,working_dir, xml_dfs,img_dfs,job_id):

    #log_info("Service TableExtractor", "TableExtractor service started", None)
    
    in_dfs    = []
    table_dfs = []
    line_dfs  = []
    bg_dfs     = []
    for page_index in range(pages):
        in_df  = xml_dfs[page_index]
        img_df = img_dfs[page_index]
        bg_image_path = os.path.join(working_dir, (page_num_correction(page_index , 3) + '.png'))
        try :
            table_image =  cv2.imread(bg_image_path, 0)
            bg_image    =  cv2.imread(bg_image_path)
            
        except Exception as e :
            log_error("Service TableExtractor", "Error in loading background html image", job_id, e)

        table_image = mask_image(table_image,img_df,job_id,margin=2,fill=255)

        try :
            tables = TableRepositories(table_image).response['response']['tables']
        except  Exception as e :
            log_error("Service TableExtractor", "Error in finding tables", job_id, e)
        
        try :
            Rects = RectRepositories(table_image)
            lines, _ = Rects.get_tables_and_lines()
            
        except  Exception as e :
            log_error("Service TableExtractor", "Error in finding lines", job_id, e)
        

        
        line_df = get_line_df(lines)
        tables_df = get_table_df(tables)
        filtered_in_df, table_df = extract_and_delete_region(in_df, tables_df)

        #mask tables and lines from bg image
        bg_image  = mask_image(bg_image,table_df,job_id,margin=2,fill=255)
        bg_image = mask_image(bg_image, line_df, job_id, margin=2, fill=255)
        h,w =   bg_image.shape[0] , bg_image.shape[1]
        bg_binary = base64.b64encode(cv2.imencode('.png', bg_image)[1])#base64.b64encode(bg_image)


        bg_df = pd.DataFrame([[0, 0, w, h, bg_binary,'IMAGE']],
                          columns=['text_top', 'text_left', 'text_width', 'text_height', 'base64', 'attrib'])

        bg_dfs.append(bg_df)
        in_dfs.append(filtered_in_df)
        table_dfs.append(table_df)
        line_dfs.append(line_df)

    return in_dfs, table_dfs, line_dfs , bg_dfs

