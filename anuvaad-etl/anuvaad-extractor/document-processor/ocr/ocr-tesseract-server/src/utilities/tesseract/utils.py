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


def scale_coords(page_lines,image_shape,page_resolution):
    x_ratio = image_shape[1]/page_resolution[1] 
    y_ratio = image_shape[0]/page_resolution[0]
    for line_idx,coord in enumerate(page_lines):
        region = []
        for point in coord['boundingBox']['vertices']:
            region.append({ 'x' : int(point['x'] * x_ratio), 'y': int(point['y'] * y_ratio) })
        page_lines[line_idx]['boundingBox']['vertices'] = region
    return page_lines 

	
def frequent_height(coords):

    text_height = []
    if len(coords) > 0 :
        for box in coords:
            text_height.append(abs(box['boundingBox']['vertices'][0]['y'] -box['boundingBox']['vertices'][3]['y'] ))
        return statistics.median(text_height)
    else :
        return  0
def check_text_df(temp_df,image_crop,lang, median_height,psm,detected_lang):

    lang = language_filter(lang,detected_lang,double_ocr=True)
    temp_df = temp_df[temp_df.text.notnull()]
    temp_df = temp_df.reset_index()
    if temp_df is None or len(temp_df)==0:
        temp_df = pytesseract.image_to_data(image_crop,config='--psm '+str(psm), lang=lang  ,output_type=Output.DATAFRAME)
    temp_df = temp_df[temp_df.text.notnull()]
    temp_df = temp_df.reset_index()  
    if temp_df is not None and len(temp_df)==1:
        if 'text' in temp_df.keys() and isinstance(temp_df['text'][0], float):
            temp_df["text"] = temp_df.text.astype(str)
            text = pytesseract.image_to_string(image_crop,config='--psm 8', lang=lang)
            temp_df['text'][0] = text
        if 'text' in temp_df.keys() and temp_df['conf'][0]<config.DOUBLE_OCR_THRESHOLD:
            temp_df = pytesseract.image_to_data(image_crop,config='--psm 8', lang=lang,output_type=Output.DATAFRAME)
            temp_df = temp_df[temp_df.text.notnull()]
            temp_df = temp_df.reset_index()
            if temp_df is not None and len(temp_df)>0 and  isinstance(temp_df['text'][0], float):
                temp_df["text"] = temp_df.text.astype(str)
                text = pytesseract.image_to_string(image_crop,config='--psm 8', lang=lang)
                temp_df['text'][0] = text

    return temp_df

def pdf_language_detect(page_file,lang):
    try :
        osd = pytesseract.image_to_osd(page_file)
        language_script = osd.split('\nScript')[1][2:]
        return language_script
    except :
        return config.LANG_MAPPING[lang][0]

def page_lang_detection(page_path,lang):
    print('Detecting language ...')
    lang_detected = pdf_language_detect(page_path,lang)
    print('language detected is {}'.format(lang_detected))
    weight_path = '/usr/share/tesseract-ocr/4.00/tessdata/' + lang_detected + '.traineddata'
    if not os.path.exists(weight_path):
        print('Downloading detected language ...')
        download = 'curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/' + lang_detected \
                   + '.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/script/' + lang_detected + '.traineddata'
        os.system(download)
        print('Successfully downloaded detected language ...')
    return lang_detected

def language_filter(org_lang,detected_lang,double_ocr=False):
    if double_ocr:
        map_org_lang = config.LANG_MAPPING[org_lang][0]
    else:
        map_org_lang = config.LANG_MAPPING[org_lang][1]
    map_detect_lang = config.DETECT_LANG_MAPPING[detected_lang][0]
    if map_org_lang == map_detect_lang:
        lang = map_org_lang
    else:
        lang = map_detect_lang+"+" +map_org_lang
    return lang

def adjust_crop_coord(coord,cls,reg_left,reg_right):
    if validate_region(coord):
        c_x = config.C_X; c_y=config.C_Y; box = get_box(coord)
        #if abs(reg_left-reg_right)>abs(box[0][0]-box[1][0])*1.2:
        reg_left = box[0][0];  reg_right = box[1][0]
        if cls=="CELL":
            c_x = 10; c_y=5;reg_left = box[0][0]; reg_right=box[1][0]
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

def get_tess_text(image_crop,org_lang, median_height,left,top,cls,c_x,c_y,lang_detected):
    lang = language_filter(org_lang,lang_detected)    
    crop_height = image_crop.shape[0]
    height_check = median_height * 1.5
    if cls in ['CELL']:
        height_check = median_height*1.2
    if crop_height > height_check :
        dfs = pytesseract.image_to_data(image_crop,config='--psm 6', lang=lang  ,output_type=Output.DATAFRAME)
        dfs = check_text_df(dfs,image_crop,org_lang, median_height,6,lang_detected)
        words  = process_dfs(dfs,left,top,lang,c_x,c_y)
        return words      
    else:
        dfs = pytesseract.image_to_data(image_crop,config='--psm '+str(config.PSM), lang=lang,output_type=Output.DATAFRAME)
        dfs = check_text_df(dfs,image_crop,org_lang, median_height,config.PSM,lang_detected)
        words  = process_dfs(dfs,left,top,lang,c_x,c_y)

    return words

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


def process_dfs(temp_df,left,top,lang,c_x,c_y):
    temp_df = temp_df[temp_df.text.notnull()]
    words = []
    for index, row in temp_df.iterrows():
        temp_dict1 = {}
        vert=[]
        vert.append({'x':int(row["left"]+left-abs(c_x)),'y':row["top"]+top-c_y})
        vert.append({'x':int(row["left"]+left+abs(c_x))+int(row["width"]),'y':row["top"]+top-c_y})
        vert.append({'x':int(row["left"]+left+abs(c_x))+int(row["width"]),'y':row["top"]+top+int(row["height"])+c_y})
        vert.append({'x':int(row["left"]+left-abs(c_x)),'y':row["top"]+top+int(row["height"])+c_y})
        temp_dict1['identifier'] = str(uuid.uuid4())
        temp_dict1["text"]= row['text']
        temp_dict1["conf"]= row['conf']
        temp_dict1["language"]= lang
        temp_dict1['boundingBox']={}
        temp_dict1['font']={'family': 'Arial Unicode MS', 'size': int(row["height"]), 'style': 'REGULAR'}
        temp_dict1['boundingBox']["vertices"] = vert
        words.append(temp_dict1)
    return words