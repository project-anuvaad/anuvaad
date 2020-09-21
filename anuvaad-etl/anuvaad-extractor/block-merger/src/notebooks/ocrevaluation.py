import os
import sys
import io
import glob

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

    header_region, footer_region = prepocess_pdf_regions(xml_dfs, page_height)
    in_dfs, table_dfs, line_dfs,bg_dfs = get_text_table_line_df(xml_dfs, img_dfs, pdf_bg_img_filepaths)
    h_dfs = get_xml.get_hdfs(in_dfs, header_region, footer_region)
    h_dfs = tesseract_ocr(pdf_image_paths, page_width, page_height, h_dfs, lang)
    #draw_hist(h_dfs,base_dir, filename,path)
    #out_text_path_vision = google_vision_image_to_string(pdf_image_paths,base_dir,filename,path)
    out_text_path_tesseract = tesseract_image_to_string(pdf_image_paths,h_dfs,base_dir,filename,path)
    #subprocess.run(["java", "-cp","/home/naresh/Tarento/hw-recog-be-lines_ocr_deep_learning_machine_v2/src/ocrevalUAtion-1.3.4-jar-with-dependencies.jar","eu.digitisation.Main","-gt",str(out_text_path_vision),"-ocr",str(out_text_path_tesseract),"-o",str(base_dir+'/ocrevaluation/'+str(filename.split('.pdf')[0])+'/'+str(filename.split('.pdf')[0])+".html")],stdout=subprocess.PIPE)


def tesseract_image_to_string(pdf_image_paths,h_dfs,base_dir,pdf_name,path):
    try:
        out_text_path_tesseract = path+'/'+str(pdf_name.split('.pdf')[0])+"_"+"tesseract"+".txt"
        file = open(out_text_path_tesseract, "a")
        dfs = [df for df in h_dfs]
        df_update = pd.concat(dfs, axis=1)
        df_update.to_csv(path+"/"+str(pdf_name.split('.pdf')[0])+'.csv')
        for page_index in range(len(h_dfs)):
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