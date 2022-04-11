import pandas as pd

def are_vlines(df, configs, idx1, idx2, debug=False):
    first_idx, sec_idx  = get_lines_upper_lower(df, idx1, idx2)
    space               = df.iloc[sec_idx]['text_top'] - (df.iloc[first_idx]['text_top'] + df.iloc[first_idx]['text_height'])
    if space > configs['VERTICAL_SPACE_TOO_CLOSE']:
        return True
    return False