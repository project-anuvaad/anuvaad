import pandas as pd
from src.utilities.table.table import TableRepositories
from src.utilities.table.line import RectRepositories
from src.services.preprocess import mask_image
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
from collections import Counter
import cv2
import src.utilities.app_context as app_context


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



def get_text_from_table_cells(table_dfs, p_dfs):
    for page_index in range(len(p_dfs)):
        table_cells = []
        table_df = table_dfs[page_index]
        if len(table_df) > 0:
            for t_index, row in table_df.iterrows():
                cells = row['children']
                if cells != None:
                    for cell in cells:
                        cell.pop('index')
                        if cell['text'] != None:
                            text_df = pd.DataFrame(cell['text'])
                            text_df['children'] = None

                            cell['children'] = text_df.to_json()
                            if len(text_df) > 0:
                                add_keys = ['font_size', 'font_family', 'font_color', 'attrib', 'font_family_updated',
                                            'font_size_updated']
                                for add_key in add_keys:
                                    #print(text_df)
                                    cell[add_key] = most_frequent(text_df[add_key])
                                cell['text'] = ' '.join(pd.DataFrame(cell['text'])['text'].values)
                                table_cells.append(cell)

            t_cells_df = pd.DataFrame(table_cells)

            p_dfs[page_index] = pd.concat([p_dfs[page_index], t_cells_df])

    return p_dfs



def mask_tables(page_imge,check=False):


    try:
        table_image = cv2.imread(page_imge, 0)
        image_width, image_height = table_image.shape[1], table_image.shape[0]
        if check:
            cv2.imwrite('bg_org.png', table_image)
    except Exception as e:
        log_error("Service TableExtractor Error in loading background html image", app_context.application_context,
                  e)
        return None, None


    # To do recognize and mask images berfor finding tables
    #table_image = mask_image(table_image, img_df, image_width, image_height, app_context.application_context,
    #                         margin=0, fill=255)
    if check:
        cv2.imwrite('bg_org_masked.png', table_image)
    try:
        tables = TableRepositories(table_image).response['response']['tables']
    except  Exception as e:
        log_error("Service TableExtractor Error in finding tables", app_context.application_context, e)
        return None, None

    try:
        rects = RectRepositories(table_image)
        lines, _ = rects.get_tables_and_lines()

    except  Exception as e:
        log_error("Service TableExtractor Error in finding lines", app_context.application_context, e)
        return None, None

    line_df = get_line_df(lines)
    tables_df = get_table_df(tables)


    masked_image = mask_image(table_image, tables_df, image_width, image_height, app_context.application_context, margin=0,
                              fill=255)






    return masked_image, regions