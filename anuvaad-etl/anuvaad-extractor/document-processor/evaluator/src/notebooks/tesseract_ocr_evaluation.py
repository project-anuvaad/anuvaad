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
#from pytesseract import pytesseract
from difflib import SequenceMatcher
from io import StringIO
from dynamic_adjustment import coord_adjustment
import ast

ocr_level = "LINE"
text_processing = True
REJECT_FILTER = 2
crop_factor= 5
crop_factor_y= 4
crop_save = False
digitization = True
vis_thresh=0.90
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

path = '/home/ubuntu/tesseract_evaluation/data/'
output_path = '/home/ubuntu/tesseract_evaluation/result/'
output_path_boxes= '/home/ubuntu/tesseract_evaluation/test_word_boxes/'
base_path = '/home/ubuntu/tesseract_evaluation/test_word_boxes/'

token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyTmFtZSI6ImRoaXJhai5kYWdhQHRhcmVudG8uY29tIiwicGFzc3dvcmQiOiJiJyQyYiQxMiRNOWZ2R0Vib1hBdERhSnplY1lQZEpPUkk5am5aQ0JtV2xzRGRyd0ppblF4S05CdU4xNndaRyciLCJleHAiOjE2MTg5ODg2NjJ9.np3cA2SaR6XMfSJZ_grfK_LYNvqdoBzTREaqQbVJ6Po'


word_url = "https://auth.anuvaad.org/anuvaad-etl/wf-manager/v1/workflow/async/initiate"
google_url = "https://auth.anuvaad.org/anuvaad-etl/wf-manager/v1/workflow/async/initiate"
layout_url = "https://auth.anuvaad.org/anuvaad-etl/wf-manager/v1/workflow/async/initiate"
segmenter_url = "https://auth.anuvaad.org/anuvaad-etl/wf-manager/v1/workflow/async/initiate"
bs_url ="https://auth.anuvaad.org/anuvaad-etl/wf-manager/v1/workflow/jobs/search/bulk"

evaluator_url  = "https://auth.anuvaad.org/anuvaad-etl/document-processor/evaluator/v0/process"

#evaluator_url = 'http://0.0.0.0:5001/anuvaad-etl/document-processor/evaluator/v0/process'

download_url ="https://auth.anuvaad.org/download/"
upload_url = 'https://auth.anuvaad.org/anuvaad-api/file-uploader/v0/upload-file'


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





# # google vision pipeline


def google_ocr_v15(url,headers,pdf_name):
    
    file = {
       "files": [
        {
            "locale": "en",
            "path": pdf_name,
            "type": "pdf",
            "config":{
        "OCR": {
          "option": "HIGH_ACCURACY",
          "language": "en",
          "top_correction":"True",
          "craft_word": "True",
          "craft_line": "True",
        }
        }}
    ],
    "workflowCode": "WF_A_FCWDLDBSOD15GV"
    }
    res = requests.post(url,json=file,headers=headers)
    return res.json()





def upload_file(pdf_file,headers,url):
    #url = 'https://auth.anuvaad.org/anuvaad-api/file-uploader/v0/upload-file'
    files = [
        ('file',(open(pdf_file,'rb')))] 

    response = requests.post(url, headers=headers, files=files)
    
    return response.json()





def download_file(download_url,headers,outputfile,f_type='json'):
    download_url =download_url+str(outputfile)
    res = requests.get(download_url,headers=headers)
    if f_type == 'json':
        return res.json()
    else :
        return res.content





def save_json(path,res):
    with open(path, "w", encoding='utf8') as write_file:
        json.dump(res, write_file,ensure_ascii=False )





def bulk_search(job_id,bs_url,headers):
    bs_request = {
    "jobIDs": [job_id],
    "taskDetails":"true"
    }
    print(job_id)
    res = requests.post(bs_url,json=bs_request,headers=headers, timeout = 10000)
    print(res.json())
    
   
    while(1):
        
        in_progress = res.json()['jobs'][0]['status']
       
        if in_progress == 'COMPLETED':
            outputfile = res.json()['jobs'][0]['output'][0]['outputFile']
            print(in_progress)
            return outputfile
            break
        sleep(0.5)
        print(in_progress)
        res = requests.post(bs_url,json=bs_request,headers=headers, timeout = 10000)
      
   





def execute_module(module,url,input_file,module_code,pdf_dir,overwirte=True , draw=True):
    
        
        
        output_path = os.path.join(pdf_dir,'{}.json'.format(module_code))
        if os.path.exists(output_path) and not overwirte:
            print(' loading *****************{}'.format(module_code ))
            with open(output_path,'r') as wd_file :
                response = json.load(wd_file)
                
            wf_res = pdf_dir + '/{}_wf.json'.format(module_code)
            with open(wf_res,'r') as wd_file :
                json_file = json.load(wd_file) 
            #json_file = upload_file(output_path,headers,upload_url)['data']
        else :
            if module_code in ['wd','gv']:
                res = upload_file(input_file,headers,upload_url)
                print('upload response **********', res)
                pdf_name = res['data']
                response = module(url,headers,pdf_name)
            
            else : 
                response = module(url,headers,input_file)
                
                if 'eval' in module_code :
                    json_file = response['outputFile']
                    response = download_file(download_url,headers,json_file)
                    save_json(output_path,response)
                    return json_file,response
                
            
            print(' response *****************{} {}'.format(module_code ,response ))
            job_id = response['jobID']
            json_file = bulk_search(job_id,bs_url,headers)
            save_json(pdf_dir + '/{}_wf.json'.format(module_code),json_file)   
            print('bulk search  response **************',json_file )
            response = download_file(download_url,headers,json_file)
            save_json(output_path,response)
            if draw :
                if module_code in ['wd','gv']:
                    Draw(response,pdf_dir,regions='lines',prefix=module_code)
                else :
                     Draw(response,pdf_dir,regions='regions',prefix=module_code)
                    
        return json_file,response
        



def evaluate__and_save_input(pdf_files,output_dir,headers,word_url,layout_url,download_url,upload_url,bs_url):
    word_responses   = {}
    layout_responses = {}
    segmenter_responses = []
    for pdf in pdf_files:
        #try :
        pdf_name = pdf.split('/')[-1].split('.')[0]
        print(pdf , ' is being processed')
        pdf_output_dir = os.path.join(output_dir,pdf_name)
        os.system('mkdir -p "{}"'.format(pdf_output_dir))


        wd_json,_ = execute_module(google_ocr_v15,word_url,input_file=pdf,module_code='gv',pdf_dir=pdf_output_dir,overwirte=False , draw=False)




def main(path,headers,word_url,layout_url,download_url,upload_url,bs_url):
        pdf_names = glob.glob(path + '/*.pdf')
        
        
        return evaluate__and_save_input(pdf_names,output_path,headers,word_url,layout_url,download_url,upload_url,bs_url)
        

if digitization:
    main(path,headers,word_url,layout_url,download_url,upload_url,bs_url)


def bound_coordinate(corrdinate,max):
   if corrdinate < 0 :
       corrdinate = 0
   if corrdinate > max:
       corrdinate = max - 2
   return int(corrdinate)

def get_text(path,coord,language,mode_height,save_base_path,psm_val):
	try:

		path = path.split('upload')[1]

		image = download_file(download_url,headers,path,f_type='image')
		nparr = np.frombuffer(image, np.uint8)
		image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
		#image   = cv2.imread(path,0)
		height, width,channel = image.shape
                
		left = bound_coordinate(coord[0]-crop_factor , width)
		top = bound_coordinate(coord[1]-crop_factor_y,height )
		right = bound_coordinate(coord[2]+crop_factor ,width)
		bottom = bound_coordinate(coord[3]+crop_factor_y, height)
		region_width = abs(right-left)
		region_height = abs(bottom-top)

		if left==right==top==bottom==0 or region_width==0 or region_height==0:
			return ""


		crop_image = image[ top-crop_factor_y:bottom+crop_factor_y, left-crop_factor:right+crop_factor]
		if crop_save:
			cv2.imwrite(save_base_path+str(uuid.uuid4()) + '.jpg',crop_image)

		if abs(bottom-top) > 3*mode_height:
			text = pytesseract.image_to_string(crop_image, lang=LANG_MAPPING[language][1])
		else:
			text = pytesseract.image_to_string(crop_image,config='--psm '+str(psm_val), lang=LANG_MAPPING[language][1])
		return text
	except:
		return ""

   
def merger_text(line):
    text = ""
    for word_idx, word in enumerate(line['regions']):
        if "text" in word.keys():
            text = text+" "+ word["text"]
    return text



def get_coord(bbox):
   temp_box = []
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
def remove_space(a):
   return a.replace(" ", "")

def seq_matcher(tgt_text,gt_text):
   tgt_text = remove_space(tgt_text)
   gt_text = remove_space(gt_text)
   score = SequenceMatcher(None, gt_text, tgt_text).ratio()
   
   matchs = list(SequenceMatcher(None, gt_text, tgt_text).get_matching_blocks())
   match_count=0
   for match in matchs:
       match_count = match_count + match.size
   #gt_text_leng = len(gt_text)
   #if gt_text_leng==0:
      # gt_text_leng=1
   #score = (score*match_count)/gt_text_leng
#     if tgt_text == gt_text:
#         score = 1.0
   message = {"ground":True,"input":True}
   if score==0.0:
       if len(gt_text)>0 and len(tgt_text)==0:
           message['input'] = "text missing in tesseract"
       if len(gt_text)==0 and len(tgt_text)>0:
           message['ground'] = "text missing in google vision"
   if score==1.0 and len(gt_text)==0 and len(tgt_text)==0:
       message['ground'] = "text missing in google vision"
       message['input'] = "text missing in tesseract"
   return score,message,match_count
def count_mismatch_char(gt ,tgt) :
   count=0
   gt_count = len(gt)
   for i,j in zip(gt,tgt):
       if i==j:
           count=count+1
   mismatch_char = abs(gt_count-count)
   return mismatch_char
def correct_region(region):
    box = region['boundingBox']['vertices']
    

    region['boundingBox']= {'vertices'  : [{'x':box[0]['x']-crop_factor,'y':box[0]['y']-crop_factor_y},\
                                                                 {'x':box[1]['x']+crop_factor,'y':box[1]['y']-crop_factor_y},\
                                                                 {'x':box[2]['x']+crop_factor,'y':box[2]['y']+crop_factor_y},\
                                                                 {'x':box[3]['x']-crop_factor,'y': box[3]['y']+crop_factor_y}]}
    return region
 








def cell_ocr(lang, page_path, line,save_base_path,mode_height):
    cell_text =""


    for word_idx, word in enumerate(line['regions']):
        word = correct_region(word)
        coord = get_coord(word)
        if len(coord)!=0 and abs(coord[3] - coord[1]) > REJECT_FILTER :
            text = get_text(page_path, coord, lang,mode_height,save_base_path,8) 
            cell_text = cell_text +" " +text
    return cell_text
def text_extraction(df,lang, page_path, regions,save_base_path):
   final_score = 0
   total_words = 0
   total_lines = 0
   total_chars = 0
   total_match_chars = 0
   for idx, level in enumerate(regions):
       mode_height = frequent_height(level['regions'])
       if ocr_level=="WORD":
           for line_idx, line in enumerate(level['regions']):
               #word_regions = coord_adjustment(page_path, line['regions'],save_base_path)
               for word_idx, word in enumerate(line['regions']):
                   word = correct_region(word)
                   coord = get_coord(word)
                   word_text = word['text']
                   if len(word_text)>0 and len(coord)!=0 and abs(coord[3] - coord[1]) > REJECT_FILTER :
                       text = get_text(page_path, coord, lang,mode_height,save_base_path,8)
                       if text_processing:
                           text_list = text.split()
                           text = " ".join(text_list)
                       score,message,match_count = seq_matcher(text,word['text'])
                       final_score = final_score+score
                       total_words = total_words+1
                       total_chars = total_chars+len(remove_space(word['text']))
                       total_match_chars= total_match_chars+match_count
                       word['char_match'] = match_count
                       word['tess_text']     = text
                       word['score']         = score
                       word['message']       = message
                       columns = word.keys()
                       df2 = pd.DataFrame([word],columns=columns)
                       df = df.append(df2, ignore_index=True)
                   elif len(word_text)>0:
                       score,message,match_count = seq_matcher("",word['text'])
                       word['char_match'] = match_count
                       word['tess_text']     = " "
                       word['score']         = score
                       word['message']       = message
                       columns = word.keys()
                       df2 = pd.DataFrame([word],columns=columns)
                       df = df.append(df2, ignore_index=True)
       if ocr_level=="LINE":
           for line_idx, line in enumerate(level['regions']):
               line_text = merger_text(line)
               line = correct_region(line)
               coord = get_coord(line)

               
               if len(line_text)>0 and len(coord)!=0 and abs(coord[3] - coord[1]) > REJECT_FILTER :
                   if 'class' in line.keys() and (line['class']=="CELL" or line['class']=="CELL_TEXT"):
                       text = cell_ocr(lang, page_path, line,save_base_path,mode_height)
                       
                   else:
                       text = get_text(page_path, coord, lang,mode_height,save_base_path,7)
                   if text_processing:
                       text_list = text.split()
                       text = " ".join(text_list)
                   score,message,match_count = seq_matcher(text,line_text)
                   final_score = final_score+score
                   total_lines = total_lines+1
                   total_chars = total_chars+len(remove_space(line_text))
                   total_match_chars= total_match_chars+match_count
                   line['char_match'] = match_count
                   line['tess_text']     = text
                   line['text']     = line_text
                   line['score']         = score
                   line['message']       = message
                   columns = line.keys()
                   df2 = pd.DataFrame([line],columns=columns)
                   df = df.append(df2, ignore_index=True)
               elif len(line_text)>0:
                   score,message,match_count = seq_matcher("",line_text)
                   line['char_match'] = match_count
                   line['tess_text']     = " "
                   line['text']     = line_text
                   line['score']         = score
                   line['message']       = message
                   columns = line.keys()
                   df2 = pd.DataFrame([line],columns=columns)
                   df = df.append(df2, ignore_index=True)
   
   #return regions,final_score/total_words,df,total_chars,total_match_chars
   return regions,final_score/total_lines,df,total_chars,total_match_chars



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
        with open(json_file,'r+') as f:
            data = json.load(f)
        columns = ["page_path","page_data","file_eval_info"]
        final_df = pd.DataFrame(columns=columns)
        Draw(data,save_base_path,regions='regions')
        lang = data['outputs'][0]['config']['OCR']['language']
        total_page = len(data['outputs'][0]['pages'])
        file_score = 0; total_chars_file = 0
        file_data = []; total_match_chars_file = 0
        page_paths = []
        page_data_counts = []
        for idx,page_data in enumerate(data['outputs'][0]['pages']):
            t1 = time.time()
            print("processing started for page no. ",idx)
            page_path =  page_data['path']
            regions = page_data['regions'][1:]
            df = pd.DataFrame()
            regions,score,df,total_chars,total_match_chars = text_extraction(df,lang, page_path, regions,save_base_path)
            file_score = file_score + score
            total_chars_file =total_chars_file +total_chars
            total_match_chars_file =  total_match_chars_file+total_match_chars
            file_data.append(df.to_csv())
            page_paths.append(page_path)
            char_details = {"total_chars":total_chars,"total_match_chars":total_match_chars}
            page_data_counts.append(char_details)
            data['outputs'][0]['pages'][idx]["regions"][1:] = copy.deepcopy(regions)
            t2 = t1+time.time()
            print("processing completed for page in {}".format(t2))
        file_eval_info = {"total_chars":total_chars_file,"total_match_chars":total_match_chars_file,"score":total_match_chars_file/total_chars_file}

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





