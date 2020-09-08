import pandas as pd
import os
from src.utilities.xml_utils import (
    get_string_xmltree, get_xmltree, get_specific_tags, get_page_texts_ordered,
    get_page_text_element_attrib, get_page_image_element_attrib, get_image_base64
    )

def get_document_width_height(pages):
    return int(pages[0].attrib['width']), int(pages[0].attrib['height'])

'''
    -    Normalizes the left & width value currently
'''
def normalize_page_xml_df(in_df, width, height):
    df = in_df.copy(deep=True)
    
    for index, row in df.iterrows():
        if row['text_left'] < 0:
            df.at[index, 'text_left'] = abs(in_df.iloc[index]['text_left'])
            
        if row['text_left'] + row['text_width'] > width:
            df.at[index, 'text_width'] = in_df.iloc[index-1]['text_width']
    
    return df

'''
    - Remove all range of rows between
        - 'Digitally signed by' & 'Signature Not Verified'. This is primarily meant for SC judgment
'''
def remove_redundant_rows(in_df):
    df          = in_df.copy(deep=True)
    start_index = 0
    end_index   = 0
    
    start       = df.index[df['text'] == 'Digitally signed by'].tolist()
    if (len(start) > 0):
        start_index = start[0]

    end   = df.index[df['text'] == 'Signature Not Verified'].tolist()
    if (len(end) > 0):
        end_index = end[0]
    
    indices = []
    if (start_index != 0 and end_index != 0) and (start_index < end_index):
        for i in range(start_index, end_index+1):
            indices.append(df.index[i])
        df = df.drop(indices)
    
    return df

def get_font_family(lang, f_family):

    if lang!='en':
        font = config.FONT_CONFIG[lang]
    else:
        font = f_family

    return font

def get_text_tag(bold, italic):

    attr = ''
    if len(bold)!=0 and len(italic)!=0:
        attr = "BOLD"+ ", ITALIC"
    if len(bold)!=0 and len(italic)==0:
        attr =  "BOLD"
    if len(italic)!=0 and len(bold)==0:
        attr = "ITALIC"

    return attr

def get_xml_info(filepath, lang='en'):
    xml             = get_xmltree(filepath)
    tag             = 'page'
    pages           = get_specific_tags(xml, tag)
    print('Total number of pages (%d) in file (%s)' % (len(pages), os.path.basename(filepath)))
    
    width, height   = get_document_width_height(pages)
    fonts           = get_specific_tags(xml, 'fontspec')

    dfs             = []
    for page in pages:
        t_ts        = []
        t_ls        = []
        t_ws        = []
        t_hs        = []
        f_sizes     = []
        f_familys   = []
        f_colors    = []
        ts          = []
        attribs     = []
        
        texts       = get_specific_tags(page, 'text')
        #b           = get_specific_tags(page, 'b')
        for index, text in enumerate(texts):
            bold   =  get_specific_tags(text, 'b')
            italic =  get_specific_tags(text, 'i')
            
            p_t, p_l, p_w, p_h, t_t, t_l, t_w, t_h, f_size, f_family, f_color, t = get_page_text_element_attrib(fonts, page, text)
            if len(t.strip()) < 1:
                continue

            
            t_ts.append(t_t)
            t_ls.append(t_l)
            t_ws.append(t_w)
            t_hs.append(t_h)
            f_sizes.append(f_size)
            f_family = get_font_family(lang, f_family)
            
            f_familys.append(f_family)
            f_colors.append(f_color)
            ts.append(t)
            attr = get_text_tag(bold, italic)
            attribs.append(attr)
            
            
        
        df = pd.DataFrame(list(zip(t_ts, t_ls, t_ws, t_hs,
                                        ts, f_sizes, f_familys, f_colors, attribs)), 
                          columns =['text_top', 'text_left', 'text_width', 'text_height',
                                      'text', 'font_size', 'font_family', 'font_color', 'attrib'])
        '''
            remove rows that are redundant.
        '''
        df  = remove_redundant_rows(df)

        df.reset_index(inplace=True)
        df.rename(columns={'index':'xml_index'},inplace=True)
        dfs.append(normalize_page_xml_df(df, width, height))

    return dfs, width, height

def get_xml_image_info(filepath):
    xml             = get_xmltree(filepath)
    tag             = 'page'
    pages           = get_specific_tags(xml, tag)
    print('Total number of pages (%d) in file (%s)' % (len(pages), os.path.basename(filepath)))
    
    width, height   = get_document_width_height(pages)

    dfs             = []
    for page in pages:
        t_ts        = []
        t_ls        = []
        t_ws        = []
        t_hs        = []
        ts          = []
        attribs     = []
        
        images      = get_specific_tags(page, 'image')
        
        for index, image in enumerate(images):
            p_t, p_l, p_w, p_h, t_t, t_l, t_w, t_h, img_base64 = get_page_image_element_attrib(page, image)

            if img_base64 == None:
                continue

            t_ts.append(t_t)
            t_ls.append(t_l)
            t_ws.append(t_w)
            t_hs.append(t_h)
            ts.append(img_base64)
            attribs.append('IMAGE')
        
        df = pd.DataFrame(list(zip(t_ts, t_ls, t_ws, t_hs, ts, attribs)), 
                          columns =['text_top', 'text_left', 'text_width', 'text_height', 'base64', 'attrib'])

        df.reset_index(inplace=True)
        dfs.append(normalize_page_xml_df(df, width, height))

    return dfs, width, height

def get_pdf_image_info(width, height, images_path):
    
    print('Total number of background images (%d)' % (len(images_path)))
    
    dfs             = []
    for image_path in images_path:
        t_ts        = []
        t_ls        = []
        t_ws        = []
        t_hs        = []
        ts          = []
        attribs     = []
        
        t_t, t_l, t_w, t_h, img_base64 = (0, 0, width, height, get_image_base64(image_path))
        if img_base64 == None:
            continue

        t_ts.append(t_t)
        t_ls.append(t_l)
        t_ws.append(t_w)
        t_hs.append(t_h)
        ts.append(img_base64)
        attribs.append('IMAGE')
        
        df = pd.DataFrame(list(zip(t_ts, t_ls, t_ws, t_hs, ts, attribs)), 
                          columns =['text_top', 'text_left', 'text_width', 'text_height', 'base64', 'attrib'])

        df.reset_index(inplace=True)
        dfs.append(normalize_page_xml_df(df, width, height))

    return dfs