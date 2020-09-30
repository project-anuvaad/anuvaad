import os
import sys
import io
import glob
import cv2
import ast 
from PIL import Image, ImageDraw, ImageFont, ImageOps


nb_dir = os.path.split(os.getcwd())[0]
sys.path.append(nb_dir)
sys.path.append(os.path.split(nb_dir)[0])

import pandas as pd
from matplotlib import pyplot as plt
import subprocess
from google.cloud import vision
from src.services import main
from src.services.ocr_text_utilities import  tesseract_ocr
from services import get_xml
from services.get_tables import get_text_table_line_df

from services.preprocess import prepocess_pdf_regions
import src.utilities.app_context as app_context



app_context.application_context= dict({'input': {'files': [{'locale': 'hi', 'path': 'RTIOrder_hi.pdf', 'type': 'pdf'}]}, 'jobID': 'BM-15913540488115873', 'state': 'INITIATED', 'status': 'STARTED', 'stepOrder': 0, 'workflowCode': 'abc', 'tool': 'BM', 'metadata': {'module': 'WORKFLOW-MANAGER', 'receivedAt': 15993163946431696, 'sessionID': '4M1qOZj53tIZsCoLNzP0oP', 'userID': 'd4e0b570-b72a-44e5-9110-5fdd54370a9d'}, 'taskID': 'BM-16000776881221366'})
base_dir   = os.getcwd()
input_dir  = os.path.join(base_dir, 'sample-data','input')
save_dir   = os.path.join(base_dir, 'sample-data', 'bbox_output')
output_dir = os.path.join(base_dir, 'sample-data', 'output')
lang ='hi'

def google_vision_image_to_string(pdf_image_paths,pdf_to_image_dir,pdf_name,path):
    try:
        out_text_path_vision = path+'/'+str(pdf_name.split('.pdf')[0])+"_"+"vision"+".txt"
        text_file_vision = open(out_text_path_vision, "a")
        client = vision.ImageAnnotatorClient()
        for path in sorted(pdf_image_paths):
            with io.open(path, 'rb') as image_file:
                content = image_file.read()
            image = vision.types.Image(content=content)
            response = client.text_detection(image=image)
            texts = response.text_annotations
            collated_text =  texts[0].description
            collated_text = collated_text.replace('-\n', '')
            text_file_vision.write(collated_text)
    except:
        pass

    return out_text_path_vision


def ocr_evaluation(xml_dfs,img_dfs ,page_height,page_width,lang,pdf_bg_img_filepaths,pdf_image_paths,filename,base_dir):

    path = base_dir+'/ocrevaluation/'+str(filename.split('.pdf')[0])
    if not os.path.exists(path):
        os.makedirs(path)

    header_region, footer_region = pd.DataFrame(), pd.DataFrame() #prepocess_pdf_regions(xml_dfs, page_height)
    #in_dfs, table_dfs, line_dfs,bg_dfs = get_text_table_line_df(xml_dfs, img_dfs, pdf_bg_img_filepaths,,check=True)#

    h_dfs = get_xml.get_hdfs(xml_dfs, header_region, footer_region)
    
    v_dfs                              = get_xml.get_vdfs(h_dfs)
    p_dfs                              = get_xml.get_pdfs(v_dfs,lang)
    p_dfs = tesseract_ocr(pdf_image_paths, page_width, page_height, p_dfs, lang)
   # p_dfs                              = get_text_from_table_cells(table_dfs,p_dfs)
   # p_dfs, line_dfs = get_underline(p_dfs, line_dfs, app_context.application_context)
    

   

    draw_hist(p_dfs,base_dir, filename,path)
    out_text_path_vision = google_vision_image_to_string(pdf_image_paths,base_dir,filename,path)
    out_text_path_tesseract = tesseract_image_to_string(pdf_image_paths,p_dfs,base_dir,filename,path,page_height,page_width)
    subprocess.run(["java", "-cp","/home/naresh/Tarento/hw-recog-be-lines_ocr_deep_learning_machine_v2/src/ocrevalUAtion-1.3.4-jar-with-dependencies.jar","eu.digitisation.Main","-gt",str(out_text_path_vision),"-ocr",str(out_text_path_tesseract),"-o",str(base_dir+'/ocrevaluation/'+str(filename.split('.pdf')[0])+'/'+str(filename.split('.pdf')[0])+".html")],stdout=subprocess.PIPE)

def draw_bbox(filepath, desired_width, desired_height, word_lis, color="green"):
    image  = Image.open(filepath)
    image  = image.resize((desired_width, desired_height))
    draw   = ImageDraw.Draw(image)
    #image = cv2.imread(filepath)
    #font = cv2.FONT_HERSHEY_SIMPLEX 
    #font = cv2.Arial Unicode MS
    font = ImageFont.truetype('/home/naresh/Downloads/Mangal Regular/Mangal Regular.ttf', 32)
    #font  = /home/naresh/Downloads/Mangal Regular.ttf
    org = (50, 50)  
    fontScale = 2
    thickness = 2
    word_lis2 = [] 
    for coord in word_lis:
        left   = int(coord['text_left'])
        right  = int(coord['text_width'] + left)
        top    = int(coord['text_top'])
        bottom = int(coord["text_height"] + top)
        conf   = int(coord['conf'])
        color = (218,66,11)
        text   = str(coord['text'])
        
        if conf<30:
            word_lis2.append(str('<font style="background-color:red">'+ str(text)+ "</font>"))
            color = (0,0,139)
        if conf>30 and conf<60:
            word_lis2.append(str('<font style="background-color:yellow">'+ str(text)+ "</font>"))
            color = (0,0,139)
        if conf>60:
            word_lis2.append(str('<font>'+ str(text)+ "</font>"))
            color = (0,0,139)
        
       # draw.rectangle(((left, top), (right,bottom)), outline=color)
        #draw.text((left, top-10), text, font=font,fill=(0, 0, 255))
        #cv2.rectangle(image,(left, top), (right,bottom), (0,255,0),2)
        #cv2.putText(image, text+",conf:"+str(conf), (left,top-20),font,  
                   #fontScale, color, thickness, cv2.LINE_AA) 
        #print(text)
    # file = open("/home/naresh/1.html","a")
    # file.write(str(<html>+" "+ str(<body>)))
    # file.write(' '.join(word_lis2))
    # file.write(str(</body>)+" "+str(</html>))
    # file.close()
    save_filepath = os.path.join(os.path.dirname(filepath), 'processed_' + os.path.basename(filepath))
    #cv2.imwrite(save_filepath,image)
    image.save(save_filepath)

def draw_bbox2(word_lis, filename,color="green"):
    word_lis2 = []
    count1 = 0
    count2 = 0
    count3 = 0
    for coord in word_lis:
        conf   = int(coord['conf'])
        color = (218,66,11)
        text   = str(coord['text'])
        
        if conf<30:
            word_lis2.append(str('<font style="background-color:red">'+ str(text)+ "</font>"))
            count1=count1+1
            color = (0,0,139)
        if conf>30 and conf<60:
            word_lis2.append(str('<font style="background-color:yellow">'+ str(text)+ "</font>"))
            count2=count2+1
            color = (0,0,139)
        if conf>60:
            word_lis2.append(str('<font>'+ str(text)+ "</font>"))
            count3=count3+1
            color = (0,0,139)
    p_count1 = (count1/(count1+count2+count3))*100
    p_count2 = (count2/(count1+count2+count3))*100
    p_count3 = (count3/(count1+count2+count3))*100
    file = open("/home/naresh/updated_html/"+str(filename)+'.html',"a")
    file.write("<html>" +" "+ "<body>"+"p_count1:red(conf below 30), "+str(p_count1)+"<br>" + "p_count2:yellow(conf 30 to 60), "+str(p_count2)+"<br>"+"p_count3:(conf above 60), "+str(p_count3)+"<br>" )
    file.write(' '.join(word_lis2))
    file.write("</body>"+" "+"</html>")
    file.close()
    

def draw_word_coord(d,filename,image_path,page_height,page_width):

    word_lis = []
    total_word=0
    
    for word_coord in d['word_coords']:
        res = ast.literal_eval(word_coord)

        #res = word_coord
        print(type(res))
        for word in range(len(res)):
            total_word+=1
            
            if res[word]['conf']<101:
                
                word_lis.append(res[word])
    
    
    #draw_bbox(image_path,page_width,page_height, word_lis)
    draw_bbox2(word_lis,filename, color="green")


def read_dfs(path):
    for df_path in glob.glob(path):
        filename = df_path.split('/')[-1].split('.csv')[0]
        df = pd.read_csv(df_path)
        
        draw_word_coord(df,filename,None,None,None)
    
path = "/home/naresh/Tarento/anuvaad/anuvaad-etl/anuvaad-extractor/block-merger/src/notebooks/ocrevaluation/*/*.csv"
#read_dfs(path)


def tesseract_image_to_string(pdf_image_paths,h_dfs,base_dir,pdf_name,path,page_height,page_width):
    try:
        out_text_path_tesseract = path+'/'+str(pdf_name.split('.pdf')[0])+"_"+"tesseract"+".txt"
        file = open(out_text_path_tesseract, "a")
        dfs = [df for df in h_dfs]
        df_update = pd.concat(dfs, axis=0)
        df_update.to_csv(path+"/"+str(pdf_name.split('.pdf')[0])+'.csv')
        for page_index in range(len(h_dfs)):
            #draw_word_coord(h_dfs[page_index], pdf_image_paths[page_index],page_height,page_width)
            for text in h_dfs[page_index]['text']:
                file.write(str(text)+"\n")
    except:
        pass
    return out_text_path_tesseract

def draw_hist(h_dfs,base_dir, pdf_name,path):
    conf =[]
    try:
        for index in range(len(h_dfs)):
            for word_conf_lis in h_dfs[index]['word_coords']:
                for word_conf in word_conf_lis:
                    conf.append(word_conf['conf'])
        plt.figure(figsize=[10,8])
        n, bins, patches = plt.hist(x=conf, bins=10,color='#0504aa')
        plt.grid(axis='y', alpha=0.75)
        plt.xlabel('Value',fontsize=15)
        plt.ylabel('Frequency',fontsize=15)
        plt.xticks(fontsize=15)
        plt.yticks(fontsize=15)
        plt.ylabel('Frequency',fontsize=15)
        plt.title('Normal Distribution Histogram',fontsize=15)
        plt.savefig(path+'/'+str(pdf_name.split('.pdf')[0]+'_hist.jpg'))
    except:
        pass




def main(lang,input_dir):
    try:
        for pdf_name in glob.glob(input_dir+'/*.pdf'):
            filename = pdf_name.split('/')[-1]
            pdf_filepath      = os.path.join(input_dir, filename)
            
            img_dfs,xml_dfs, page_width, page_height,working_dir, pdf_bg_img_filepaths, pdf_image_paths  = get_xml.process_input_pdf(filename, input_dir, lang)

            ocr_evaluation(xml_dfs,img_dfs,page_height ,page_width,lang,pdf_bg_img_filepaths,pdf_image_paths,filename,base_dir)

    except:
        pass
main(lang,input_dir)