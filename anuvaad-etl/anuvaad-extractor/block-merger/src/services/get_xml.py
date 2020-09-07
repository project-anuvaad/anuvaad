import os
import uuid 
import config
import logging
import time
from pathlib import Path
import pandas as pd
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error

from src.utilities.xml_utils import (extract_image_paths_from_pdf, extract_xml_from_digital_pdf,
                       create_directory, read_directory_files, get_subdirectories,
                       get_string_xmltree, get_xmltree, get_specific_tags, get_page_texts_ordered,
                       get_page_text_element_attrib, get_ngram, extract_html_bg_images_from_digital_pdf
                      )
from src.services.xml_document_info import (get_xml_info, get_xml_image_info, get_pdf_bg_image_info)


from src.services.box_horizontal_operations import (merge_horizontal_blocks)
from src.services.box_vertical_operations import (merge_vertical_blocks)
from src.services.preprocess import  tag_heaader_footer_attrib
from src.services.left_right_on_block import left_right_margin


def create_pdf_processing_paths(filename, base_dir, jobid):
    data_dir    = Path(os.path.join(base_dir, 'data'))
    ret         = create_directory(data_dir)
    if ret == False:
        log_info('Service get_xml','data directory creation failed', jobid)
        return False
    
    output_dir  = Path(os.path.join(data_dir, 'output'))
    ret         = create_directory(output_dir)
    if ret == False:
        log_info('Service get_xml','output directory creation failed', jobid)
        return False

    working_dir = Path(os.path.join(output_dir, os.path.splitext(filename)[0]+'_'+str(uuid.uuid1())))
    ret         = create_directory(working_dir)
    if ret == False:
        
        log_info('Service get_xml','working directory creation failed', jobid)
        return False
    
    log_info('Service get_xml','created processing directories successfully', jobid)
    
    return working_dir, True

def extract_pdf_metadata(filename, working_dir, base_dir,jobid):
    start_time          = time.time()
    pdf_filepath        = Path(os.path.join(base_dir, filename))
    try:
        pdf_image_paths     = extract_image_paths_from_pdf(pdf_filepath, working_dir)
        pdf_xml_dir         = extract_xml_from_digital_pdf(pdf_filepath, working_dir)
    except Exception as e :
        log_error("Service xml_utils", "Error in extracting xml", jobid, e)
    try:
        os.system('pdftohtml -c ' + str(pdf_filepath) + ' ' + str(working_dir) + '/')
    except Exception as e :
        log_error("Service get_xml", "Error in extracting html", jobid, e)   

    # try:
    #     pdf_bg_image_dir    = extract_html_bg_images_from_digital_pdf(pdf_filepath, working_dir)
    # except Exception as e :
    #     log_error("Service xml_utils", "Error in extracting html of bg images", jobid, e)
    #
    end_time            = time.time()
    extraction_time     = end_time - start_time
    
    xml_files           = read_directory_files(pdf_xml_dir, pattern='*.xml')
    bg_files            = None#read_directory_files(pdf_bg_image_dir, pattern='*.png')
    
    log_info('Service get_xml','Successfully extracted xml, background images of file:', jobid)
    
    return xml_files,  bg_files, pdf_image_paths

def process_input_pdf(filename, base_dir, jobid, lang):
    '''
        - from the input extract following details
            - xml
            - images present in xml
            - background image present in each page
    '''
    working_dir, ret = create_pdf_processing_paths(filename, base_dir, jobid)
    
    if ret == False:
        log_info('Service get_xml','extract_pdf_processing_paths failed', jobid)
        return False
    
    xml_file ,bg_files, pdf_image_paths   = extract_pdf_metadata(filename, working_dir,base_dir,jobid)
    if xml_file == None : #or bg_files == None:
        log_info('Service get_xml','cannot extract xml metadata from pdf file', jobid)
        return False
    '''
        - parse xml to create df per page for text and table block.
        - parse xml to create df per page for image block.
    '''
    try :
        xml_dfs, page_width, page_height = get_xml_info(xml_file[0],lang)
    except Exception as e :
            log_error("Service xml_document_info", "Error in extracting text xml info", jobid, e)
    try :
        img_dfs, page_width, page_height = get_xml_image_info(xml_file[0])
    except Exception as e :
            log_error("Service xml_document_info", "Error in extracting image xml info", jobid, e)
    #
    # try:
    #     bg_dfs  = get_pdf_bg_image_info(page_width, page_height, bg_files)
    # except Exception as e:
    #     log_error("Service xml_document_info", "Error in get_pdf_bg_image_info, unable to encode background images ", jobid, e)

    return img_dfs, xml_dfs, page_width, page_height ,working_dir, pdf_image_paths #, bg_dfs

    
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

def change_font(font_name):
    if '+' in font_name:
        font = font_name.split('+')[1]
    else:
        font = font_name
    return font

def update_font(p_dfs, pages):

    new_dfs = []
    for page_index in range(pages):
            page_df     = p_dfs[page_index]
            page_df     = page_df.where(page_df.notnull(), None)
            page_lis    = []
            child_lis   =[]
            for index, row in page_df.iterrows():
                if row['children'] == None:
                    page_lis.append(change_font(row["font_family"]))
                    child_lis.append(row['children'])
                else:
                    sub_block_children   =  pd.read_json(row['children'])
                    sub_block_children  = sub_block_children.where(sub_block_children.notnull(), None)
                    page_lis1    = []
                    child_lis1   =[]
                    for index2, row2 in sub_block_children.iterrows():
                        if row2['children'] == None:
                            child_lis1.append(row2['children'])
                            page_lis1.append(change_font(row2["font_family"]))
                        else:
                            sub2_block_children   =  pd.read_json(row2['children'])
                            sub2_block_children   = sub2_block_children.where(sub2_block_children.notnull(), None)
                            page_lis2 = []
                            for index3, row3 in sub2_block_children.iterrows():
                                page_lis2.append(change_font(row3["font_family"]))
                                
                            sub2_block_children['font_family'] = page_lis2
                            page_lis1.append(max(set(page_lis2), key = page_lis2.count))
                            child_lis1.append(sub2_block_children.to_json())
                            

                    sub_block_children['font_family'] = page_lis1

                    page_lis.append(max(set(page_lis1), key = page_lis1.count))
                    child_lis.append(sub_block_children.to_json())

            page_df['font_family'] = page_lis
            page_df['children']    = child_lis
            new_dfs.append(page_df)

    return new_dfs
                
                        