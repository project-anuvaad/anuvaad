import config
import time
import pandas as pd
from src.services import get_xml
from anuvaad_auditor.loghandler import log_info
from src.services.get_response import process_image_df, process_table_df, df_to_json, process_line_df, adopt_child
from src.utilities.xml_utils import check_text
import src.utilities.app_context as app_context
from src.utilities.class_2.break_block_condition_single_column import process_page_blocks as process_block_single_column
from src.utilities.class_2.page_layout.utils import collate_regions

from shapely.geometry import Polygon
from rtree import index
import pandas as pd
import copy


def index_tree(poly_index, poly, idx):
    idx.insert(poly_index, poly.bounds)

def get_polygon(region):
    points = []
    vertices = region['vertices']
    for point in vertices:
        points.append((point['x'], point['y']))
    poly = Polygon(points)
    return poly


def collate_regions(regions, lines):
    idx = index.Index()
    if len(regions) > 0:
        lines_intersected =[]
        for line_idx, line in enumerate(lines):
            poly = get_polygon(line['boundingBox'])
            idx.insert(line_idx, poly.bounds)

        for region_index, region in enumerate(regions):
            region_poly = get_polygon(region['boundingBox'])
            children_lines = list(idx.intersection(region_poly.bounds))
            intersecting_region = None
            if len(children_lines):
                region[region_index]['children'] = []
                for intr_index in children_lines:
                    region[region_index]['children'].append(lines[intr_index])
                lines_intersected.append(intr_index)
            else:
                region[region_index]['children'] = None










def extract_and_delete_region(dic, df, extract_by='mid_point'):
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
        region = (df[left_key] >= dic[left_key]) & (df[top_key] >= dic[top_key]) & (
                (df[top_key]) <= (dic[top_key] + dic[height_key])) & (
                         (df[left_key]) <= (dic[left_key] + dic[width_key]))

    text_df = df[region]
    df = df[~region]
    if len(text_df) == 0:
        in_df_columns = ['xml_index', 'text_top', 'text_left', 'text_width', 'text_height',
                         'text', 'font_size', 'font_family', 'font_color', 'attrib']
        in_df = pd.DataFrame(columns=in_df_columns)
        in_df['text_top'] = [dic[top_key]]
        in_df['text_left'] = dic[left_key]
        in_df['text_height'] = dic[height_key]
        in_df['text_width'] = dic[width_key]
        in_df['text'] = ''
        in_df['attrib'] = None
        in_df['font_family'] = 'Arial Unicode MS'
        in_df['font_family_updated'] = 'Arial Unicode MS'
        in_df['font_size'] = in_df['text_height']
        in_df['font_size_updated'] = in_df['text_height']
        return in_df, df

    return text_df, df


def sort_regions(contours_df, sorted_contours=[]):
    check_y = contours_df.iloc[0]['text_top']
    spacing_threshold = contours_df.iloc[0]['text_height'] * 0.5  # *2 #*0.5

    same_line = contours_df[abs(contours_df['text_top'] - check_y) < spacing_threshold]
    next_lines = contours_df[abs(contours_df['text_top'] - check_y) >= spacing_threshold]
    '''
    if len(same_line) > 0 :
        check_y = same_line['text_top'].max()
        same_line = contours_df[abs(contours_df['text_top'] - check_y) < spacing_threshold ]
        next_lines = contours_df[abs(contours_df['text_top'] - check_y) >=spacing_threshold] '''

    next_lines = contours_df[abs(contours_df['text_top'] - check_y) >= spacing_threshold]
    sort_lines = same_line.sort_values(by=['text_left'])
    for index, row in sort_lines.iterrows():
        sorted_contours.append(row)
    if len(next_lines) > 0:
        sort_regions(next_lines, sorted_contours)

    return sorted_contours


def collate_regions(regions, in_df):
    sub_in_dfs = []
    if len(regions) > 0:
        for region in regions:
            sub_in_df, in_df = extract_and_delete_region(region, in_df)
            if len(sub_in_df) > 0:
                # in_df = sub_in_df.sort_values(by=['text_top'])
                # in_df = pd.DataFrame(sort_regions(in_df, []))
                sub_in_dfs.append(sub_in_df)

    if len(in_df) > 0:
        sub_in_dfs.append(in_df)

    return sub_in_dfs











def get_layout_proposals(pdf_data ,flags) :


        regions = #
        sub_in_dfs = collate_regions(regions ,pdf_data['in_dfs'][page_index])
        pdf_data['sub_in_dfs'].append(sub_in_dfs)
                sub_h_dfs  = get_xml.get_hdfs(sub_in_dfs,  pdf_data['header_region'], pdf_data['footer_region'])
                for df in sub_in_dfs:
                    if len(df )< =1:
                        df['children' ] =None
                        sub_h_dfs.append(df)
                h_dfs.append(sub_h_dfs)
        return h_dfs

        # integrate pubnet
    #    pass
    # if flags['page_layout'] == 'dict' :


def vertical_merging(pdf_data ,flags):

    if flags['doc_class'] == 'class_1' :
        return get_xml.get_vdfs(pdf_data['h_dfs'])
    else :
        v_dfs = []
        columns = ['xml_index', 'text_top', 'text_left', 'text_width', 'text_height',
                   'text', 'font_size', 'font_family', 'font_color', 'attrib']
        for h_df in pdf_data['h_dfs'] :
            v_df = pd.DataFrame(columns=columns)
            if flags['page_layout'] == 'single_column':
                v_df['text_height'] = [pdf_data['page_height']]
                v_df['text_width'] = pdf_data['page_width']
                v_df['text_top'] = 0
                v_df['text_left'] = 0
                v_df['children'] = h_df.to_json()
            else:
                for sub_h_df in h_df :
                    if len(sub_h_df ) >0:
                        sub_dic = {}
                        chunk_df = sub_h_df.copy()
                        chunk_df['text_right'] = chunk_df['text_left'] + chunk_df['text_width']
                        chunk_df['text_bottom'] = chunk_df['text_top'] + chunk_df['text_height']
                        sub_dic['text_top'] = chunk_df['text_top'].min()
                        sub_dic['text_left'] = chunk_df['text_left'].min()
                        sub_dic['text_width'] = chunk_df['text_right'].max() - sub_dic['text_left']
                        sub_dic['text_height'] = chunk_df['text_bottom'].max() - sub_dic['text_top']
                        sub_dic['text'] = ''

                        sub_dic['children'] = sub_h_df.to_json()

                        v_df = v_df.append([sub_dic])

            v_df = v_df.reset_index(drop=True)
            v_dfs.append(v_df)

        return v_dfs

def breaK_into_paragraphs(pdf_data ,flags):
    # if flags['page_layout'] == 'single_column':

    # if flags['doc_class'] == 'class_1' :
    return get_xml.get_pdfs(pdf_data['v_dfs'], pdf_data['lang'])

    # else :
    '''
    p_dfs = []
    for page_index ,v_df in enumerate(pdf_data['v_dfs']) :
        p_df = pd.concat(process_block_single_column(v_df, pdf_data['page_width'],page_num= page_index +1, configs=config.BLOCK_BREAK_CONFIG))
        p_dfs.append(p_df)
    return p_dfs  '''










def segment_regions():
    return []





