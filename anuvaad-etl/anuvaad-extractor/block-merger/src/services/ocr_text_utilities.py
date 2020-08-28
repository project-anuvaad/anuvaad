from pytesseract import pytesseract
from PIL import Image
from pytesseract import Output
import cv2

def extract_text_from_image(filepath, desired_width, desired_height, df, lang='hin'):
    image = Image.open(filepath)
    image = image.resize((desired_width, desired_height))
    

    for index, row in df.iterrows():
        left = row['text_left']
        top = row['text_top']
        right = row['text_left'] + row['text_width']
        bottom = row['text_top'] + row['text_height']
        coord = {}
        crop_image = image.crop((left-5, top-5, right+5, bottom+5))
        check_block_height = False
        if row['text_height']>2*row['font_size']:
            check_block_height = True
        if check_block_height:
            temp_df = pytesseract.image_to_data(crop_image, lang=lang,output_type=Output.DATAFRAME)
            temp_df = temp_df[temp_df.text.notnull()]
            
            text = ""
            for index2, row in temp_df.iterrows():
                text = text +" "+ str(row["text"])
                coord[str(row["text"])] = {"left":int(row["left"]),"conf":int(row["conf"]),"top":int(row["top"]),"width":int(row["width"]),"height":int(row["height"])}
            df.at[index, 'text'] = text
            df.at[index, 'word_coords'] = str(coord)
        else:
            temp_df = pytesseract.image_to_data(crop_image,config='--psm 7', lang=lang,output_type=Output.DATAFRAME)
            temp_df = temp_df[temp_df.text.notnull()]
            
            text = ""
            for index2, row in temp_df.iterrows():
                text = text +" "+ str(row["text"])
                coord[str(row["text"])] = {"left":int(row["left"]),"conf":int(row["conf"]),"top":int(row["top"]),"width":int(row["width"]),"height":int(row["height"])}
            df.at[index, 'text'] = text
            df.at[index, 'word_coords'] = str(coord)
        
    return df



def tesseract_ocr(pdf_image_paths, desired_width, desired_height, p_dfs, lang ):

    start_time          = time.time()

    ocr_dfs = []
    for i, p_df in enumerate(p_dfs):
        filepath   = pdf_image_paths[i]
        df_updated = extract_text_from_image(filepath, desired_width, desired_height, p_df, lang)
        ocr_dfs.append(df_updated)

    end_time            = time.time()
    extraction_time     = end_time - start_time
    
    return ocr_dfs

