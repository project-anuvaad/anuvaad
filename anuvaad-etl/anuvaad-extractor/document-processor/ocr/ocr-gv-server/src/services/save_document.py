import requests
from config import SAVE_URL, SAVE_NO_PAGE
import src.utilities.app_context as app_context
from flask.json import jsonify
import copy 
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception

def save_page_res(res,file_name):
    try:
        tmp_file = copy.deepcopy(res['rsp'])
        del tmp_file['input']
        tmp_file['files'] =  res['rsp']['outputs']
        del tmp_file['outputs']
        json_file_name = file_name['output'][0]['outputFile']
        for file in [tmp_file]:
            recordID = file['jobID']+'|'+json_file_name
            page_idx = 0
            total_pages = len(file['files'][0]['pages'])
            file['files'][0]['config'] = copy.deepcopy(file['files'][0]['config']['OCR'])
            save_file = copy.deepcopy(file)
            save_file['recordID'] = recordID
            while page_idx<total_pages:
                pages = file['files'][0]['pages'][page_idx:page_idx+SAVE_NO_PAGE]
                save_file['files'][0]['pages'] = pages
                page_idx = page_idx+SAVE_NO_PAGE
                log_info("started saving data to database with record id: "+str(recordID), app_context.application_context)
                rsp = requests.post(SAVE_URL,json=save_file)
                log_info("successfully saved data to database with record id: "+str(recordID), app_context.application_context)
    except Exception as e:
        log_exception("Error occured during saving page response",  app_context.application_context, e)
        
            
        
            




    
    
