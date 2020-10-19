
def extract_and_delete_region(dic, df, extract_by='Intersection'):
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
    return text_df, df



def collate_regions(regions,in_df):
    sub_in_dfs = []
    if len(regions) > 0 :
        for region in regions:
            sub_in_df,in_df = extract_and_delete_region(region,in_df)
            sub_in_dfs.append(sub_in_df)

    if len(in_df) > 0 :
            sub_in_dfs.append(in_df)

    return sub_in_dfs