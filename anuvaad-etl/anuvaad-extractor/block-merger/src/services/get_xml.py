import os
import uuid
import config
import logging
import time
import pandas as pd
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error

from src.utilities.xml_utils import ( get_string_xmltree, get_xmltree, get_specific_tags, get_page_texts_ordered, get_page_text_element_attrib, get_ngram)
from src.services.xml_document_info import (get_xml_info, get_xml_image_info, get_pdf_image_info)
from src.utilities.filesystem import (create_directory,extract_image_paths_from_pdf, extract_html_bg_image_paths_from_digital_pdf, extract_xml_path_from_digital_pdf)

from src.services.box_horizontal_operations import (merge_horizontal_blocks)
from src.services.box_vertical_operations import (merge_vertical_blocks)
from src.services.preprocess import  tag_heaader_footer_attrib
from src.services.left_right_on_block import left_right_margin
import src.utilities.app_context as app_context
from src.utilities.primalaynet.header_footer import PRIMA


primalaynet = PRIMA()


def create_pdf_processing_paths(filepath, base_dir):

    filename    = os.path.basename(filepath)
    working_dir = os.path.join(base_dir, os.path.splitext(filename)[0] + '_' + str(uuid.uuid1()))
    ret         = create_directory(working_dir)

    if ret == False:
        log_error('unable to create working directory {}'.format(working_dir), app_context.application_context, None)
        return None, False

    log_info('created processing directories successfully {}'.format(working_dir), app_context.application_context)

    return working_dir, True

def extract_pdf_metadata(filename, working_dir, base_dir):
    start_time          = time.time()
    pdf_filepath        = os.path.join(base_dir, filename)

    log_info('filepath {}, working_dir {}'.format(pdf_filepath, working_dir), app_context.application_context)
    try:
        pdf_image_paths         = extract_image_paths_from_pdf(pdf_filepath, working_dir)
        pdf_xml_filepath        = extract_xml_path_from_digital_pdf(pdf_filepath, working_dir)
    except Exception as e:
        log_error('error extracting xml information of {}'.format(pdf_filepath), app_context.application_context, e)
        return None, None, None
    log_info('Extracting xml of {}'.format(pdf_filepath), app_context.application_context)

    try:
        pdf_bg_img_filepaths    = extract_html_bg_image_paths_from_digital_pdf(pdf_filepath, working_dir)
    except Exception as e:
        log_error('unable to extract background images of {}'.format(pdf_filepath), app_context.application_context, None)
        return None, None, None

    log_info('Extracting background images of {}'.format(pdf_filepath), app_context.application_context)

    end_time            = time.time()
    extraction_time     = end_time - start_time
    log_info('Extraction of {} completed in {}'.format(pdf_filepath, extraction_time), app_context.application_context)

    return pdf_xml_filepath, pdf_image_paths, pdf_bg_img_filepaths

def process_input_pdf(filename, base_dir, lang):
    '''
        - from the input extract following details
            - xml
            - images present in xml
            - background image present in each page
    '''
    start_time          = time.time()

    working_dir, ret = create_pdf_processing_paths(filename, base_dir)

    if ret == False:
        log_error('create_pdf_processing_paths failed', app_context.application_context, None)
        return None, None, None, None, None, None, None

    pdf_xml_filepath, pdf_image_paths, pdf_bg_img_filepaths   = extract_pdf_metadata(filename, working_dir, base_dir)
    if pdf_xml_filepath == None or pdf_bg_img_filepaths == None or pdf_image_paths == None:
        log_error('extract_pdf_metadata failed', app_context.application_context, None)
        return None, None, None, None, None, None, None

    '''
        - parse xml to create df per page for text and table block.
        - parse xml to create df per page for image block.
    '''
    try :
        xml_dfs, page_width, page_height = get_xml_info(pdf_xml_filepath, lang)
    except Exception as e :
        log_error('get_xml_info failed', app_context.application_context, e)
        return None, None, None, None, None, None, None

    try :
        img_dfs, page_width, page_height = get_xml_image_info(pdf_xml_filepath)
    except Exception as e :
        log_error('Error in extracting image xml info failed', app_context.application_context, e)
        return None, None, None, None, None, None, None

    log_info('process_input_pdf: created dataframes successfully', app_context.application_context)
    end_time         = time.time()
    elapsed_time     = end_time - start_time
    log_info('Processing of process_input_pdf completed in {}/{}, average per page {}'.format(elapsed_time, len(xml_dfs), (elapsed_time/max(1,len(xml_dfs)))), app_context.application_context)

    return img_dfs, xml_dfs, page_width, page_height, working_dir, pdf_bg_img_filepaths, pdf_image_paths


def get_vdfs(h_dfs):
    start_time          = time.time()
    document_configs    = config.DOCUMENT_CONFIGS
    v_dfs = []

    try :
        pages = len(h_dfs)
        for page_index in range(pages):
            h_df    = h_dfs[page_index]
            if len(h_df) > 1:
                v_df    = merge_vertical_blocks(h_df, document_configs, debug=False)
            else:
                v_df = h_df
                v_df['children'] = None
            v_dfs.append(v_df)
    except Exception as e :
        log_error('Error in creating v_dfs', app_context.application_context, e)
        return None

    end_time         = time.time()
    elapsed_time     = end_time - start_time
    log_info('Processing of get_vdfs completed in {}/{}, average per page {}'.format(elapsed_time, len(h_dfs), (elapsed_time/len(h_dfs))), app_context.application_context)

    return v_dfs


def get_hdfs(in_dfs, header_region, footer_region,width_ratio,height_ratio,images=None,table=False):

    start_time          = time.time()
    try:
        pages = len(in_dfs)
        multiple_pages = False
        if pages > 1:
            multiple_pages =True
        h_dfs = []
        document_configs = config.DOCUMENT_CONFIGS
        for page_index in range(pages):
            page_df   = in_dfs[page_index]
            if config.HEADER_FOOTER_BY_PRIMA:
                log_info('Starting header footer detetion with PRIMA',
                         app_context.application_context)
                if images != None :
                    region_df  = primalaynet.predict_primanet(images[page_index], [])
                    page_df = tag_heaader_footer_attrib(region_df, pd.DataFrame(), page_df,width_ratio,height_ratio)
                else:
                    page_df = tag_heaader_footer_attrib(header_region, footer_region, page_df,width_ratio,height_ratio)

            else :
                if multiple_pages :
                    page_df   = tag_heaader_footer_attrib(header_region , footer_region,page_df,width_ratio,height_ratio)
            if len(page_df) > 1:
                h_df    = merge_horizontal_blocks(page_df, document_configs,table=table, debug=False)
            else :
                h_df = page_df

            h_dfs.append(h_df)
    except Exception as e :
        log_error('Error in creating h_dfs' +str(e), app_context.application_context, e)
        return None

    end_time         = time.time()
    elapsed_time     = end_time - start_time
    log_info('Processing of get_hdfs completed in {}/{}, average per page {}'.format(elapsed_time, len(in_dfs), (elapsed_time/max(len(in_dfs) ,1))), app_context.application_context)

    return h_dfs



def get_pdfs(page_dfs,lang):
    start_time          = time.time()
    try:
        p_dfs    = []
        pages    = len(page_dfs)
        block_configs = config.BLOCK_CONFIGS
        for page_index in range(pages):
            page_df     = page_dfs[page_index]
            page_df = page_df.reset_index(drop=True)
            cols        = page_df.columns.values.tolist()
            df          = pd.DataFrame(columns=cols)
            for index, row in page_df.iterrows():
                if row['children'] == None:
                    d_tmp = page_df.iloc[index]
                    d_tmp['avg_line_height'] = int(d_tmp['text_height'])
                    df = df.append(d_tmp)
                else:
                    dfs = process_block(page_df.iloc[index], block_configs,lang)
                    df  = df.append(dfs)
            p_dfs.append(df)

    except Exception as e :
        log_error('Error in creating p_dfs', app_context.application_context, e)
        return None

    end_time         = time.time()
    elapsed_time     = end_time - start_time
    log_info('Processing of get_pdfs completed in {}/{}, average per page {}'.format(elapsed_time, len(p_dfs), (elapsed_time/len(p_dfs))), app_context.application_context)
    return p_dfs


def process_block(children, block_configs,lang):
    dfs = left_right_margin(children, block_configs,lang)
    return dfs


def drop_cols(df,drop_col=None):
    if len(df) !=0:
        if drop_col==None:
            drop_col = ['index', 'xml_index','level_0']

        for col in drop_col:
            if col in df.columns:
                df = df.drop(columns=[col])
        return df
    else:
        return None

def drop_update_col(page_df):
    try:
        if len(page_df)==0:
            return page_df
        page_df     = page_df.where(page_df.notnull(), None)
        page_lis =[]
        for index, row in page_df.iterrows():
            if row['children'] != None:
                sub_block_children     =  pd.read_json(row['children'])
                sub_block_children     =  sub_block_children.where(sub_block_children.notnull(), None)
                child_lis = []
                for index2,row2 in sub_block_children.iterrows():
                    if row2['children']!=None:
                        sub_block_children2   =  pd.read_json(row2['children'])
                        sub_block_children2   = drop_cols(sub_block_children2,drop_col=['font_family','font_size'])
                        sub_block_children2.rename(columns={'font_family_updated': 'font_family', 'font_size_updated': 'font_size'},inplace=True)

                        child_lis.append(sub_block_children2.to_json())
                    else:
                        child_lis.append(None)

                sub_block_children   = drop_cols(sub_block_children,drop_col=['font_family','font_size'])
                sub_block_children.rename(columns={'font_family_updated': 'font_family', 'font_size_updated': 'font_size'},inplace=True)
                sub_block_children['children'] = child_lis
                page_lis.append(sub_block_children.to_json())

            else:
                page_lis.append(None)

        page_df['children'] = page_lis
        page_df   = drop_cols(page_df,drop_col=['font_family','font_size'])

        page_df.rename(columns={'font_family_updated': 'font_family', 'font_size_updated': 'font_size'},inplace=True)

        return page_df

    except Exception as e:
        log_error('Error in updating and droping columns', app_context.application_context, e)
        return None

'''

def update_font(p_dfs,lang):
    start_time          = time.time()
    pages    = len(p_dfs)
    new_dfs = []

    try :
        for page_index in range(pages):
                page_df     = p_dfs[page_index]
                page_df     = page_df.where(page_df.notnull(), None)
                page_lis    = []
                child_lis   = []

                for index, row in page_df.iterrows():
                    if row['children'] == None:
                        page_lis.append(change_font(row["font_family"],lang))
                        child_lis.append(row['children'])
                    else:
                        sub_block_children   =  pd.read_json(row['children'])
                        sub_block_children   = sub_block_children.where(sub_block_children.notnull(), None)
                        page_lis1    = []
                        child_lis1   =[]
                        for index2, row2 in sub_block_children.iterrows():
                            if row2['children'] == None:
                                child_lis1.append(row2['children'])
                                page_lis1.append(change_font(row2["font_family"] ,lang))
                            else:
                                sub2_block_children   =  pd.read_json(row2['children'])
                                sub2_block_children   = sub2_block_children.where(sub2_block_children.notnull(), None)
                                page_lis2 = []
                                for index3, row3 in sub2_block_children.iterrows():
                                    page_lis2.append(change_font(row3["font_family"],lang))

                                sub2_block_children['font_family'] = page_lis2
                                #print(sub2_block_children)
                                page_lis1.append(max(set(page_lis2), key = page_lis2.count))
                                child_lis1.append(sub2_block_children.to_json())
                                #print(child_lis1)


                        sub_block_children['font_family'] = page_lis1
                        sub_block_children['children']   = child_lis1

                        page_lis.append(max(set(page_lis1), key = page_lis1.count))
                        child_lis.append(sub_block_children.to_json())

                page_df['font_family'] = page_lis
                page_df['children']    = child_lis
                new_dfs.append(page_df)


        end_time            = time.time()
        extraction_time     = end_time - start_time
        log_info('Updating of fonts completed in {}'.format(extraction_time), app_context.application_context)

    except Exception as e:
        log_error('Error in updating fonts' + str(e), app_context.application_context, e)
        return None


    return new_dfs    '''
