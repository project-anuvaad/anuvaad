import config
from config import CROP_CONFIG
from pytesseract import Output
from pytesseract import pytesseract
from collections import Counter
#from PIL import Image
import cv2
import uuid

# def ocr(temp_df,left,top):
#     temp_df = temp_df[temp_df.text.notnull()]
#     text = ""
#     coord = []
#     for index1, row1 in temp_df.iterrows():
#         word_coord = {}
#         temp_text  = str(row1["text"])
#         temp_conf  = row1["conf"]
#         text = text +" "+ str(temp_text)
#         word_coord['text']          = str(temp_text)
#         word_coord['conf']          = temp_conf
#         word_coord['text_left']     = int(row1["left"]+left)
#         word_coord['text_top']      = int(row1["top"]+top)
#         word_coord['text_width']    = int(row1["width"])
#         word_coord['text_height']   = int(row1["height"])
#         coord.append(word_coord)
#     return text, coord

def ocr(crop_image,configs,left,top,language):
    if configs:
        #temp_df = pytesseract.image_to_data(crop_image,config='--psm 7', lang=LANG_MAPPING[language][0],output_type=Output.DATAFRAME)
        temp_df = pytesseract.image_to_data(crop_image, config='--psm 7', lang=language,
                                            output_type=Output.DATAFRAME)
    else:
        #temp_df = pytesseract.image_to_data(crop_image, lang= LANG_MAPPING[language][0],output_type=Output.DATAFRAME)
        temp_df = pytesseract.image_to_data(crop_image, lang= language,output_type=Output.DATAFRAME)
    temp_df = temp_df[temp_df.text.notnull()]
    text = ""
    coord  = []
    
    for index, row in temp_df.iterrows():
        temp_dict = {}; vert=[]
        temp_dict['identifier'] = str(uuid.uuid4())
        vert.append({'x':int(row["left"]+left),'y':row["top"]+top})
        vert.append({'x':int(row["left"]+left)+int(row["width"]),'y':row["top"]+top})
        vert.append({'x':int(row["left"]+left)+int(row["width"]),'y':row["top"]+top+int(row["height"])})
        vert.append({'x':int(row["left"]+left),'y':row["top"]+top+int(row["height"])})
        temp_dict['text'] = str(row["text"])
        temp_dict['conf'] = row["conf"]
        temp_dict['boundingBox']={}
        temp_dict['boundingBox']["vertices"] = vert
        text = text +" "+ str(row["text"])
        coord.append(temp_dict)
    return coord, text


def bound_coordinate(corrdinate,max):
    if corrdinate < 0 :
        corrdinate = 0
    if corrdinate > max:
        corrdinate = max
    return int(corrdinate)

def get_text(path,coord,lang,width, height,freq_height):
    image   = cv2.imread(path,0)
    #h_ratio = image.size[1]/height
    #w_ratio = image.size[0]/width
    #left   = int(coord[0]*w_ratio);  top    = int(coord[1]*h_ratio)
    #right  = int(coord[2]*w_ratio);  bottom = int(coord[3]*h_ratio)

    left = bound_coordinate(coord[0] , width)
    top = bound_coordinate(coord[1],height )
    right = bound_coordinate(coord[2] ,width)
    bottom = bound_coordinate(coord[3] , height)

    #crop_image = image.crop((left-CROP_CONFIG[lang]['left'], top-CROP_CONFIG[lang]['top'], right+CROP_CONFIG[lang]['right'], bottom+CROP_CONFIG[lang]['bottom']))
    if left==right==top==bottom==0:
        return None,None
    crop_image = image[ top:bottom, left:right]
    
    #crop_image.save("/home/naresh/line_crop_adjustment/"+str(uuid.uuid4()) + '.jpg')
    #crop_image.save("/home/naresh/line_crop/"+str(uuid.uuid4()) + '.jpg')
    if abs(bottom-top) > 2*freq_height:
        coord, text = ocr(crop_image,False,left,top,lang)
        #temp_df = pytesseract.image_to_data(crop_image, lang= LANG_MAPPING[lang][0],output_type=Output.DATAFRAME)
    else:
        coord, text = ocr(crop_image,True,left,top,lang)
        if len(text)==0:
            coord,text = ocr(crop_image,False,left,top,lang)
        #temp_df = pytesseract.image_to_data(crop_image,config='--psm 7', lang=LANG_MAPPING[lang][0],output_type=Output.DATAFRAME)
    #text, coord = ocr(temp_df,left,top)
    return text, coord

def get_coord(bbox):
    temp_box = []
    if 'class' in bbox.keys() and bbox['class'] in ['TEXT','TABLE']:
        temp_box.append(bbox["boundingBox"]['vertices'][0]['x'])
        temp_box.append(bbox["boundingBox"]['vertices'][0]['y'])
        temp_box.append(bbox["boundingBox"]['vertices'][2]['x'])
        temp_box.append(bbox["boundingBox"]['vertices'][2]['y'])


        
    return temp_box

def frequent_height(page_info):
    text_height = []
    if len(page_info) > 0 :
        for idx, level in enumerate(page_info):
            coord = get_coord(level)
            if len(coord)!=0:
                text_height.append(abs(coord[3]-coord[1]))
        occurence_count = Counter(text_height)
        return occurence_count.most_common(1)[0][0]
    else :
        return  0
def text_extraction(lang, page_path, regions,region_org,width, height,mode_height):

    #freq_height = frequent_height(regions)
    for idx, level in enumerate(regions):
        coord = get_coord(level)
        if len(coord)!=0 and abs(coord[3] - coord[1]) > config.REJECT_FILTER :
            text, tess_coord = get_text(page_path, coord, lang, width, height,mode_height)
            region_org[idx]['text'] = text
            region_org[idx]['tess_word_coords'] = tess_coord

        else:
            region_org[idx]['text'] = None
            region_org[idx]['tess_word_coords'] = None

    return region_org




def merge_text(v_blocks,merge_tess_confidence=False):
    for block_index, v_block in enumerate(v_blocks):
        #try:
        v_blocks[block_index]['font']    ={'family':'Arial Unicode MS', 'size':0, 'style':'REGULAR'}
        #v_blocks[block_index]['font']['size'] = max(v_block['children'], key=lambda x: x['font']['size'])['font']['size']
        if "children" in v_block.keys() and len(v_block['children']) > 0 :
            v_blocks[block_index]['text'] = v_block['children'][0]['text']
            if merge_tess_confidence:
                try:
                    v_blocks[block_index]['tess_word_coords'] =  v_block['children'][0]['tess_word_coords']
                except:
                    print('error in adding tess confidence score_1')
            if "children" in v_block.keys() and len(v_block['children']) > 1:
                for child in range(1, len(v_block['children'])):
                    if merge_tess_confidence :
                        try:
                            v_blocks[block_index]['tess_word_coords'] += v_block['children'][child]['tess_word_coords']
                        except:
                            print('error in adding tess confidence score')
                    v_blocks[block_index]['text'] += ' ' + str(v_block['children'][child]['text'])
        #print('text merged')
        #except Exception as e:
        #    print('Error in merging text {}'.format(e))

    return v_blocks
