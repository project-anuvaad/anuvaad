import pandas as pd

from src.services.box_horizontal_evalutions import (are_hlines,are_hlines_superscript)
from src.services.box_grouping import arrange_grouped_line_indices
from src.utilities.xml_utils import get_ngram
from collections import Counter


def merge_horizontal_blocks(in_df, configs,table=False,debug=False):
    df = in_df.copy(deep=True)
    df = in_df.reset_index(drop=True)

    connections = []
    index_grams = get_ngram(list(df.index.values), window_size=2)
    #This fails whten in_df contains only one node
    
    for index_gram in index_grams:
        if are_hlines(df, configs, index_gram[0], index_gram[1],table=table ,debug=debug):
            connections.append((index_gram[1], index_gram[0], 'CONNECTED'))
        else:
            connections.append((index_gram[1], index_gram[0], 'NOT_CONNECTED'))

    if debug:
        print("block connections (get_document_horizontal_blocks) : %s \n----\n" % (str(connections)))

    grouped_lines = arrange_grouped_line_indices(connections, debug=debug)
    cols = df.columns.values.tolist()
    cols.append('children')
    block_df = pd.DataFrame(columns=cols)

    index = 0
    for lines in grouped_lines:
        line_indices, connection_type = lines
        if connection_type == 'NOT_CONNECTED':
            for line_index in line_indices:
                block_df.loc[index] = df.iloc[line_index]
                block_df.loc[index]['children'] = None
                index += 1
        else:
            children_df = df.loc[lines[0][0]:lines[0][-1]].copy(deep=True)
            top = children_df['text_top'].min()
            left = children_df['text_left'].min()
            width = children_df[['text_left', 'text_width']].sum(axis=1).max() - left

            children_df.sort_values('text_top', axis=0, ascending=True, inplace=True)
            height = (children_df.iloc[-1]['text_top'] + children_df.iloc[-1]['text_height']) - children_df[
                'text_top'].min()


            block_df.at[index, 'text_top'] = top
            block_df.at[index, 'text_left'] = left
            block_df.at[index, 'text_height'] = height
            block_df.at[index, 'text_width'] = width

            children_df.sort_values('text_left', axis=0, ascending=True, inplace=True)
            block_df.at[index, 'text'] = ' '.join(children_df['text'].values.tolist())

            block_df.at[index, 'xml_index'] = children_df['xml_index'].min()

            children_df.sort_values('text_width', axis=0, ascending=True, inplace=True)

            block_df.at[index, 'attrib'] = most_frequent(children_df['attrib'])
            block_df.at[index, 'font_size'] = children_df.iloc[-1]['font_size']
            block_df.at[index, 'font_family'] = children_df.iloc[-1]['font_family']
            block_df.at[index, 'font_color'] = children_df.iloc[-1]['font_color']
            block_df.at[index, 'font_family_updated'] = children_df.iloc[-1]['font_family_updated']
            block_df.at[index, 'font_size_updated'] = children_df.iloc[-1]['font_size_updated']
            block_df.at[index, 'children'] = children_df.to_json()
            index += 1
            block_df = block_df.where(block_df.notnull(), None)

    return update_superscript_in_horizontal_boxes(block_df, configs, debug=debug)


def update_attribute_index(df, index, attrib):
    if (df.iloc[index]['attrib'] == None):
        df['attrib'].loc[index] = attrib
    else:
        if pd.isna(df.iloc[index]['attrib']) or df.iloc[index]['attrib'] == '':
            df['attrib'].loc[index] = attrib
        else:
            prev_attrib = df.iloc[index]['attrib']
            attribs = prev_attrib.split(',')
            attribs.append(attrib)
            attribs = list(set(attribs))
            df.at[index, 'attrib'] = ','.join(attribs)
    return df


def update_superscript_attribute(row_df, configs, debug=False):
    df = row_df.copy(deep=True)

    df.sort_values('text_left', inplace=True)
    df = df.reset_index(drop=True)
    df.reset_index(inplace=True)

    connections = []
    index_grams = get_ngram(list(df.index.values), window_size=2)
    for index_gram in index_grams:
        status, text_index, script_index = are_hlines_superscript(df, configs, index_gram[0], index_gram[1],
                                                                  debug=debug)

        if status:
            df = update_attribute_index(df, script_index, 'SUPERSCRIPT')
            if debug:
                print('superscript-index: (%d), text-index (%d), superscript-text (%s) text (%s)' % (
                script_index, text_index, df.iloc[script_index]['text'], df.iloc[text_index]['text']))

    return df


def update_superscript_in_horizontal_boxes(in_df, configs, debug=False):
    for index, row in in_df.iterrows():
        if row['children'] != None:
            children_df = pd.read_json(in_df.iloc[index]['children'])
            updated_children_df = update_superscript_attribute(children_df, configs, debug)
            in_df.at[index, 'children'] = updated_children_df.to_json()

    return in_df


    
def most_frequent(List): 
    try:
        occurence_count = Counter(List)
    except:
        pass 
    return occurence_count.most_common(1)[0][0]