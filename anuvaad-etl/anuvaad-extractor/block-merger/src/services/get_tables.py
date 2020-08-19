import  pandas as pd
import cv2
import numpy as np
import config
from src.utilities.table.table import TableRepositories
from src.utilities.table.line import  RectRepositories

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


def edit(dic, df, extract_by='starting_point'):
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


def get_text_table_line_df(table_image, in_df):
    if config.TABLE_CONFIGS['remove_background']:
        table_image = cv2.imread(table_image, 0)
        table_image = (table_image > config.TABLE_CONFIGS['background_threshold']).astype(np.uint8)
    tables = TableRepositories(table_image).response['response']['tables']
    Rects = RectRepositories(table_image)
    lines, _ = Rects.get_tables_and_lines()

    line_df = get_line_df(lines)
    tables_df = get_table_df(tables)
    filtered_in_df, table_df = extract_and_delete_region(in_df, tables_df)

    return filtered_in_df, table_df, line_df

