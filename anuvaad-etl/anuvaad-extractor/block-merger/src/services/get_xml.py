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
from src.utilities.filesystem import (create_directory, extract_html_bg_image_paths_from_digital_pdf, extract_xml_path_from_digital_pdf)

from src.services.box_horizontal_operations import (merge_horizontal_blocks)
from src.services.box_vertical_operations import (merge_vertical_blocks)
from src.services.preprocess import  tag_heaader_footer_attrib
from src.services.left_right_on_block import left_right_margin


def create_pdf_processing_paths(filename, base_dir, jobid):
    data_dir    = os.path.join(base_dir, 'data')
    ret         = create_directory(data_dir)

    if ret == False:
        log_error('Service get_xml', 'JobID: unable to create data directory:', jobid, data_dir)
        return False
    
    output_dir  = os.path.join(data_dir, 'output')
    ret         = create_directory(output_dir)
    if ret == False:
        log_error('Service get_xml', 'JobID : unable to create output directory', jobid, output_dir)
        return False

    working_dir = os.path.join(output_dir, os.path.splitext(filename)[0]+'_'+str(uuid.uuid1()))
    ret         = create_directory(working_dir)
    if ret == False:
        log_info('Service get_xml', 'JobID: unable to create working directory', jobid, working_dir)
        return False
    
    log_info('Service get_xml', 'JobID: created processing directories successfully', jobid)
    
    return working_dir, True

def extract_pdf_metadata(filename, working_dir, base_dir, jobid):
    start_time          = time.time()
    pdf_filepath        = os.path.join(base_dir, filename)

    try:
        pdf_xml_filepath        = extract_xml_path_from_digital_pdf(pdf_filepath, working_dir)
    except Exception as e:
        log_error('Service filesystem', 'JobID: Error extracting xml information', jobid, e)
        return None, None, None
    log_info('Service filesystem', 'JobID: successful extracting xml', jobid)
    
    try:
        pdf_bg_img_filepaths    = extract_html_bg_image_paths_from_digital_pdf(pdf_filepath, working_dir)
    except Exception as e:
        log_error('Service filesystem', 'JobID: Error extracting background images information', jobid, e)
        return None, None, None
    log_info('Service filesystem', 'JobID: successful extracting xml', jobid)

    end_time            = time.time()
    extraction_time     = end_time - start_time
    log_info('Service filesystem', 'extract_pdf_metadata completed in {}, JobID: '.format(extraction_time), jobid)
    
    return pdf_xml_filepath, None, pdf_bg_img_filepaths

def process_input_pdf(filename, base_dir, jobid):
    '''
        - from the input extract following details
            - xml
            - images present in xml
            - background image present in each page
    '''
    working_dir, ret = create_pdf_processing_paths(filename, base_dir, jobid)
    
    if ret == False:
        log_info('Service get_xml', 'JobID: extract_pdf_processing_paths failed', jobid)
        return None, None, None, None, None, None
    
    pdf_xml_filepath, pdf_xml_image_paths, pdf_bg_img_filepaths   = extract_pdf_metadata(filename, working_dir, base_dir, jobid)
    if pdf_xml_filepath == None or pdf_bg_img_filepaths == None:
        log_info('Service get_xml', "JobID: cannot extract xml metadata from pdf file", jobid)
        return None, None, None, None, None, None

    '''
        - parse xml to create df per page for text and table block.
        - parse xml to create df per page for image block.
    '''
    try :
        xml_dfs, page_width, page_height = get_xml_info(pdf_xml_filepath)
    except Exception as e :
        log_error("Service get_xml", "Error in extracting text xml info", jobid, e)
        return None, None, None, None, None, None

    try :
        img_dfs, page_width, page_height = get_xml_image_info(pdf_xml_filepath)
    except Exception as e :
        log_error("Service get_xml", "Error in extracting image xml info", jobid, e)
        return None, None, None, None, None, None

    log_info('Service get_xml', 'created dataframes successfully JobID:', jobid)
    return img_dfs, xml_dfs, page_width, page_height, working_dir, pdf_bg_img_filepaths

    
def get_vdfs(pages, h_dfs, document_configs, debug=False):
    v_dfs = []
    try :
        for page_index in range(pages):
            h_df    = h_dfs[page_index]
            v_df    = merge_vertical_blocks(h_df, document_configs, debug=False)
            v_dfs.append(v_df)
    except Exception as e :
            log_error("Service get_xml", "Error in creating v_dfs", None, e)

    return v_dfs

        
def get_hdfs(pages, in_dfs,document_configs,header_region , footer_region,multiple_pages):
   
    h_dfs = []
    try:
        for page_index in range(pages):
            page_df   = in_dfs[page_index]
            page_df   = page_df.loc[:]
            if multiple_pages :
                page_df   = tag_heaader_footer_attrib(header_region , footer_region,page_df)

            h_df    = merge_horizontal_blocks(page_df, document_configs, debug=False)
            h_dfs.append(h_df)
    except Exception as e :
            log_error("Service get_xml", "Error in creating h_dfs", None, e)

    return h_dfs



def get_pdfs(pages, page_dfs, configs,block_configs, debug=False):
    p_dfs = []
    try :
        for page_index in range(pages):
            page_df     = page_dfs[page_index]
            cols        = page_df.columns.values.tolist()
            df          = pd.DataFrame(columns=cols)
            for index, row in page_df.iterrows():
                if row['children'] == None:
                    d_tmp = page_df.iloc[index]
                    d_tmp['avg_line_height'] = int(d_tmp['text_height'])
                    df = df.append(d_tmp)
                else:
                    dfs = process_block(page_df.iloc[index], block_configs)
                    df  = df.append(dfs)

            
            p_dfs.append(df)
    except Exception as e :
            log_error("Service get_xml", "Error in creating p_dfs", None, e)

    return p_dfs


def process_block(children, block_configs):
    dfs = left_right_margin(children, block_configs)
    return dfs


def drop_cols(df,drop_col=None ):
    if drop_col==None:
        drop_col = ['index', 'xml_index','level_0']
    
    for col in drop_col:
        if col in df.columns:
            df = df.drop(columns=[col])
    return df