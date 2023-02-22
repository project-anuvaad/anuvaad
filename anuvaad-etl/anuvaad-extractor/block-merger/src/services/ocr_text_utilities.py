import time
import numpy as np
from config import CROP_CONFIG
from PIL import Image
from pytesseract import Output
from  config import LANG_MAPPING
from pytesseract import pytesseract
import uuid
import json
import cv2
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
import src.utilities.app_context as app_context
from anuvaad_auditor.loghandler import log_exception


def ocr(crop_image,configs,left,top,language):
    if configs:
        temp_df = pytesseract.image_to_data(crop_image,config='--psm 8', lang=LANG_MAPPING[language][0],output_type=Output.DATAFRAME)
    else:
        temp_df = pytesseract.image_to_data(crop_image, lang= LANG_MAPPING[language][0],output_type=Output.DATAFRAME)
    temp_df = temp_df[temp_df.text.notnull()]
    text = ""
    coord  = []
    
    for index, row in temp_df.iterrows():
        word_coord = {}
        temp_text  = process_text(row["text"])
        temp_conf  = row["conf"]
        if text == '':
            text = temp_text
        else:
            text = text +" "+ str(temp_text)
        word_coord['text']          = str(temp_text)
        word_coord['conf']          = temp_conf
        word_coord['text_left']     = int(row["left"]+left)
        word_coord['text_top']      = int(row["top"]+top)
        word_coord['text_width']    = int(row["width"])
        word_coord['text_height']   = int(row["height"])
        coord.append(word_coord)
    return coord, text




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



def extract_text_from_image(filepath, desired_width, desired_height, df, lang):
    #image   = Image.open(filepath)
    #h_ratio = image.size[1] / desired_height
    #w_ratio = image.size[0] / desired_width
    for idx in range(len(desired_width)):
        image = cv2.imread(filepath)
        h_ratio = image.shape[0]/desired_height[idx]
        w_ratio = image.shape[1]/desired_width[idx]
        word_coord_lis = []
        text_list = []

        check ={"devnagari_text:":[],"original":[]}
        try :
            for index, row in df.iterrows():
                left   = row['text_left']*w_ratio
                top    = row['text_top']*h_ratio
                right  = (row['text_left'] + row['text_width'])*w_ratio
                bottom = (row['text_top'] + row['text_height'])*h_ratio
                coord  = []
                #crop_image = image.crop((left-CROP_CONFIG[lang]['left'], top-CROP_CONFIG[lang]['top'], right+CROP_CONFIG[lang]['right'], bottom+CROP_CONFIG[lang]['bottom']))
                #print(left,top,right,bottom, 'ddddddddddddddddddddddddddd',image.shape)
                updated_top, updated_bottom, updated_left, update_right = corrds_correction(top,left,right,bottom,image.shape,lang)
                #print(updated_top, updated_bottom, updated_left, update_right, 'ddddddddddddddddddddddddddd', image.shape)
                if  (updated_bottom -updated_top >0 ) and (update_right -updated_left > 0) :
                    crop_image = image[updated_top:updated_bottom, updated_left:update_right]
                    #cv2.imwrite("/home/dhiraj/tmp/"+str(uuid.uuid4())+"_____"+str(index) + '.jpg',crop_image)
                    if row['text_height']>2*row['font_size']:
                        coord,text = ocr(crop_image,False,left,top,lang)
                        # word_coord_lis.append(coord)
                        # text_list.append(text)
                    else:
                        coord,text = ocr(crop_image,True,left,top,lang)
                        if len(text)==0:
                            coord,text = ocr(crop_image,False,left,top,lang)

                else :
                    text = ''
                word_coord_lis.append(coord)
                text_list.append(text)

            df['word_coords'] = word_coord_lis
            df['text']        = text_list
            return df
        except Exception as e:
            log_exception("Error in tesseract ocr extraction " + str(e), app_context.application_context, e)
            return None


def corrds_correction(top,left, right,bottom,shape,lang):

    def correction_helper(point,max,):
        if point < 0 :
            return 1
        else:
            if  point > max :
                return int(max -1)
            else:
                return int(point)

    updated_top = correction_helper(top - CROP_CONFIG[lang]['top'] ,shape[0])
    updated_bottom = correction_helper(bottom + CROP_CONFIG[lang]['bottom'] ,shape[0] )
    updated_left  = correction_helper(left - CROP_CONFIG[lang]['left'],shape[1])
    update_right   = correction_helper(right + CROP_CONFIG[lang]['right'] ,shape[1])

    return updated_top,updated_bottom,updated_left,update_right







def low_conf_ocr(lang,left,top,width,height,image):
    crop_image = image.crop((left-5, top-7, left+width+5, top+height+7))
    #crop_image.save("/home/naresh/check/"+str(uuid.uuid4())+'.jpg')
    temp_df_eng = pytesseract.image_to_data(crop_image,config='--psm 6', lang= LANG_MAPPING[lang][2],output_type=Output.DATAFRAME)
    temp_df_hin = pytesseract.image_to_data(crop_image, config='--psm 6',lang= LANG_MAPPING[lang][0],output_type=Output.DATAFRAME)
    eng_index = temp_df_eng['conf'].argmax()
    hin_index = temp_df_hin['conf'].argmax()
    eng_conf  = temp_df_eng['conf'][eng_index]
    hin_conf  = temp_df_hin['conf'][hin_index]
    if eng_conf>=hin_conf:
        conf = eng_conf
        text = temp_df_eng['text'][eng_index]
    else:
        conf = hin_conf
        text = temp_df_hin['text'][hin_index]


    return text, conf


def tesseract_ocr(pdf_data,flags ):

    pdf_image_paths = pdf_data['pdf_image_paths']

    #if flags['doc_class'] == 'class_1':
    page_width = pdf_data['page_width']
    page_height = pdf_data['page_height']
    # else:
    #     page_width = pdf_data['pdf_image_width']
    #     page_height = pdf_data['pdf_image_height']

    desired_width   = page_width
    desired_height  = page_height
    dfs             = pdf_data['h_dfs']
    lang            = pdf_data['lang']

    log_info('tesseract ocr started  ===>', app_context.application_context)
    start_time          = time.time()
    try:
        if (flags['page_layout'] == 'single_column') or (flags['doc_class'] == 'class_1'):
            ocr_dfs = []
            for i, df in enumerate(dfs):
                filepath   = pdf_image_paths[i]
                df_updated  = extract_text_from_image(filepath, desired_width, desired_height, df, lang)
                df_updated['children'] = None
                ocr_dfs.append(df_updated)
        else :
            ocr_dfs = []
            for i, sub_dfs in enumerate(dfs):
                filepath = pdf_image_paths[i]
                ocr_sub_dfs =[]
                for sub_df in sub_dfs :
                    sub_df_updated = extract_text_from_image(filepath, desired_width, desired_height, sub_df, lang)
                    sub_df_updated['children'] =None
                    ocr_sub_dfs.append(sub_df_updated)
                ocr_dfs.append(ocr_sub_dfs)

    except Exception as e :
       log_exception("Error in tesseract ocr " + str(e), app_context.application_context, e)
       return None

    end_time            = time.time()
    extraction_time     = end_time - start_time
    log_info('tesseract ocr successfully completed in {}/{}, average per page {}'.format(extraction_time, len(dfs), (extraction_time/len(dfs))), app_context.application_context)

    return ocr_dfs
