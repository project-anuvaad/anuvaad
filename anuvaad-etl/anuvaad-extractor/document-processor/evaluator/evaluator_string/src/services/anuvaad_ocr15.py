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

digitization = False


craft_line = "True"
craft_word = "True"
google_ocr= "True"
tess_ocr= "True"
language = "hi"

path = '/home/ubuntu/tesseract_evaluation_hindi/tesseract_evaluation/data/'
output_path = '/home/ubuntu/tesseract_evaluation_hindi/tesseract_evaluation/result/'
output_path_boxes= '/home/ubuntu/tesseract_evaluation_hindi/tesseract_evaluation/test_word_boxes/'
base_path = '/home/ubuntu/tesseract_evaluation_hindi/tesseract_evaluation/test_word_boxes/'


token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyTmFtZSI6ImRoaXJhai5kYWdhQHRhcmVudG8uY29tIiwicGFzc3dvcmQiOiJiJyQyYiQxMiRxaTFuOTBwRXAvYnV6WFpwQi5LdmFlY3BEQXBGT2ZkQUcvMENmcU9taHFsYnp3bkJYczBIbSciLCJleHAiOjE2MjA0NjY0NzB9.MpNKKtgw5BnTEoN_nHXYjp3Mx1QY4atrn_9nTTDxmNA'
word_url = "https://auth.anuvaad.org/anuvaad-etl/wf-manager/v1/workflow/async/initiate"
google_url = "https://auth.anuvaad.org/anuvaad-etl/wf-manager/v1/workflow/async/initiate"
layout_url = "https://auth.anuvaad.org/anuvaad-etl/wf-manager/v1/workflow/async/initiate"
segmenter_url = "https://auth.anuvaad.org/anuvaad-etl/wf-manager/v1/workflow/async/initiate"
bs_url ="https://auth.anuvaad.org/anuvaad-etl/wf-manager/v1/workflow/jobs/search/bulk"
evaluator_url  = "https://auth.anuvaad.org/anuvaad-etl/document-processor/evaluator/v0/process"
download_url ="https://auth.anuvaad.org/download/"
upload_url = 'https://auth.anuvaad.org/anuvaad-api/file-uploader/v0/upload-file'


headers = {
    'auth-token' :token }

def google_ocr_v15(url,headers,pdf_name):
    
    file = {
       "files": [
        {
            "locale": language,
            "path": pdf_name,
            "type": "pdf",
            "config":{
        "OCR": {
          "option": "HIGH_ACCURACY",
          "language": language,
          "top_correction":"True",
          "craft_word": craft_word,
          "craft_line": craft_line,
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


def main():
    if digitization:
        pdf_names = glob.glob(path + '/*.pdf')
        return evaluate__and_save_input(pdf_names,output_path,headers,word_url,layout_url,download_url,upload_url,bs_url)
        





