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
            for index2, row in temp_df.iterrows():
                word_coord = {}
                text = text +" "+ str(row["text"])
                word_coord['text']          = str(row["text"])
                word_coord['conf']          = row["conf"]
                word_coord['text_left']     = int(row["left"])
                word_coord['text_top']      = int(row["top"])
                word_coord['text_width']    = int(row["width"])
                word_coord['text_height']   = int(row["height"])
                coord.append(word_coord)

            word_coord_lis.append(coord)
            df.at[index, 'text'] = text
        else:
            temp_df = pytesseract.image_to_data(crop_image,config='--psm 7', lang=LANG_MAPPING[lang]+"+eng",output_type=Output.DATAFRAME)
            temp_df = temp_df[temp_df.text.notnull()]
            text = ""
            
            for index2, row in temp_df.iterrows():
                word_coord = {}
                text = text +" "+ str(row["text"])
                word_coord['text']          = str(row["text"])
                word_coord['conf']          = row["conf"]
                word_coord['text_left']     = int(row["left"])
                word_coord['text_top']      = int(row["top"])
                word_coord['text_width']    = int(row["width"])
                word_coord['text_height']   = int(row["height"])
                coord.append(word_coord)
            
            df.at[index, 'text'] = text
            word_coord_lis.append(coord)

    df['word_coords'] = word_coord_lis
        
    return df



def tesseract_ocr(pdf_image_paths, desired_width, desired_height, dfs, lang,jobid ):

    log_info("Service ocr_text_utilities", "tesseract ocr started  ===>", jobid)

    try:
        start_time          = time.time()
        ocr_dfs = []
        for i, df in enumerate(dfs):
            filepath   = pdf_image_paths[i]
            df_updated  = extract_text_from_image(filepath, desired_width, desired_height, df, lang)
            ocr_dfs.append(df_updated)

        end_time            = time.time()
        extraction_time     = end_time - start_time
    except Exception as e :
            log_error("Service ocr_text_utilities", "Error in tesseract ocr", jobid, e)

    log_info("Service ocr_text_utilities", "tesseract ocr successfully completed", jobid)

    return ocr_dfs

