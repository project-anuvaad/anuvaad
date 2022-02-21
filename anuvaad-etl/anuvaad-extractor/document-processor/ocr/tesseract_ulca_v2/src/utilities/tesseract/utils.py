import cv2
import config
import numpy as np
import uuid,os
import src.utilities.app_context as app_context
import pytesseract
import statistics
from pytesseract import Output
from src.utilities.tesseract.dynamic_adjustment import validate_region
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception

SECOND_LANG_MAPPING = {
    "Latin": ["Latin", "eng"],
    "Kannada": ['Kannada', "anuvaad_kan"],
    "Gujrati": ["Gujrati", "guj"],
    "Oriya": ["Oriya", "anuvaad_ori"],
    "Devanagari": ["Devanagari", "anuvaad_hin"],
    "Bengali": ["Bengali", "anuvaad_ben"],
    "Tamil": ['Tamil', "anuvaad_tam"],
    "Telugu": ["Telugu", "tel"],
    "Malayalam": ["Malayalam", "anuvaad_mal"],
    "Punjabi": ["Punjabi", "pun"]
}

def adjust_crop_coord(coord):
    if validate_region(coord):
        c_x = config.C_X; c_y=config.C_Y; box = get_box(coord)
        reg_left = box[0][0];  reg_right = box[1][0]

        box[0][0]=min(box[0][0],reg_left)+c_x; box[0][1]=box[0][1]+c_y; box[1][0]=abs(max(box[1][0],reg_right)-c_x); box[1][1]=box[1][1]+c_y
        box[2][0]=abs(max(box[2][0],reg_right)-c_x); box[2][1]=abs(box[2][1]-c_y); box[3][0]=abs(min(box[3][0],reg_left)+c_x); box[3][1]=abs(box[3][1]-c_y)
        return box,c_x,c_y
    else:
        log_exception("Error in region   due to invalid coordinates",  app_context.application_context, coord)
        return None ,None, None

def crop_region(box,image):
    try:
        if box is None:
            log_exception("Error in region   due to invalid coordinates",  app_context.application_context, e)
            return None
        if config.PERSPECTIVE_TRANSFORM:
            crop_image = get_crop_with_pers_transform(image, box, height=abs(box[0,1]-box[2,1]))
        else :
            crop_image = image[box[0][1] : box[2][1] ,box[0][0] : box[1][0]]

        return crop_image
    except Exception as e:
        log_exception("Error in region   due to invalid coordinates",  app_context.application_context, e)
        return None

def check_lang(lang):
    if lang in SECOND_LANG_MAPPING.keys():
        lang = SECOND_LANG_MAPPING[lang][1]
    return lang

def remove_row(temp_df):
    if temp_df is not None and len(temp_df)>0:
        temp_df = temp_df[temp_df['conf']>50]
    return temp_df
def ocr_cond(lang,image_crop,lang2,psm):
    temp_df = pytesseract.image_to_data(image_crop,config='--psm '+str(psm), lang=lang+"+"+lang2  ,output_type=Output.DATAFRAME)
    temp_df = temp_df[temp_df.text.notnull()]
    temp_df = temp_df.reset_index()
    temp_df = remove_row(temp_df)
    temp_df = temp_df.reset_index()
    return temp_df
    
def check_text_df(temp_df,image_crop,lang,lang2):
    try:

        tmp_df = temp_df
        temp_df = temp_df[temp_df.text.notnull()]
        temp_df = remove_row(temp_df)
        temp_df = temp_df.reset_index()
        if temp_df is None or len(temp_df)==0:
            temp_df = ocr_cond(lang,image_crop,lang2,8)
        if temp_df is None or len(temp_df)==0:
            temp_df = ocr_cond(lang2,image_crop,lang,7)
        if temp_df is None or len(temp_df)==0:
            temp_df = ocr_cond(lang2,image_crop,lang,8)
        if (temp_df is not None and len(temp_df)==1 and temp_df['conf'][0]<50) or len(temp_df)==0:
            temp_df = ocr_cond(lang,image_crop,lang2,8)
        if (temp_df is not None and len(temp_df)==1 and temp_df['conf'][0]<50) or len(temp_df)==0:
            temp_df = ocr_cond(lang,image_crop,lang2,7)
        if (temp_df is not None and len(temp_df)==1 and temp_df['conf'][0]<50) or len(temp_df)==0:
            temp_df = ocr_cond(lang2,image_crop,lang,8)
        if (temp_df is not None and len(temp_df)==1 and temp_df['conf'][0]<50) or len(temp_df)==0:
            temp_df = ocr_cond(lang2,image_crop,lang,7)
        if (temp_df is not None and len(temp_df)==1 and temp_df['conf'][0]<50) or len(temp_df)==0:
            temp_df = ocr_cond(lang2,image_crop,lang,6)
        if len(temp_df)==0:
            temp_df = tmp_df
        return temp_df
    except:
        return temp_df
    

def get_tess_text(image_crop,lang,left,top,c_x,c_y):  
    lang2 = check_lang(lang)
    if config.CROP_SAVE:
        img_id = config.CROP_SAVE_PATH+str(uuid.uuid4())+".jpg"
        cv2.imwrite(img_id,image_crop)
    dfs = pytesseract.image_to_data(image_crop,config='--psm 7',lang=lang+"+"+lang2,output_type=Output.DATAFRAME)
    dfs = check_text_df(dfs,image_crop,lang,lang2)
    text = process_dfs(dfs)
    #print("text",text)

    return text
def process_dfs(temp_df):
    temp_df = temp_df[temp_df.text.notnull()]
    line_text = ""
    for index, row in temp_df.iterrows():
        line_text= line_text+" "+str(row['text'])
        
    return line_text
def get_box(bbox):
    temp_box = []
    temp_box.append([bbox["boundingBox"]['vertices'][0]['x'],bbox["boundingBox"]['vertices'][0]['y']])
    temp_box.append([bbox["boundingBox"]['vertices'][1]['x'],bbox["boundingBox"]['vertices'][1]['y']])
    temp_box.append([bbox["boundingBox"]['vertices'][2]['x'],bbox["boundingBox"]['vertices'][2]['y']])
    temp_box.append([bbox["boundingBox"]['vertices'][3]['x'],bbox["boundingBox"]['vertices'][3]['y']])

    temp_box = np.array(temp_box)
    return temp_box

def get_crop_with_pers_transform(image, box, height=140):
    
    w = max(abs(box[0, 0] - box[1, 0]),abs(box[2, 0] - box[3, 0]))
    height = max(abs(box[0, 1] - box[3, 1]),abs(box[1, 1] - box[2, 1]))
    pts1 = np.float32(box)
    pts2 = np.float32([[0, 0], [int(w), 0],[int(w),int(height)],[0,int(height)]])
    M = cv2.getPerspectiveTransform(pts1, pts2)
    result_img = cv2.warpPerspective(image,M,(int(w), int(height))) #flags=cv2.INTER_NEAREST
    return result_img
