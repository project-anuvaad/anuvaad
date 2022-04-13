import pandas as pd
import glob
def get_html_stats(path_to_html) :
    lis = pd.read_html(path_to_html,header =0)
    g_vison_string_length = len(lis[1].iloc[0][0])
    doc_df  = lis[2]
    doc_df['support'] = g_vison_string_length

    return doc_df

def get_stats_df_list(html_paths) :
    html_paths = glob.glob(html_paths + '/*.html')
    df_list = []
    for html_path in html_paths :
        try :
            doc_df = get_html_stats(html_path)
            df_list.append(doc_df)
        except :
            pass
    
    return df_list

def get_error_csv(html_paths):
    '''
    Take the path of dir containing comparison html as input
    Return a charecter level report for the document set
    '''
    
    df_list = get_stats_df_list(html_paths)

    concat_df = pd.concat(df_list,axis=0)
    concat_df['Character'].unique()
    character_stats = {}
    
    for unique_character in concat_df['Character'].unique():
        character_stats[unique_character] = {}
        char_df = concat_df.loc[concat_df['Character'] == unique_character]

        character_stats[unique_character]['Lost'] = (((char_df['Lost']/ char_df['Total'])  * char_df['support']) / char_df['support'].sum()).sum() *100
        character_stats[unique_character]['Confusee'] = (((char_df['Confused']/ char_df['Total'])  * char_df['support']) / char_df['support'].sum()).sum() *100
        character_stats[unique_character]['Spurious'] = (((char_df['Spurious']/ (char_df['Total'] +1))  * char_df['support']) / char_df['support'].sum()).sum() *100

        character_stats[unique_character]['contribution_to_overall_error'] =  100 *((char_df['Lost'] + char_df['Confused'] + char_df['Spurious']).sum() / char_df['support'].sum())
        character_stats[unique_character]['char_occurance'] = char_df['Total'].sum()
        character_stats[unique_character]['total_detected_chars'] = char_df['support'].sum()
        character_stats[unique_character]['contribution_to_detection_error'] =  100 *((char_df['Lost'] + char_df['Confused']).sum() / char_df['support'].sum())

    char_data = pd.DataFrame(character_stats).T
    char_data.to_csv('char_data.csv')
    
    return char_data

html_dir = '/home/naresh/Tarento/anuvaad/anuvaad-etl/anuvaad-extractor/block-merger/src/notebooks/html_file'
char_data = get_error_csv(html_dir)