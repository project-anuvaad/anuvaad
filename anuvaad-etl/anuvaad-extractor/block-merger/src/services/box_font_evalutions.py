import pandas as pd

def are_lines_fonts_similar(df, configs, idx1, idx2, debug=False):
    
    height = df.iloc[idx1]['text_height']
    space  =  abs(df.iloc[idx1]['text_top'] - df.iloc[idx2]['text_top']) 

    if (abs(df.iloc[idx1]['font_size'] - df.iloc[idx2]['font_size']) < 2.0) \
        and (df.iloc[idx1]['font_family'] == df.iloc[idx2]['font_family']) \
        and (space < 6 * height) :
        return True
    return False
    