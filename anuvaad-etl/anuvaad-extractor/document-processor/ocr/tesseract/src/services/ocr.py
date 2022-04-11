import config
from config import CROP_CONFIG, LANG_MAPPING
from pytesseract import Output
from pytesseract import pytesseract
from anuvaad_auditor.loghandler import log_error
import src.utilities.app_context as app_context

from collections import Counter
from src.services.dynamic_adjustment import coord_adjustment
import cv2
from src.utilities.remove_water_mark import clean_image
import uuid,copy
#from PIL import Image

def ocr(crop_image,configs,left,top,language):
    if configs:
        #temp_df = pytesseract.image_to_data(crop_image,config='--psm 7', lang=LANG_MAPPING[language][0],output_type=Output.DATAFRAME)
        temp_df = pytesseract.image_to_data(crop_image,  lang=language,config='--psm 7',
                                            output_type=Output.DATAFRAME) #config='--psm 7',
    else:
        #temp_df = pytesseract.image_to_data(crop_image, lang= LANG_MAPPING[language][0],output_type=Output.DATAFRAME)
        temp_df = pytesseract.image_to_data(crop_image, lang=language,output_type=Output.DATAFRAME)
    temp_df = temp_df[temp_df.text.notnull()]
    text = ""
    coord  = []
    #print("kkkkkkkkkkkkkkkkkkkkkkkkkkkkk",temp_df)
    for index, row in temp_df.iterrows():
        temp_dict = {}; vert=[]
        temp_dict['identifier'] = str(uuid.uuid4())
        vert.append({'x':int(row["left"]+left),'y':row["top"]+top})
        vert.append({'x':int(row["left"]+left)+int(row["width"]),'y':row["top"]+top})
        vert.append({'x':int(row["left"]+left)+int(row["width"]),'y':row["top"]+top+int(row["height"])})
        vert.append({'x':int(row["left"]+left),'y':row["top"]+top+int(row["height"])})
        #temp_dict['text'] = str(row["text"])
        
        temp_dict['text']   = process_text(row['text'])
        temp_dict['conf'] = row["conf"]
        temp_dict['boundingBox']={}
        temp_dict['boundingBox']["vertices"] = vert
        if text == '':
            text = temp_dict['text']
        else :
            text = text +" "+ temp_dict['text']
        coord.append(temp_dict)
    return coord, text


# def process_text(text):
#     try:
#         if type(text) in [int, float]:
#             if int(text)== text :
#                 return str(int(text))
#             else:
#                 return str(text)
#         else :
#             return str(text)
#     except Exception as e:
#         print(e)
#         return str(text)
    
    
    
 
def process_text(text):
    try:
        f_text = float(text)
        if f_text == int(f_text) :
            return str(int(f_text))
        else:
            return str(text)
    except Exception as e:
        #print(e)
        return str(text)

def bound_coordinate(corrdinate,max):
    if corrdinate < 0 :
        corrdinate = 0
    if corrdinate > max:
        corrdinate = max - 2
    return int(corrdinate)

def get_text(path,coord,lang,width, height,freq_height,level):
    #image   = cv2.imread("/home/naresh/anuvaad/anuvaad-etl/anuvaad-extractor/document-processor/ocr/tesseract/"+path,0)


    image   = cv2.imread(path,0)
    #h_ratio = image.size[1]/height
    #w_ratio = image.size[0]/width
    #left   = int(coord[0]*w_ratio);  top    = int(coord[1]*h_ratio)
    #right  = int(coord[2]*w_ratio);  bottom = int(coord[3]*h_ratio)

    left = bound_coordinate(coord[0] , width)
    top = bound_coordinate(coord[1],height )
    right = bound_coordinate(coord[2] ,width)
    bottom = bound_coordinate(coord[3] , height)
    region_width = abs(right-left)
    region_height = abs(bottom-top)

    #crop_image = image.crop((left-CROP_CONFIG[lang]['left'], top-CROP_CONFIG[lang]['top'], right+CROP_CONFIG[lang]['right'], bottom+CROP_CONFIG[lang]['bottom']))
    if left==right==top==bottom==0 or region_width==0 or region_height==0:
        return [],[]
    #print(top,bottom,left,right ,'cooooooords')
    try :

        crop_image = image[ top:bottom, left:right]
        #if level['class']=="CELL":
        #cv2.imwrite("/home/naresh/line_crop2/"+str(uuid.uuid4()) + '.jpg',crop_image)
        #crop_image.save("/home/naresh/line_crop/"+str(uuid.uuid4()) + '.jpg')
        if abs(bottom-top) > 2*freq_height:
            coord, text = ocr(crop_image,False,left,top,lang)
            #print("xxxxxxxxxxxxxxxxxxxxxxxx",text)
            #temp_df = pytesseract.image_to_data(crop_image, lang= LANG_MAPPING[lang][0],output_type=Output.DATAFRAME)
        else:
            coord, text = ocr(crop_image,True,left,top,lang)
            if len(text)==0:
                coord,text = ocr(crop_image,False,left,top,lang)
            #temp_df = pytesseract.image_to_data(crop_image,config='--psm 7', lang=LANG_MAPPING[lang][0],output_type=Output.DATAFRAME)
        #text, coord = ocr(temp_df,left,top)
        #print("kkkkkkkkkkkkkkkkkk",text)
        return text, coord

    except Exception as e :
        log_error('Error in ocr' + str(e), app_context.application_context, e)
        return None,None



def get_coord(bbox):
    temp_box = []
    if 'class' in bbox.keys() and bbox['class'] in ['TEXT','TABLE','CELL']:
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
            text, tess_coord = get_text(page_path, coord, lang, width, height,mode_height,level)
            region_org[idx]['text'] = text
            region_org[idx]['regions'] = tess_coord
            #print("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
            #region_org[idx]['tess_word_coords'] = tess_coord

        else:
            
            region_org[idx]['text'] = ""
            region_org[idx]['regions'] =[]
            #region_org[idx]['tess_word_coords'] = []
    
    
    return region_org

def end_point_correction(region, margin, ymax,xmax):
    # check if after adding margin the endopints are still inside the image
    x = region["boundingBox"]['vertices'][0]['x']; y = region["boundingBox"]['vertices'][0]['y']
    w = abs(region["boundingBox"]['vertices'][0]['x']-region["boundingBox"]['vertices'][1]['x'])
    h = abs(region["boundingBox"]['vertices'][0]['y']-region["boundingBox"]['vertices'][2]['y'])
    if (y - margin) < 0:
        ystart = 0
    else:
        ystart = y - margin
    if (y + h + margin) > ymax:
        yend = ymax
    else:
        yend = y + h + margin
    if (x - margin) < 0:
        xstart = 0
    else:
        xstart = x - margin
    if (x + w + margin) > xmax:
        xend = xmax
    else:
        xend = x + w + margin
    return int(ystart), int(yend), int(xstart), int(xend)


def mask_image(path, page_regions,page_index,file_properties,image_width,image_height,margin= 0 ,fill=255):
    try:
        image   = cv2.imread(path)
        #image   = cv2.imread("/home/naresh/anuvaad/anuvaad-etl/anuvaad-extractor/document-processor/ocr/tesseract/"+path)
        #image    = copy.deepcopy(image2)
        #bg_image   = clean_image(image2)
        for region_idx, page_region in enumerate(page_regions):
            region_class = page_region['class']
            if region_class not in ["IMAGE","LINE"]:
                region_lines = file_properties.get_region_lines(page_index,region_idx)
                if region_lines!=None:
                    for line_index, line in enumerate(region_lines):
                        region_words = file_properties.get_region_words(page_index,region_idx,line_index)
                        if region_words!=None:
                            #if config.IS_DYNAMIC:
                            #    region_words = coord_adjustment(path, region_words)
                            for region in region_words:
                                row_top, row_bottom,row_left,row_right = end_point_correction(region, 2,image_height,image_width)
                                
                                if len(image.shape) == 2 :
                                    image[row_top - margin : row_bottom + margin , row_left - margin: row_right + margin] = fill
                                if len(image.shape) == 3 :
                                    image[row_top - margin: row_bottom + margin, row_left - margin: row_right + margin,:] = fill
                                
        if '.jpg' in path:
            save_path = path.split('.jpg')[0]+"_bgimages_"+'.jpg'
        elif '.png' in path:
            save_path = path.split('.png')[0]+"_bgimages_"+'.png'
        else:
            save_path = path.split('.')[0]+"_bgimages_"+'.jpg'

        cv2.imwrite(save_path,image)
        return save_path
    
    
    except Exception as e :
        print('Service Tesseract Error in masking out image {}'.format(e))
        return None
        


def merge_text(v_blocks,merge_tess_confidence=False):
    for block_index, v_block in enumerate(v_blocks):
        #try:
        v_blocks[block_index]['font']    ={'family':'Arial Unicode MS', 'size':0, 'style':'REGULAR'}
        #v_blocks[block_index]['font']['size'] = max(v_block['children'], key=lambda x: x['font']['size'])['font']['size']
        if "regions" in v_block.keys() and len(v_block['regions']) > 0 :
            v_blocks[block_index]['text'] = v_block['regions'][0]['text']
            if merge_tess_confidence:
                try:
                    v_blocks[block_index]['tess_word_coords'] =  v_block['regions'][0]['tess_word_coords']
                except:
                    print('error in adding tess confidence score_1')
            if "regions" in v_block.keys() and len(v_block['regions']) > 1:
                for child in range(1, len(v_block['regions'])):
                    if merge_tess_confidence :
                        try:
                            v_blocks[block_index]['tess_word_coords'] += v_block['regions'][child]['tess_word_coords']
                        except:
                            print('error in adding tess confidence score')
                    v_blocks[block_index]['text'] += ' ' + str(v_block['regions'][child]['text'])
        #print('text merged')
        #except Exception as e:
        #    print('Error in merging text {}'.format(e))

    return v_blocks
