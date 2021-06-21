/tess_train_data_prep/reports/hindi/


import os
import config
import numpy as np
import cv2
import uuid 
import base64
#from src.utilities.utils import load_json
from src.services.ocr_request import InitRequest
from  src.services.inpaint import heal_image,get_words


def get_text_from_image(image,lang):
    im_bytes = base64.b64decode(image['base64'])
    im_arr = np.frombuffer(im_bytes, dtype=np.uint8)
    img = cv2.imdecode(im_arr, flags=cv2.IMREAD_COLOR)
    image_name = str(uuid.uuid4()) + '.png'
    cv2.imwrite(os.path.join(config.BASE_DIR,image_name),img)
    #image_name =  upload_file(os.path.join(config.BASE_DIR,image_name),auth_token)['data']
    ocr_response = InitRequest(image_name,'png',config.auth_token,lang)
    #ocr_response = load_json(json_path)
    image_path = os.path.join(config.BASE_DIR,image_name)
    return ocr_response, image_path

  
def get_inpainted_imgage(image_path, text_boxes):
    if 'rsp' in text_boxes.keys():
        words = get_words(text_boxes['rsp'],0)
    else:
        words = get_words(text_boxes,0)
    return heal_image(image_path,words)
    
    
def convert_to_resp(healed_image,text,image):
    img = image.copy()
    img['base64'] = base64.b64encode(cv2.imencode('.png', healed_image)[1]).decode('ascii') 
    img['attrib'] = 'INIMAGE'
    img['image_id'] = uuid.uuid4().hex
    
    if 'rsp' in text.keys():
        regions  = text['rsp']['outputs'][0]['pages'][0]['regions']
    else:
        regions = text['outputs'][0]['pages'][0]['regions']
        
    bm_text_regions = []
    
    for region in regions:
        text_block = region_adaptor(region,img['image_id'])
        if text_block is not None:
            bm_text_regions.append(text_block)
    return img, bm_text_regions
    
    
 
def region_adaptor(region,image_id):
    
    if region is not None and 'regions' in region.keys():
        if len(region['regions']) > 0 and 'regions' in region['regions'][0].keys():
            if len(region['regions'][0]['regions']) > 0 :
                avg_font_size      = region['regions'][0]['regions'][0]['font']['avg_size']

                lines = region['regions']
                for line_index,line in enumerate(lines):
                    lines[line_index]['text'] = collate_text(line['regions'])
                    for word_index, word in enumerate(line['regions']):
                        line['regions'][word_index] = moprh_region(word,avg_font_size)
                    lines[line_index]  = moprh_region(line,avg_font_size)
                    
                region['text'] = collate_text(lines)
                m_region   = moprh_region(region,avg_font_size)
                m_region['attrib'] = 'INIMAGE'
                m_region['block_id']  = image_id

                return m_region
    return None
        

def moprh_region(region,font_size):
    top,left,height,width = get_bounds(region['boundingBox'])
    m_region = {'text_top' : top , 'text_left' : left , 'text_height':height ,'text_width':width}
    m_region['text'] = region['text']
    
    m_region['font_color']      =  '#000000'
    m_region['font_family']     =  "Arial Unicode MS"
    m_region['font_size']       =  font_size
    m_region['avg_line_height'] =  font_size 
    
    m_region['attrib']      =  None 
    m_region['block_id']    = uuid.uuid4().hex
    
    if region['class'] == 'WORD' :
        region.pop('regions')
    
    if 'regions' in region.keys() :
        m_region['children']  = region['regions']

    return m_region


def collate_text(regions):
    text = ''
    for region in regions:
        try:
            text = text + ' ' + region['text']
        except:
            pass
    if len(text) > 0 :
        return edit_google_text(text[1:])
    return text

    

def edit_google_text(s):
    s1=s
    try:
        i=0
        while(i<len(s)):
            s1=s
            if s[i] in ["/","।",'।' ,':','|',"," ,'०',"]","-",")","}"] and s[i-1]==" ":    
                s=s[:i-1]+s[i:]
                if i > 0 :
                    if s[i-1] in ["-","[","{","/","("] and s[i]==" ":
                        s=s[:i]+s[i+1:]
            elif s[i] in ["-","[","{","/","("] and s[i+1]==" ":
                s=s[:i+1]+s[i+2:]
            i=i+1
    except:
        print("ERROR IN GOOGLE CORRECTION")
        return s1
    return s
 

    
def get_bounds(bbox):
    points = bbox['vertices']
    #top , left, height, width
    return points[0]['y'] , points[0]['x'] ,  abs(points[2]['y'] - points[0]['y']),  points[1]['x'] - points[0]['x']


    
    
    