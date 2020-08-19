import os
import pandas as pd
import base64
import config

from src.services import get_xml
from src.services.service import BlockMerging
from src.services.left_right_on_block import left_right_margin
from src.services.preprocess import prepocess_pdf_regions
from src.services.get_tables import page_num_correction , get_text_table_line_df


def process_page_blocks(page_df, configs,block_configs, debug=False):

    cols        = page_df.columns.values.tolist()
    df          = pd.DataFrame(columns=cols)
    block_index = 0
    for index, row in page_df.iterrows():
        if row['children'] == None:
            df = df.append(page_df.iloc[index])
        else:
            dfs = process_block(page_df.iloc[index], block_configs)
            df  = df.append(dfs)
    return df


def process_block(children, block_configs):
    
    dfs = left_right_margin(children, block_configs)
    return dfs

def get_response(p_df,img_df,table_df,page_no,page_width,page_height):

    p_df['block_id'] = range(len(p_df))
    myDict           = {'page_no': page_no,'page_width': page_width,'page_height':page_height,'tables':[],'images':[],'text_blocks':[]}
    image_data       = process_image_df(myDict, img_df)
    table_data       = process_table_df(myDict, table_df)
    myDict['images'] = image_data
    myDict['tables'] = table_data
    page_data        = df_to_json(p_df)
    myDict['text_blocks'] = page_data

    return myDict

def drop_cols(df):
    drop_col = ['index', 'xml_index','level_0']
    
    for col in drop_col:
        if col in df.columns:
            df = df.drop(columns=[col])
    return df

def df_to_json(p_df):
    page_data = []
    p_df      = p_df.where(p_df.notnull(), None)
    if len(p_df) > 0 :
        p_df = drop_cols(p_df)
        

        for index ,row in p_df.iterrows():
            block = row.to_dict()
            for key in block.keys():
                if key in ['text']:
                    block[key] = block[key]
                if key not in ['text', 'children']:
                    try :
                        block[key] = int(block[key])
                    except :
                        pass
                
            if block['attrib'] == "TABLE":
                pass
            else :
                if 'children' in list(block.keys()):
                    if block['children'] == None :
                        pass
                    else :
                        block['children'] = df_to_json(pd.read_json(row['children']))
            page_data.append(block)
        
    return page_data

def process_image_df(myDict,img_df):
    image_data = []
    if len(img_df)>0:
        drop_col = ['index', 'xml_index','level_0']  
        img_df   = drop_cols(img_df)
                
        for index ,row in img_df.iterrows():
            block           = row.to_dict()
            block['base64'] = block['base64'].decode('ascii')
            image_data.append(block)
        return image_data
    else:
        return None

def process_table_df(myDict, table_df):
    table_data = []
    if len(table_df)>0:
        table_df = drop_cols(table_df)

        for index ,row in table_df.iterrows():
            block             = row.to_dict()
            block['children'] = row['children']
            for child in row['children']:
                for sub_child in child['text']:
                    if 'xml_index' in sub_child.keys():
                        sub_child.pop('xml_index')

            table_data.append(block)
        return table_data
    else:
        return None

def get_page_dfs(pages,xml_dfs,working_dir,image_files,header_region , footer_region, multiple_pages):
    
    page_dfs     = []
    table_dfs    = []
    block_merger = BlockMerging()

    for page_index in range(pages):
        table_image = os.path.join(working_dir, (page_num_correction(page_index , 3) + '.png'))

        in_df, table_df, line_df = get_text_table_line_df(table_image, xml_dfs[page_index])

        h_df    = get_xml.get_hdf(in_df, image_files, config.DOCUMENT_CONFIGS, page_index,header_region , footer_region, multiple_pages)
        v_df    = get_xml.get_vdf(h_df, config.DOCUMENT_CONFIGS)
        
        p_df = process_page_blocks(v_df, config.DOCUMENT_CONFIGS, config.BLOCK_CONFIGS)
        merger_df = block_merger.merge_blocks(p_df,config.DROP_TEXT)

        page_dfs.append(merger_df)
        table_dfs.append(table_df)

    return page_dfs, table_dfs

def DocumentStructure(file_name,base_dir=config.BASE_DIR):
    
    img_dfs,xml_dfs, image_files, page_width, page_height,working_dir  = get_xml.xml_dfs(base_dir, file_name)
    multiple_pages = False
    if len(xml_dfs) > 1:
        multiple_pages =True

    header_region, footer_region = prepocess_pdf_regions(xml_dfs, page_height)
    
    pages               = len(xml_dfs)
    page_dfs, table_dfs = get_page_dfs(pages,xml_dfs,working_dir,image_files,header_region , footer_region, multiple_pages)

    response = {'result':[]}
    for page_index in range(pages):
        img_df     = img_dfs[page_index]
        page_df    = page_dfs[page_index]
        table_df   = table_dfs[page_index]

        final_json = get_response(page_df, img_df,table_df, page_index, page_width, page_height)
        response['result'].append(final_json)

    return response


