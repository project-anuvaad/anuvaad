import config
from config import CROP_CONFIG
from pytesseract import Output
from  config import LANG_MAPPING
from pytesseract import pytesseract
from collections import Counter
from PIL import Image

def ocr(temp_df,left,top):
    temp_df = temp_df[temp_df.text.notnull()]
    text = ""
    coord = []
    for index1, row1 in temp_df.iterrows():
        word_coord = {}
        temp_text  = str(row1["text"])
        temp_conf  = row1["conf"]
        text = text +" "+ str(temp_text)
        word_coord['text']          = str(temp_text)
        word_coord['conf']          = temp_conf
        word_coord['text_left']     = int(row1["left"]+left)
        word_coord['text_top']      = int(row1["top"]+top)
        word_coord['text_width']    = int(row1["width"])
        word_coord['text_height']   = int(row1["height"])
        coord.append(word_coord)
    return text, coord

def get_text(path,coord,lang,width, height,freq_height):
    image   = Image.open(path)
    h_ratio = image.size[1]/height
    w_ratio = image.size[0]/width
    left   = int(coord[0]*w_ratio);  top    = int(coord[1]*h_ratio)
    right  = int(coord[2]*w_ratio);  bottom = int(coord[3]*h_ratio)
    
    #crop_image = image.crop((left-CROP_CONFIG[lang]['left'], top-CROP_CONFIG[lang]['top'], right+CROP_CONFIG[lang]['right'], bottom+CROP_CONFIG[lang]['bottom']))
    crop_image = image.crop((left, top, right, bottom))
    if abs(bottom-top) > freq_height:
        temp_df = pytesseract.image_to_data(crop_image, lang= LANG_MAPPING[lang][0],output_type=Output.DATAFRAME)
    else:
        temp_df = pytesseract.image_to_data(crop_image,config='--psm 7', lang=LANG_MAPPING[lang][0],output_type=Output.DATAFRAME)
    text, coord = ocr(temp_df,left,top)
    #crop_image.save(str(index) + '.jpg')
    return text, coord

def get_coord(bbox):
    temp_box = []
    if bbox['class']=='TEXT':
        temp_box.append(bbox["boundingBox"]['vertices'][0]['x'])
        temp_box.append(bbox["boundingBox"]['vertices'][0]['y'])
        temp_box.append(bbox["boundingBox"]['vertices'][2]['x'])
        temp_box.append(bbox["boundingBox"]['vertices'][2]['y'])
        
    return temp_box

def frequent_height(page_info):
    text_height = []
    for idx, level in enumerate(page_info):
        coord = get_coord(level)
        text_height.append(abs(coord[3]-coord[1]))
    occurence_count = Counter(text_height)

    return occurence_count.most_common(1)[0][0]

def text_extraction(lang, page_path, page_info,width, height):
    freq_height = frequent_height(page_info)
    for idx, level in enumerate(page_info):
        coord = get_coord(level)
        if len(coord)!=0:
            text, coord = get_text(page_path, coord, lang, width, height,freq_height)
            page_info[idx]['text'] = text
            page_info[idx]['tess_word_coords'] = coord

        else:
            page_info[idx]['text'] = None
            page_info[idx]['tess_word_coords'] = None

    return page_info

