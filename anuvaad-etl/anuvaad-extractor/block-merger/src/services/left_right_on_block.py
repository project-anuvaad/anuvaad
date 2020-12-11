import pandas as pd
#import numpy as np
from collections import Counter
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
import math
import src.utilities.app_context as app_context

def next_gen_children(df,index):
    try:
        c_df = pd.read_json(df['children'][index])
        c_df = c_df.sort_values('text_left');   ind = c_df.index.values.astype(int);  top_all = sorted(c_df["text_top"])
        flag = False;  count=0; threshold = 50
        
        if abs(top_all[0]-top_all[-1])>20:
            return flag
        for i in range(len(ind)):
            left1   = int(c_df['text_left'][ind[i]]); right1  = int(c_df['text_width'][ind[i]] + left1)
            if i+1<len(ind):
                left2   = int(c_df['text_left'][ind[i+1]])
                if abs(left2-right1)>threshold:
                    count=count+1
        if count>=len(c_df)-1:
            flag=True
        else:
            flag=False
    except:
        pass
    return flag    

def children_condition(block_df,children_df,index,children_flag,lang):
    try:

        top          = children_df['text_top'].min()
        left         = children_df['text_left'].min()
        width        = children_df[['text_left', 'text_width']].sum(axis=1).max() - left
        avg_line_height       = int(sum(children_df['text_height'])/ len(children_df['text_height']))
        height       = (children_df.iloc[-1]['text_top'] + children_df.iloc[-1]['text_height']) - children_df['text_top'].min()
        block_df.at[index, 'text_top']     = top
        block_df.at[index, 'avg_line_height']  = avg_line_height
        block_df.at[index, 'text_left']    = left
        block_df.at[index, 'text_height']  = height
        block_df.at[index, 'text_width']   = width
        block_df.at[index, 'text']         = ' '.join(children_df['text'].values.tolist())
        block_df.at[index, 'xml_index']    = children_df['xml_index'].min()
        block_df.at[index, 'font_size']    = children_df['font_size'].max()
        block_df.at[index, 'font_family']  = most_frequent(children_df['font_family'])
        block_df.at[index, 'font_size_updated']    = children_df['font_size_updated'].max()
        block_df.at[index, 'font_family_updated']  = most_frequent(children_df['font_family_updated'])
        block_df.at[index, 'attrib'] = most_frequent(children_df['attrib'])
        block_df.at[index, 'font_color']   = most_frequent(children_df['font_color'])
        if (lang!='en') & ('word_coords' in children_df.columns) :
             block_df.at[index, 'word_coords']  = children_df['word_coords'].values[0]

        if children_flag==True:
            block_df = sub_children(block_df,children_df,index)
            if len(children_df)>1 and lang!='en':
                block_df.at[index, 'word_coords']  = None
        else:
            if len(children_df)>1:
                block_df.at[index, 'children']     = children_df.to_json()
            else:
                block_df.at[index, 'children']     = None
        index += 1
        
    except:
        pass
    
    return block_df,index


def sub_children(block_df,children_df,index):
    '''
        check subchildren df are none or not... 
        according to that append children df if there subchildren exist or not 
    '''
    try:
        if len(children_df)>1:
            block_df.at[index, 'children']     = children_df.to_json()
        else:
            if all(v is None for v in children_df['children']):
                block_df.at[index, 'children']     = None
            else:
                flg=False
                for v in children_df['children']:
                    if math.isnan(v):
                        flg=False
                    else:
                        flg=True
                if flg:
                    block_df.at[index, 'children']     = children_df.to_json()
                else:
                    block_df.at[index, 'children']     = None
    except:
        pass
    return block_df    

'''
    left_right_condition:
        - To check all types of possibility of line break
        - Line connected on basis of left and right margin

'''

def left_right_condition(flag,index,df,skip,current_line,left1,right1,para_right,para_left,ind, block_configs):

    right_margin_threshold = block_configs["right_margin_threshold"]; left_margin_threshold  = block_configs["left_margin_threshold"]
    right_break_threshold  = block_configs["right_break_threshold"];  left_break_threshold   = block_configs["left_break_threshold"]
    header_left_threshold  = block_configs["header_left_threshold"];  header_right_threshold = block_configs["header_right_threshold"]
    space_multiply_factor  = block_configs["space_multiply_factor"]
    
    try:
        for index2 in ind[index+1:]:
            left1 = int(df['text_left'][index2-1]); right1 = int(df['text_width'][index2-1]+left1)
            h1    = int(df['text_top'][index2-1])+int(df['text_height'][index2-1]);  h2 = int(df['text_top'][index2])
            left2 = int(df['text_left'][index2]); right2 = int(df['text_width'][index2]+left2)
            right_margin = right_margin_threshold*current_line; left_margin = left_margin_threshold*current_line
            v_spacing = abs(h2-h1); space_factor = max(int(df['text_height'][index2-1]),int(df['text_height'][index2]))

            ### CONDITION BASED ON LENGTH RATIO OF TWO CONSECUTIVE LINES W.R.T BLOCK
            if (length_ratio(para_right,para_left,left2,right2,left1,right1)):
                break

            ### CONDITION BASED ON VERTICAL SPACING OF TWO CONSECUTIVE LINES
            if v_spacing > space_factor*space_multiply_factor or left2 > right1 or left1 > right2:
                break   
            ### CONDITION BASED ON POSITION OF LINE IN BLOCK (MOSTLY FOR HEADER TYPE CONDITION)
            if (left1*(header_left_threshold-0.08) > para_left  and right1 < para_right*header_right_threshold):
                break
            if (left2*(header_left_threshold-0.20) > para_left and left1 != left2 and right2 < para_right*header_right_threshold) or (left2*(header_left_threshold-.20) > left1 and left1 != left2 and right2 < right1*header_right_threshold):
                break
            ### CURRENT LINE BREAK WHEN NEXT LINE IS NOT IN MARGIN WITH FIRST LINE
            if (left1 == left2 and right1 < right2-right2*right_break_threshold) or (left1-left_break_threshold*current_line > left2 and right1 <= right2-right_break_threshold*current_line):
                break

            ### IF LINES ARE IN LEFT AND RIGHT MARGIN MEANS THAY ARE CONNECTED WITH EACH OTHERS
            elif  (left1 == left2 and right1 == right2) or (left1 ==  left2 and right2 >= right1-right_margin):
                 if v_spacing>space_factor*2.0:
                     break
                 else:
                     skip = skip+1
            elif (left1+left_margin >= left2 and left2 > left1 and right1 == right2) or (left1+left_margin >= left2 and left2 > left1 and right2 >= right1-right_margin):
                if v_spacing > space_factor*2.0:
                    break
                else:
                    skip = skip+1
            elif (left1-left_margin <= left2 and left2 < left1 and right1 == right2) or (left1-left_margin <= left2 and left2<left1 and right2 >= right1-right_margin):
                if v_spacing > space_factor*2.0:
                    break
                else:
                    skip = skip+1
            elif (right2 < right1-40):
                if v_spacing > space_factor*2.0:
                    break
                else:
                    skip = skip+1
                    break
            else:
                if v_spacing > space_factor*2.0:
                    break
                else:
                    skip = skip+1
            if index2 == ind[-1]:
                skip = skip+1; flag = True
                break
    except:
        pass
            
    return flag,skip


def left_right_margin(children, block_configs,lang):
    try:
        para_left   = children['text_left'];  para_width = children['text_width'];  para_right = para_left+para_width
        children_df = children['children']
        in_df       = pd.read_json(children_df); df = in_df.reset_index()
        cols        = df.columns.values.tolist()
        block_df    = pd.DataFrame(columns=cols)
        
        ind = df.index.values.astype(int);  dfs = []; skip = 0; flag = False; block_index = 0
        for index in ind:
            if skip != 0:
                skip = skip-1
                continue
            if df['children'][index] != None and  isinstance(df['children'][index], str):
                if next_gen_children(df,index):
                    c_df = pd.read_json(df['children'][index])
                    children_flag = False
                    for i in range(len(c_df)):
                        block_df, block_index = children_condition(block_df,c_df[i:i+1],block_index,children_flag,lang)
                    continue
                
            left1 = int(df['text_left'][index]);  right1 = int(df['text_width'][index]+left1);  current_line = int(df['text_width'][index]);  skip=0
            
            flag, skip = left_right_condition(flag,index,df,skip,current_line,left1,right1,para_right,para_left,ind, block_configs)

            if flag:
                children_df   = df[index:index+skip]
                children_flag = False
                if len(children_df) != len(df):
                    children_flag = True
                    
                block_df, block_index = children_condition(block_df,children_df,block_index,children_flag,lang)
                break
            else:
                children_flag = False
                children_df   = df[index:index+skip+1]
                if len(children_df) != len(df):
                    children_flag = True
                    
                block_df, block_index = children_condition(block_df,children_df,block_index,children_flag,lang)
        block_df.loc[block_df['avg_line_height'].isnull(),'avg_line_height'] = block_df['text_height']
        
    except Exception as e :
        log_error("Error in left right margin", app_context.application_context, e)
        return None   
    
    return block_df


### If left right margin are same and both lines are independent so by this logic they will be seperated 
def length_ratio(para_right, para_left, left2, right2, left1, right1):
    try:
        para_length     = para_right-para_left;  prev_line_length = right1-left1;  current_line_length = right2-left2
        prev_line_ratio = para_length/prev_line_length
        next_line_ratio = para_length/current_line_length
        
        if prev_line_ratio > 2.5 and next_line_ratio > 2.5:
            return True
        else:
            return False
    except:
        pass
    
    
def most_frequent(List): 
    try:
        occurence_count = Counter(List)
    except:
        pass 
    return occurence_count.most_common(1)[0][0]
