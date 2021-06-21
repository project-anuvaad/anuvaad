#logging.basicConfig(level=logging.INFO, filename=config.LOGS, format='%(asctime)s-%(levelname)s-%(message)s')
import os
import sys
import json
import config
import logging
import requests
from time import sleep
import config


class InitRequest:
    
    def __init__(self,file_id,f_type,header,lang):
        self.file_id = file_id
        self.header = {'auth-token' :header}
        self.lang= lang
        self.type = f_type
        self.ocr()
        self.download_file()
        return self.ocr_json

    def ocr(self):
        self.init_request()
        self.ocr_file_id = self.bulk_serach()

    def init_request(self):
        try :
            file = {
                    "workflowCode":config.WF_CODE,
                    "files": [{ "path":str(self.file_id),
                                "type": self.type,
                                "locale":self.lang,
                                 "config":{"OCR": {"option": "HIGH_ACCURACY","language": self.lang}
                            }}]
                    }

            #logging.info('OCR   for {}'.format(self.file_name))
            if self.header is not None :
                res  = requests.post(config.WF_INIT,json=file,headers=self.header)
            else:
                res  = requests.post(config.WF_INIT,json=file)
                
            self.job_id = res.json()['jobID']
            
        except Exception as e:
            #logging.error('Error in initiating WF requeest for {} due to {} '.format(self.file_name ,e),exc_info=True)
            self.job_id = None


    def bulk_serach(self):
        if self.job_id is not None :
            bs_request = {
        "jobIDs": [self.job_id],
        "taskDetails":"false"
        }
        #logging.info('process started for file  {} with job id {}'.format(self.file_name,self.job_id))        
        res = requests.post(config.SEARCH,json=bs_request,headers=self.header, timeout = 10000)
        #print(res.json()['jobs'][0]['status'])
        retry=0
        while(1):
            
            try :
                r_j = res.json()
                progress = r_j['jobs'][0]['status']
                #print(progress)
            except Exception as e :
                #logging.error('Error in bulk serach for {} due to {} '.format(self.file_name ,e),exc_info=True)
                progress='p'
                retry +=1
                
            if retry > 10:
                return None
             
            
            if progress in ['COMPLETED','FAILED','SUCCESS']:
                if progress is 'FAILED':
                    #logging.error('Process faild for file  {} with job id {} '.format(self.file_name,self.job_id ))
                    return None
                else :
                    print(progress)
                    print(r_j)
                    outputfile = r_j['jobs'][0]['output'][0]['outputFile']
                    print(outputfile)
                    return outputfile
            sleep(1)
            
            res = requests.post(config.SEARCH,json=bs_request,headers=self.header, timeout = 10000)
            
    def download_file(self):
        if self.ocr_file_id is not None:
            try:
                download_url = config.DOWNLOAD + str(self.ocr_file_id)
                res = requests.get(download_url,headers=self.header)
                self.ocr_json = res.json()
            except Exception as e:
                #logging.error('Error in downloading file  {} \n {}  '.format(self.tok_json,e ),exc_info=True)
                self.ocr_json =None
        else:
            self.ocr_json = None


