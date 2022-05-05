import json
from src.services import get_xml
import pandas as pd
from anuvaad_auditor.loghandler import log_info
import base64
from anuvaad_auditor.loghandler import log_error
import src.utilities.app_context as app_context
import time
import uuid
import copy
#
# def adopt_child(p_df):
#
#     if len(p_df) > 0 :
#         p_df = p_df.where(p_df.notnull(), None)
#         p_df = p_df.reset_index(drop=True)
#         for index,row in p_df.iterrows():
#             if row['children'] == None :
#                 print('yes')
#                 p_df.loc['children'][index] =  'sgsdgsdgsdkjglsdkjgkdjgkldsjgkj'#row.to_json()
#             else :
#                 print(row['text'])
#
#     return p_df




def adopt_child(text_blocks):

    try :
        if len(text_blocks) > 0 :

            for index,block in enumerate(text_blocks):
                if block['children'] == None :
                    parent_info = copy.deepcopy(text_blocks[index])
                    text_blocks[index]['children'] = [parent_info]
                    #print('yes')
        return text_blocks
    except :
        return []



def df_to_json(p_df,block_key =''):

    page_data = []
    try:
        p_df      = p_df.where(p_df.notnull(), None)
        if len(p_df) > 0 :
            p_df = get_xml.drop_cols(p_df)
            p_df = p_df.reset_index(drop=True)
            for index ,row in p_df.iterrows():
                block = row.to_dict()
                if block_key == '':
                    block_key  =  str(uuid.uuid1())
                    block['block_id'] = uuid.uuid4().hex # block_key + '-' +  str(index)
                else:
                    block['block_id'] = uuid.uuid4().hex #block_key + '-' + str(index)
                for key in block.keys():

                    if key in ['text']:
                        block[key] = block[key]
                    if key not in ['text', 'children','block_id']:
                        try :
                            block[key] = int(block[key])
                        except :
                            pass

                # if block['attrib'] == "TABLE":
                #     pass
                # else :
                if 'children' in list(block.keys()):
                    if block['children'] == None :
                        pass
                    else :
                        block['children'] = df_to_json(pd.read_json(row['children']), block_key = block['block_id'])
                page_data.append(block)
        else:
            page_data = None


    except Exception as e :
        log_error('Error in generating response of p_df'+ str(e), app_context.application_context, e)
        return None

    return page_data

def process_image_df(img_df):
    image_data = []
    try:
        if len(img_df)>0:
            img_df   = get_xml.drop_cols(img_df)
                    
            for index ,row in img_df.iterrows():
                block           = row.to_dict()
                block['base64'] = block['base64'].decode('ascii')
                image_data.append(block)
            
        else:
            image_data =None
            
    except Exception as e :
        log_error('Error in generating response of img_df', app_context.application_context, e)
        return None

    return image_data

def process_table_df(table_df):
    table_data = []
    # unique_id =  str(uuid.uuid1())
    # try:
    #     if len(table_df)>0:
    #         table_df = get_xml.drop_cols(table_df)
    #
    #         for index ,row in table_df.iterrows():
    #             block             = row.to_dict()
    #             #block['children'] = row['children']
    #             block['block_id'] = str(index) + '-' + unique_id
    #             for index2, child in enumerate(row['children']):
    #                 row['children'][index2]['block_id'] = str(index) + '-' + str(index2) + '-' + unique_id
    #
    #                 for index3,sub_child in enumerate(child['text']):
    #                     if 'xml_index' in sub_child.keys():
    #                         row['children'][index2]['text'][index3].pop('xml_index')
    #                     row['children'][index2]['text'][index3]['block_id'] = str(index) + '-' + str(index2) + '-' + str(index3) + '-' + unique_id
    #
    #             block['children'] = row['children']
    #             table_data.append(block)
    #
    #     else:
    #         table_data = None
    # except Exception as e :
    #     log_error('Error in generating response of table_df', app_context.application_context, e)
    #     return None

    return table_data       

def process_line_df(line_df):
    line_data  = []
    try:
        if len(line_df)>0:
            line_df   = get_xml.drop_cols(line_df)
                    
            for index ,row in line_df.iterrows():
                block           = row.to_dict()
                line_data.append(block)
            
        else:
            line_data = None
    except Exception as e :
        log_error('Error in generating response of line_df', app_context.application_context, e)
        return None
        
    return line_data        

'''
def process_bg_image(bg_img):
    bg_image_data = []
    try:
        with open(bg_img, "rb") as img_file:
            img_base64 = base64.b64encode(img_file.read())
            img_base64 = img_base64.decode('ascii')
            bg_image_data.append(img_base64)
            return bg_image_data
    except Exception as e :
            log_error("Service get_response", "Error in processing bg_image", None, e) '''