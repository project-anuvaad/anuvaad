import time
import numpy as np
from PIL import Image
from pytesseract import Output
from  config import LANG_MAPPING
from pytesseract import pytesseract
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error





def extract_text_from_image(filepath, desired_width, desired_height, df, lang):
    image = Image.open(filepath)
    h_ratio = image.size[1]/desired_height
    w_ratio = image.size[0]/desired_width
    word_coord_lis = []

    text_list = []

    
    for index, row in df.iterrows():
        left = row['text_left']*w_ratio
        top = row['text_top']*h_ratio
        right = (row['text_left'] + row['text_width'])*w_ratio
        bottom = (row['text_top'] + row['text_height'])*h_ratio
        coord = []
        crop_image = image.crop((left-5, top-5, right+5, bottom+5))
        if row['text_height']>2*row['font_size']:
            temp_df = pytesseract.image_to_data(crop_image, lang= LANG_MAPPING[lang]+"+eng",output_type=Output.DATAFRAME)
            temp_df = temp_df[temp_df.text.notnull()]
            
            text = ""
            for index2, row1 in temp_df.iterrows():
                word_coord = {}
                text = text +" "+ str(row1["text"])
                word_coord['text']          = str(row1["text"])
                word_coord['conf']          = row1["conf"]
                word_coord['text_left']     = int(row1["left"])
                word_coord['text_top']      = int(row1["top"])
                word_coord['text_width']    = int(row1["width"])
                word_coord['text_height']   = int(row1["height"])
                coord.append(word_coord)

            word_coord_lis.append(coord)
            text_list.append(text)
            #df.at[index, 'text'] = text
        else:
            temp_df = pytesseract.image_to_data(crop_image,config='--psm 7', lang=LANG_MAPPING[lang]+"+eng",output_type=Output.DATAFRAME)
            temp_df = temp_df[temp_df.text.notnull()]
            text = ""
            
            for index2, row2 in temp_df.iterrows():
                word_coord = {}
                text = text +" "+ str(row2["text"])
                word_coord['text']          = str(row2["text"])
                word_coord['conf']          = row2["conf"]
                word_coord['text_left']     = int(row2["left"])
                word_coord['text_top']      = int(row2["top"])
                word_coord['text_width']    = int(row2["width"])
                word_coord['text_height']   = int(row2["height"])
                coord.append(word_coord)
            
            #df.at[index, 'text'] = text
            word_coord_lis.append(coord)
            text_list.append(text)

    df['word_coords'] = word_coord_lis
    df['text']  = text_list
    return df



def tesseract_ocr(pdf_image_paths, desired_width, desired_height, dfs, lang,input_json ):

    log_info("Service ocr_text_utilities tesseract ocr started  ===>", input_json)

    try:
        start_time          = time.time()
        ocr_dfs = []
        for i, df in enumerate(dfs):
            filepath   = pdf_image_paths[i]
            df_updated  = extract_text_from_image(filepath, desired_width, desired_height, df, lang)
            ocr_dfs.append(df_updated)

        end_time            = time.time()
        extraction_time     = end_time - start_time
        log_info("Service ocr_text_utilities tesseract ocr successfully completed", input_json)
    except Exception as e :
            log_error("Service ocr_text_utilities Error in tesseract ocr", input_json, e)
    return ocr_dfs

