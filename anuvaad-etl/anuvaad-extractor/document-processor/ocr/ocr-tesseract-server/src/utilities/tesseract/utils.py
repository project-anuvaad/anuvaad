import cv2
import config
import numpy as np
import uuid
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


def crop_region(coord,image):
    try:
        if validate_region(coord):
            vertices = coord['boundingBox']['vertices']
            if config.PERSPECTIVE_TRANSFORM:
                box = get_box(coord)
                crop_image = get_crop_with_pers_transform(image, box, height=abs(box[0,1]-box[2,1]))
            else :
                crop_image = image[min(vertices[0]['y'],vertices[2]['y'])) : max(vertices[2]['y'],vertices[0]['y']) , min(vertices[0]['x'],vertices[2]['x']) : max(vertices[2]['x'],vertices[0]['x'])]

            return crop_image
        else :
            log_exception("Error in region region  due to invalid coordinates",  app_context.application_context, coord)
            return None
    except Exception as e:
        log_exception("Error in region region  due to invalid coordinates",  app_context.application_context, e)
        return None


def get_tess_text(image_crop,lang, median_height,left,top):

    crop_height = image_crop.shape[0]
    lang = config.LANG_MAPPING[lang][1]
    if crop_height > median_height * 1.5 :

        #experiment with FALL_BACK_LANGUAGE as orignal and trained
        if config.FALL_BACK_LANGUAGE is not None:
            fall_back_lang = config.FALL_BACK_LANGUAGE
        else:
            fall_back_lang = lang
        dfs = pytesseract.image_to_data(image_crop,config='--psm 6', lang=fall_back_lang  ,output_type=Output.DATAFRAME)
        words  = process_dfs(dfs,left,top,lang)
        return words      
    else:
        dfs = pytesseract.image_to_data(image_crop,config='--psm '+str(config.PSM), lang=lang,output_type=Output.DATAFRAME)
        words  = process_dfs(dfs,left,top,lang)

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

def process_dfs(temp_df,left,top,lang):
    temp_df = temp_df[temp_df.text.notnull()]
    words = []
    for index, row in temp_df.iterrows():
        temp_dict1 = {}
        vert=[]
        vert.append({'x':int(row["left"]+left),'y':row["top"]+top})
        vert.append({'x':int(row["left"]+left)+int(row["width"]),'y':row["top"]+top})
        vert.append({'x':int(row["left"]+left)+int(row["width"]),'y':row["top"]+top+int(row["height"])})
        vert.append({'x':int(row["left"]+left),'y':row["top"]+top+int(row["height"])})
        temp_dict1['identifier'] = str(uuid.uuid4())
        temp_dict1["text"]= row['text']
        temp_dict1["conf"]= row['conf']
        temp_dict1["language"]= lang
        temp_dict1['boundingBox']={}
        temp_dict1['boundingBox']["vertices"] = vert
        words.append(temp_dict1)
    return words