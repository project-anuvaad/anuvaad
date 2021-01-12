import numpy as np
from difflib import SequenceMatcher

def remove_space(a):
    return a.strip()

def text_evaluation(compared_regions,boxlevel):

    for idx,region in enumerate(compared_regions):
        tgt_text = region['input']['text']
        gt_text = region['ground']['text']
        gt_text  = remove_space(gt_text)
        tgt_text  = remove_space(tgt_text)
        score = SequenceMatcher(None, gt_text, tgt_text).ratio()
        message = {"ground":True,"input":True}
        if score==0.0:
            if len(gt_text)>0 and len(tgt_text)==0:
                message['input'] = False
            if len(gt_text)==0 and len(tgt_text)>0:
                message['ground'] = False
            if len(gt_text)==0 and len(tgt_text)==0:
                message['ground'] = False
                message['input'] = False
        if score==1.0 and len(gt_text)==0 and len(tgt_text)==0:
            message['ground'] = False
            message['input'] = False

        compared_regions[idx]['ocr_score'] = score
        compared_regions[idx]['status'] = message
        compared_regions[idx]['length_difference'] = abs(len(gt_text)-len(tgt_text))
        
    return compared_regions
