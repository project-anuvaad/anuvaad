import requests
from config import SAVE_URL, SAVE_NO_PAGE
import src.utilities.app_context as app_context
from flask.json import jsonify

def save_page_res(res):
    files = res['rsp']['inputs']
    for file in files:
        flag = True
        page_idx = 0
        while flag:
            pages = file['pages'][page_idx:page_idx+SAVE_NO_PAGE]
            file['pages'] = pages
            page_idx = page_idx+SAVE_NO_PAGE
            if page_idx>=len(file['pages']):
                flag=False
            rsp = requests.post(SAVE_URL,json=jsonify(file))
        
            




    
    
