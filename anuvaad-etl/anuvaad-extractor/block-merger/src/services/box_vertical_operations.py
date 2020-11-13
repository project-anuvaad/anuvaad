import pandas as pd


from src.services.box_font_evalutions import (are_lines_fonts_similar)
from src.services.box_grouping import arrange_grouped_line_indices
from src.utilities.xml_utils import get_ngram


def merge_vertical_blocks(in_df, configs, debug=False):
    df = in_df.copy(deep=True)
    df = df.reset_index(drop=True)
    df.reset_index(inplace=True)

    connections = []
    index_grams = get_ngram(list(df.index.values), window_size=2)

    for index_gram in index_grams:
        if are_lines_fonts_similar(df, configs, index_gram[0], index_gram[1], debug=debug):
            connections.append((index_gram[1], index_gram[0], 'CONNECTED'))
        else:
            connections.append((index_gram[1], index_gram[0], 'NOT_CONNECTED'))

    if debug:
        print("block connections (get_document_horizontal_blocks) : %s \n----\n" % (str(connections)))

    grouped_lines = arrange_grouped_line_indices(connections, debug=debug)
    cols = df.columns.values.tolist()

    if 'children' not in cols:
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

            block_df.at[index, 'text'] = ' '.join(children_df['text'].values.tolist())

            block_df.at[index, 'xml_index'] = children_df['xml_index'].min()
            block_df.at[index, 'font_size'] = children_df['font_size'].max()
            block_df.at[index, 'font_family_updated'] = df.iloc[lines[0][0]]['font_family_updated']
            block_df.at[index, 'font_size_updated'] = children_df['font_size_updated'].max()
            block_df.at[index, 'font_family'] = df.iloc[lines[0][0]]['font_family']
            block_df.at[index, 'font_color'] = df.iloc[lines[0][0]]['font_color']
            block_df.at[index, 'children'] = children_df.to_json()
            index += 1

    return block_df
