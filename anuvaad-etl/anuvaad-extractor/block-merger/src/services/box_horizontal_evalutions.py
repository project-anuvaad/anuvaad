import pandas as pd


def are_hlines(df, configs, idx1, idx2, debug=False):
    space = abs(df.iloc[idx1]['text_top'] - df.iloc[idx2]['text_top'])
    if debug:
        print('are_hlines:: idx1: %d, idx2: %d, space: %d' % (idx1, idx2, space))

    diff_threshold = df.iloc[idx1]['text_height']
    return space <= diff_threshold#configs['SUPERSCRIPT_HEIGHT_DIFFERENCE']


def are_hlines_superscript(df, configs, idx1, idx2, debug=False):
    if (df.iloc[idx1]['text_top'] > df.iloc[idx2]['text_top']):
        if (df.iloc[idx1]['text_top'] - df.iloc[idx2]['text_top']) <= configs['SUPERSCRIPT_HEIGHT_DIFFERENCE']:
            return True, idx1, idx2

    if (df.iloc[idx2]['text_top'] > df.iloc[idx1]['text_top']):
        if (df.iloc[idx2]['text_top'] - df.iloc[idx1]['text_top']) <= configs['SUPERSCRIPT_HEIGHT_DIFFERENCE']:
            return True, idx2, idx1

    return False, idx1, idx2