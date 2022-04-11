import  pandas as pd
import config
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error


def get_underline_per_page(p_df , lines_df):
    p_df['underline'] = False
    mean_height = p_df['font_size'].mean()
    decision_boundary = mean_height * config.PREPROCESS_CONFIGS['underline_threshold']

    line_df = pd.DataFrame()

    for index,row in lines_df.iterrows() :
        check_underline = abs(p_df['text_top'] + p_df['text_height'] - row['text_top']) < decision_boundary
        if sum(check_underline) >  0 :
            p_df['underline'].loc[check_underline] = True
        else :
            line_df = line_df.append(row)
    return line_df , p_df


def get_underline(p_dfs, line_dfs,input_json):
    p_df_list = []
    line_df_list =[]
    try :

        for page_index in range(len(p_dfs)):

            line_df , p_df = get_underline_per_page(p_dfs[page_index], line_dfs[page_index])
            p_df_list.append(p_df)
            line_df_list.append(line_df)

        log_info("UnderLineDetection successfully completed", input_json)

    except Exception as e :
        log_error("Service UnderlineDetetion Error in finding under lines", input_json, e)



    return p_df_list , line_df_list