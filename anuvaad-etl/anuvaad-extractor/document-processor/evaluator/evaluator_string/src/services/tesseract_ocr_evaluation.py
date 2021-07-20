import glob
import uuid
import json
import requests
import copy,time
import os
import cv2
import numpy as np
from time import sleep
import pandas as pd
import logging
from collections import Counter
import pytesseract
from pytesseract import Output
from difflib import SequenceMatcher
from io import StringIO
from dynamic_adjustment import coord_adjustment
import ast
from google.cloud import vision
from leven import levenshtein
from horizontal_merging import horzontal_merging

os.environ['GOOGLE_APPLICATION_CREDENTIALS']='/home/ubuntu/anuvaad-f7a059c268e4_new.json'
client = vision.ImageAnnotatorClient()

ocr_level = "WORD"
text_processing = True
REJECT_FILTER = 2
#crop_factor= 5
#crop_factor_y= 4
crop_factor= 5
crop_factor_y= 0
crop_save = False
digitization = False
vis_thresh=0.90
craft_line = "True"
craft_word = "True"
google_ocr= "True"
tess_ocr= "true"
language = "hi"
LANG_MAPPING       =  {
    "en" : ["Latin","eng"],
    "kn" : ['Kannada',"kan"],
    "gu": ["guj"],
    "or": ["ori"],
    "hi" : ["Devanagari","hin","eng"],
    "bn" : ["Bengali","ben"],
    "mr": ["Devanagari","hin","eng"],
    "ta": ['Tamil',"tam"],
    "te" : ["Telugu","tel"],
    "ml" :["Malayalam"],
    "ma" :["Marathi"]
}

path = '/home/ubuntu/tesseract_evaluation_hindi/tesseract_evaluation/data/'
output_path = '/home/ubuntu/tesseract_evaluation_hindi/tesseract_evaluation/result/'
output_path_boxes= '/home/ubuntu/tesseract_evaluation_hindi/tesseract_evaluation/test_word_boxes/'
base_path = '/home/ubuntu/tesseract_evaluation_hindi/tesseract_evaluation/test_word_boxes/'
#path = '/home/naresh/Tarento/testing_document_processor/test_pipeline/data/'
#output_path = '/home/naresh/Tarento/testing_document_processor/test_pipeline/result/'
#output_path_boxes= '/home/naresh/Tarento/testing_document_processor/test_word_boxes/'
#base_path= '/home/naresh/Tarento/testing_document_processor/test_word_boxes/'


psms = [6,7,8,9,10,11]
token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyTmFtZSI6ImRoaXJhai5kYWdhQHRhcmVudG8uY29tIiwicGFzc3dvcmQiOiJiJyQyYiQxMiRxaTFuOTBwRXAvYnV6WFpwQi5LdmFlY3BEQXBGT2ZkQUcvMENmcU9taHFsYnp3bkJYczBIbSciLCJleHAiOjE2MjA0NjY0NzB9.MpNKKtgw5BnTEoN_nHXYjp3Mx1QY4atrn_9nTTDxmNA'

download_url ="https://auth.anuvaad.org/download/"


headers = {
    'auth-token' :token }





class Draw:
    
    def __init__(self,input_json,save_dir,regions,prefix='',color= (255,0,0),thickness=5):   
        self.json = input_json
        self.save_dir = save_dir
        self.regions = regions
        self.prefix  = prefix
        self.color  = color
        self.thickness=thickness
        if self.prefix == 'seg':
            #print('drawing children')
            self.draw_region_children()
        else:
            self.draw_region__sub_children()
        
    def get_coords(self,page_index):
        return self.json['outputs'][0]['pages'][page_index][self.regions]
    
    def get_page_count(self):
        return(self.json['outputs'][0]['page_info'])
    
    def get_page(self,page_index):
        page_path = self.json['outputs'][0]['page_info'][page_index]
        page_path = page_path.split('upload')[1]#'/'.join(page_path.split('/')[1:])
        #print(page_path)    
        return download_file(download_url,headers,page_path,f_type='image')

    def draw_region(self):
        font = cv2.FONT_HERSHEY_SIMPLEX 
        for page_index in range(len(self.get_page_count())) :
            nparr = np.frombuffer(self.get_page(page_index), np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            for region in self.get_coords(page_index) :
                    ground = region['boundingBox']['vertices']
                    pts = []
                    for pt in ground:
                        pts.append([int(pt['x']) ,int(pt['y'])])
                    cv2.polylines(image, [np.array(pts)],True, self.color, self.thickness)
                    if 'class' not in region.keys():
                        region['class'] = 'TEXT'
                    cv2.putText(image, str(region['class']), (pts[0][0],pts[0][1]), font,  
                   2, (0,125,255), 3, cv2.LINE_AA)
                    
            image_path = os.path.join(self.save_dir ,  '{}_{}_{}.png'.format(self.regions,self.prefix,page_index))            
            cv2.imwrite(image_path , image)
          
    def draw_region_children(self):
        font = cv2.FONT_HERSHEY_SIMPLEX 
        fontScale = 2
        thickness =3


        for page_index in range(len(self.get_page_count())) :
            nparr = np.frombuffer(self.get_page(page_index), np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            for region_index,region in enumerate(self.get_coords(page_index)) :
                try:
                    ground = region['boundingBox']['vertices']
                    pts = []
                    for pt in ground:
                        pts.append([int(pt['x']) ,int(pt['y'])])
                    #print(pts)
                    region_color = (0 ,0,125+ 130*(region_index/ len(self.get_coords(page_index))))
                    cv2.polylines(image, [np.array(pts)],True, region_color, self.thickness)
                    cv2.putText(image, str(region_index), (pts[0][0],pts[0][1]), font,  
                   fontScale, region_color, thickness, cv2.LINE_AA)
                    for line_index, line in enumerate(region['children']):
                        ground = line['boundingBox']['vertices']
                        pts = []
                        for pt in ground:
                            pts.append([int(pt['x']) ,int(pt['y'])])

                        line_color = (125 + 130*(region_index/ len(self.get_coords(page_index))) ,0,0)
                        cv2.polylines(image, [np.array(pts)],True, line_color, self.thickness -2)
                        cv2.putText(image, str(line_index), (pts[0][0],pts[0][1]), font,  
                   fontScale, line_color, thickness, cv2.LINE_AA)
                except Exception as e:
                    print(str(e))
                    print(region)
                    
            image_path = os.path.join(self.save_dir ,  '{}_{}.png'.format(self.prefix,page_index))
            cv2.imwrite(image_path , image)
    def draw_region__sub_children(self):        
        for page_index in range(len(self.get_page_count())) :
            nparr = np.frombuffer(self.get_page(page_index), np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            font = cv2.FONT_HERSHEY_SIMPLEX 
            fontScale = 2

            # Blue color in BGR 
            color = (0 ,255,0) 

            # Line thickness of 2 px 
            thickness = 3

            # Using cv2.putText() method 
            
            for region_index,region in enumerate(self.get_coords(page_index)) :
                try:
                    ground = region['boundingBox']['vertices']
                    pts = []
                    for pt in ground:
                        pts.append([int(pt['x']) ,int(pt['y'])])
                    #print(pts)
                    region_color = (0,0,255)
                    cv2.polylines(image, [np.array(pts)],True, region_color, self.thickness)
                    for line_index, line in enumerate(region['regions']):
                        ground = line['boundingBox']['vertices']
                        pts = []
                        for pt in ground:
                            pts.append([int(pt['x'])-1 ,int(pt['y']) -1 ])

                        line_color = (255,0,0)
                        cv2.polylines(image, [np.array(pts)],True, line_color, self.thickness -2)
                        
                        cv2.putText(image, str(line_index), (pts[0][0],pts[0][1]), font,  
                   fontScale, (255,0,0), thickness, cv2.LINE_AA)
                        for word_index, word in enumerate(line['regions']):
                            ground = word['boundingBox']['vertices']
                            pts = []
                            for pt in ground:
                                pts.append([int(pt['x']) -3,int(pt['y'])-3])

                            word_color = (0,255,0)
                            cv2.polylines(image, [np.array(pts)],True, word_color, self.thickness -2)

                            cv2.putText(image, str(word_index), (pts[0][0],pts[0][1]), font,  
                       fontScale-1,(0,255,0), thickness, cv2.LINE_AA)
                except Exception as e:
                    print(str(e))
                    print(region)
                    
                    
                    
            #print(self.prefix)
            image_path = os.path.join(self.save_dir ,  '{}_{}_{}.png'.format(self.prefix,self.regions,page_index))
            cv2.imwrite(image_path , image)


def get_document_bounds(img):
	if img is not None:
		img = cv2.imencode('.jpg', img)[1].tobytes()
		image = vision.Image(content=img)
		response = client.document_text_detection(image=image)
		resp = response.full_text_annotation
		image_text = ""
		temp_dict1 ={"text":[],"conf":[]}
		for i,page in enumerate(resp.pages):
			for block in page.blocks:

				for paragraph in block.paragraphs:
				#line_coord, line_text = extract_line(paragraph)
					for word in paragraph.words:
					    word_text = ''.join([
						symbol.text for symbol in word.symbols
					    ])
					    image_text = image_text + " " + word_text
					    temp_dict1["text"].append(word_text)
					    temp_dict1["conf"].append(word.confidence*100)

		return image_text,temp_dict1
	else:
		return "",{"text":[],"conf":[]}
def get_image_from_box(image, box, height=140):
    w = max(abs(box[0, 0] - box[1, 0]),abs(box[2, 0] - box[3, 0]))
    height = max(abs(box[0, 1] - box[3, 1]),abs(box[1, 1] - box[2, 1]))
    pts1 = np.float32(box)
    pts2 = np.float32([[0, 0], [int(w), 0],[int(w),int(height)],[0,int(height)]])
    M = cv2.getPerspectiveTransform(pts1, pts2)
    result_img = cv2.warpPerspective(image,M,(int(w), int(height))) #flags=cv2.INTER_NEAREST
    return result_img

	
def get_text(path,coord,language,mode_height,save_base_path,psm_val):
	try:

        path = path.split('upload')[1]

        image = download_file(download_url,headers,path,f_type='image')
        nparr = np.frombuffer(image, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        #image   = cv2.imread("/home/naresh/crop.jpeg",0)
        height, width,channel = image.shape
        crop_image = get_image_from_box(image, coord, height=abs(coord[0,1]-coord[2,1]))
        #crop_image = image[ top:bottom, left:right]
        #crop_image_cv = image[ coord[0,1]:coord[2,1], coord[0,0]:coord[1,0]]
        save_path  =  save_base_path+"/"+"_psm_pers"+str(psm_val)+"--"+str(uuid.uuid4()) + '.jpg'
        if crop_save:
            cv2.imwrite(save_path,crop_image)
        g_text = "" ;text = "" 
        g_conf_dict ={"text":[],"conf":[]};conf_dict={"text":[],"conf":[]}
        if google_ocr=="True":
            g_text,g_conf_dict = get_document_bounds(crop_image)
        if tess_ocr=="True":
            if abs(coord[1,1]-coord[2,1])>mode_height:
                dfs = pytesseract.image_to_data(crop_image,config='--psm 6', lang="tam",output_type=Output.DATAFRAME)
                text,conf_dict  = process_dfs(dfs)		    
            else:
                dfs = pytesseract.image_to_data(crop_image,config='--psm '+str(psm_val), lang="tam",output_type=Output.DATAFRAME)
                text,conf_dict  = process_dfs(dfs)
                
        return text,conf_dict,g_text,g_conf_dict
	except:
		return "",{"text":[],"conf":[]},"",{"text":[],"conf":[]}








def cell_ocr_word(lang, page_path, line,save_base_path,mode_height):
    cell_text =""
    g_cell_text = ""
    conf_dicts=[]
    g_conf_dicts=[]
    dynamic_line = coord_adjustment(page_path,line['regions'] ,save_base_path)
    for word_idx, word in enumerate(dynamic_line):
        word = correct_region(word)
        coord_crop, coord = get_coord(word)
        if len(coord)!=0 and abs(coord_crop[1,1]-coord_crop[2,1]) > REJECT_FILTER :
            text,conf_dict,g_text,g_conf_dict = get_text(page_path, coord_crop, lang,mode_height,save_base_path,8) 
            cell_text = cell_text +" " +text
            g_cell_text = g_cell_text +" " +g_text
            conf_dicts.extend(conf_dict)
            g_conf_dicts.extend(g_conf_dict)
    return cell_text,conf_dicts,g_cell_text,g_conf_dicts

def cell_ocr(lang, page_path, line,save_base_path,mode_height,psm):
    text =""
    cell_google_text = ""
    conf_dicts = []
    updated_lines = horzontal_merging(line['regions'])
    dynamic_line = coord_adjustment(page_path,updated_lines ,save_base_path)
    
    for updated_line in dynamic_line:
        line_text = updated_line['text']
        corrected_line = correct_region(updated_line)
        coord_crop, coord = get_coord(corrected_line)
        if len(coord)!=0 and abs(coord_crop[1,1]-coord_crop[2,1]) > REJECT_FILTER :
            tess_text,conf_dict = get_text(page_path, coord_crop, lang,mode_height,save_base_path,psm) 
            text =  text + " " + tess_text
            conf_dicts.extend(conf_dict)
        
    return cell_google_text,text,conf_dicts

def update_region_keys(region,text,line_text,final_score,total_chars,total_match_chars):
    score,message,match_count       = seq_matcher(text,line_text)
    final_score = final_score+score
    total_chars = total_chars+len(remove_space(line_text))
    total_match_chars= total_match_chars+match_count
    region['char_match'] = match_count;  region['tess_text']= text
    region['text'] = line_text ; region['conf_dict'] = conf_dict
    region['score'] = score; region['message']    = message
    return region,final_score,total_chars,total_match_chars

def string_processing(text):
    text_list = text.split()
    text = " ".join(text_list)
    return text

def line_ocr(page_path,level,save_base_path,total_words,df,lang,mode_height,total_lines,final_score,total_chars,total_match_chars):
    lines_adjusted = coord_adjustment(page_path, level['regions'],save_base_path)
    for line_idx, line_org in enumerate(lines_adjusted):
        line_sorted = copy.deepcopy(sort_line(line_org))
        line_text,total_word = merger_text(line_sorted)
        line = copy.deepcopy(correct_region(line_sorted))
        psm  = 7; total_words = total_words+total_word
        if total_word<2:
            psm=8
        coord_crop, coord = get_coord(line)

        if len(remove_space(line_text))>0 and len(coord)!=0 and abs(coord_crop[1,1]-coord_crop[2,1]) > REJECT_FILTER :
            if 'class' in line.keys() and line['class']=="CELL":
                line_text,text,conf_dict = cell_ocr(lang, page_path, line,save_base_path,mode_height,psm)
            elif 'class' in line.keys() and line['class']=="CELL_TEXT":
                text,conf_dict = cell_ocr_word(lang, page_path, line,save_base_path,mode_height)
            else:
    
                text,conf_dict = get_text(page_path, coord_crop, lang,mode_height,save_base_path,psm)
            
            if text_processing:
                text = string_processing(text)
            total_lines = total_lines+1

            line,final_score,total_chars,total_match_chars = (line,text,line_text,final_score,total_chars,total_match_chars)
            columns = line.keys()
            df2 = pd.DataFrame([line],columns=columns)
            df = df.append(df2, ignore_index=True)
    return df
        
def text_extraction(df,lang, page_path, regions,save_base_path):
    final_score = 0; g_final_score=0; total_words = 0; total_lines = 0
    total_chars = 0; total_match_chars = 0; g_total_match_chars = 0
    for idx, level in enumerate(regions):
        mode_height = frequent_height(level['regions'])

        if ocr_level=="WORD":
            for line_idx, line in enumerate(level['regions']):
               word_regions  = line["regions"]
               if craft_word=="True":
                   word_regions = coord_adjustment(page_path, word_regions,save_base_path)
               for word_idx, word in enumerate(word_regions):
                    word = correct_region(word)
                    coord_crop, coord = get_coord(word)
                    word_text = word['text']
                    if len(word_text)>0 and len(coord)!=0 and abs(coord_crop[1,1]-coord_crop[2,1]) > REJECT_FILTER :

                        text,conf_dict,g_text,g_conf_dict  = get_text(page_path, coord_crop, lang,mode_height,save_base_path,8)
                        if text_processing:
                            text_list = text.split()
                            text = " ".join(text_list)
                            g_text_list = g_text.split()
                            g_text = " ".join(g_text_list)
                        score,message,match_count = seq_matcher(text,word_text)
                        g_score,g_message,g_match_count = seq_matcher(g_text,word_text)
                        final_score = final_score+score
                        g_final_score = g_final_score+g_score
                        total_words = total_words+1
                        total_chars = total_chars+len(remove_space(word['text']))
                        total_match_chars= total_match_chars+match_count
                        g_total_match_chars= g_total_match_chars+g_match_count
                        word['char_match'] = match_count
                        word['g_char_match'] = g_match_count
                        word['tess_text']     = text
                        word['g_text']     = g_text
                        word['conf_dict']     = conf_dict
                        word['g_conf_dict']     = g_conf_dict
                        word['score']         = score
                        word['g_score']         = g_score
                        word['message']       = message
                        word['g_message']       = g_message
                        columns = word.keys()
                        df2 = pd.DataFrame([word],columns=columns)
                        df = df.append(df2, ignore_index=True)
            
        if ocr_level=="LINE":
           df = line_ocr(page_path,level,save_base_path,total_words,df)

    #return regions,final_score/total_words,df,total_chars,total_match_chars,total_words,g_final_score/total_words,g_total_match_chars
    return regions,final_score/total_lines,df,total_chars,total_match_chars,total_words,g_final_score/total_words,g_total_match_chars


json_files_path = glob.glob(output_path+"/*/gv.json")


def tesseract(json_files):
    
    output = []
    dfs =[]
    for json_file in json_files:
        file_name = json_file.split('/')[-1].split('.json')[0]
        
        pdf_name = json_file.split('/')[-2]
        print("file name--------------------->>>>>>>>>>>>>>>>>>",pdf_name)
        if not os.path.exists(base_path+pdf_name):
            os.mkdir(base_path+pdf_name)
        save_base_path = base_path+pdf_name
        txt_file= open(save_base_path+".txt","w+")
        with open(json_file,'r+') as f:
            data = json.load(f)
        columns = ["page_path","page_data","file_eval_info"]
        final_df = pd.DataFrame(columns=columns)
        Draw(data,save_base_path,regions='regions')
        lang = data['outputs'][0]['config']['OCR']['language']
        total_page = len(data['outputs'][0]['pages'])
        file_score = 0; g_file_score = 0;total_chars_file = 0
        file_data = []; total_match_chars_file = 0; g_total_match_chars_file=0
        page_paths = []
        page_data_counts = []
        file_words = 0
        for idx,page_data in enumerate(data['outputs'][0]['pages']):
            t1 = time.time()
            print("processing started for page no. ",idx)
            page_path =  page_data['path']
            regions = page_data['regions'][1:]
            df = pd.DataFrame()
            regions,score,df,total_chars,total_match_chars,page_words,g_score,g_total_match_chars = text_extraction(df,lang, page_path, regions,save_base_path)
            file_score = file_score + score
            g_file_score = g_file_score + g_score
            file_words = file_words+page_words
            total_chars_file =total_chars_file +total_chars
            total_match_chars_file =  total_match_chars_file+total_match_chars
            g_total_match_chars_file =  g_total_match_chars_file+g_total_match_chars
            file_data.append(df.to_csv())
            page_paths.append(page_path)
            char_details = {"total_chars":total_chars,"total_match_chars":total_match_chars,"g_total_match_chars":g_total_match_chars}
            txt_file.write(str(idx))
            txt_file.write("  "+ str(char_details)+"\n")
            print("page level score",char_details)
            page_data_counts.append(char_details)
            data['outputs'][0]['pages'][idx]["regions"][1:] = copy.deepcopy(regions)
            t2 = t1+time.time()
            print("processing completed for page in {}".format(t2))
        file_eval_info = {"total_words":file_words,"total_chars":total_chars_file,"total_match_chars":total_match_chars_file,"score":total_match_chars_file/total_chars_file,"g_total_match_chars":g_total_match_chars_file,"g_score":g_total_match_chars_file/total_chars_file}

        print(file_eval_info)
        final_df["page_path"] = page_paths
        final_df["page_data"] = file_data
        final_df["file_eval_info"] = [file_eval_info]*len(page_paths)
        
        print("file level evaluation result------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>",file_eval_info)
        data['outputs'][0]['score'] = file_score/total_page
        with open(save_base_path+"/"+file_name+".json", 'w') as outfile:
            json.dump(data, outfile)
        final_df.to_csv(save_base_path+"/"+file_name+'.csv')
    return output,final_df
        

output,dfs = tesseract(json_files_path)



def draw_thresh_box(df,path,page_index,save_path):
    path = path.split('upload')[1]
    
    image = download_file(download_url,headers,path,f_type='image')
    nparr = np.frombuffer(image, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    font = cv2.FONT_HERSHEY_SIMPLEX 
    color= (255,0,0);thickness=5
    df =df.reset_index()
    for row in df.iterrows():
        row2 = row[1].to_dict()
        boxes = row2['boundingBox']
        boxes2 = ast.literal_eval(boxes)
        ground = boxes2['vertices']
        
        pts = []
        for pt in ground:
            pts.append([int(pt['x']) ,int(pt['y'])])
        cv2.polylines(image, [np.array(pts)],True, color, thickness)
        cv2.putText(image, str(row2['text']), (pts[0][0],pts[0][1]), font,  
       2, (0,0,255), 2, cv2.LINE_AA)
        cv2.putText(image, str(row2['tess_text']), (pts[1][0],pts[1][1]), font,  
       2, (0,255,0), 2, cv2.LINE_AA)

        image_path = os.path.join(save_path ,  '{}.png'.format(page_index))            
        cv2.imwrite(image_path , image)

def visualize_results(df_paths,thresh):
    for df_path in glob.glob(df_paths+"*/*.csv"):
        save_path = base_path + df_path.split('/')[-2]+"/"
    
        df = pd.read_csv(df_path)
        for idx,(page_path,page_data) in enumerate(zip(df['page_path'],df['page_data'])):
            df_string = StringIO(page_data)
            page_df = pd.read_csv(df_string, sep=",")
            filtered_df = page_df[page_df['score']<thresh]
            draw_thresh_box(filtered_df,page_path,idx,save_path)
            
visualize_results(base_path,vis_thresh)





