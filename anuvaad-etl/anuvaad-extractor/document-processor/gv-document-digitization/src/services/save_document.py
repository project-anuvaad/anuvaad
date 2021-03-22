import requests
from config import SAVE_URL, SAVE_NO_PAGE
import src.utilities.app_context as app_context
from flask.json import jsonify
import copy 

def save_page_res(res):
    tmp_file = copy.deepcopy(res['rsp'])
    del tmp_file['input']
    tmp_file['files'] =  res['rsp']['outputs']
    del tmp_file['outputs']
    for file in [tmp_file]:
        page_idx = 0
        total_pages = len(file['files'][0]['pages'])
        while page_idx<total_pages:
            save_file = copy.deepcopy(file)
            pages = file['files'][0]['pages'][page_idx:page_idx+SAVE_NO_PAGE]
            save_file['files'][0]['pages'] = pages
            page_idx = page_idx+SAVE_NO_PAGE
            #rsp = requests.post(SAVE_URL,json=file)
        
            




    
    
