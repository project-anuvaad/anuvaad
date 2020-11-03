
import pandas as pd
def extract_and_delete_region(dic, df, extract_by='starting_point'):
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

    text_df = df[region]
    df = df[~region]
    if len(text_df)==0:
        in_df_columns = ['xml_index', 'text_top', 'text_left', 'text_width', 'text_height',
                     'text', 'font_size', 'font_family', 'font_color', 'attrib']
        in_df = pd.DataFrame(columns=in_df_columns)
        in_df['text_top'] = [dic[top_key]]
        in_df['text_left'] = dic[left_key]
        in_df['text_height'] =dic[height_key]
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
    spacing_threshold = contours_df.iloc[0]['text_height']  * 0.5  # *2 #*0.5

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

def collate_regions(regions,in_df):
    sub_in_dfs = []
    if len(regions) > 0 :
        for region in regions:
            sub_in_df,in_df = extract_and_delete_region(region,in_df)
            if len(sub_in_df)>0:
                #in_df = sub_in_df.sort_values(by=['text_top'])
                #in_df = pd.DataFrame(sort_regions(in_df, []))
                sub_in_dfs.append(sub_in_df)
                

    if len(in_df) > 0 :
        sub_in_dfs.append(in_df)

    return sub_in_dfs
