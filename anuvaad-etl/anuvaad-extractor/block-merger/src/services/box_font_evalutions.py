import pandas as pd

def are_lines_fonts_similar(df, configs, idx1, idx2, debug=False):
    if (abs(df.iloc[idx1]['font_size'] - df.iloc[idx2]['font_size']) < 2.0) \
            and (df.iloc[idx1]['font_family'] == df.iloc[idx2]['font_family']):
        return True
    return False
    