from difflib import SequenceMatcher

def remove_space(a):
    return a.replace(" ", "")

def text_evaluation(compared_regions,boxlevel):
    
    for idx,region in enumerate(compared_regions):
        if region['input']!=None and region['ground']!=None and 'text' in region['input'].keys() and 'text' in region['ground'].keys():
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
        else:
            message = {"ground":True,"input":True}
            leng_diff = 0
            if region['input']==None:# and region['ground']!=None:
                message['input'] = False
                #leng_diff = len(region['ground']['text'])
            if region['ground']==None :#and region['input']!=None:
                message['ground'] = False
                #leng_diff = len(region['input']['text'])
            # if region['ground']==None and region['input']==None:
            #     message['ground'] = False
            #     message['input'] = False
            #     leng_diff =0
            compared_regions[idx]['status'] = message
            compared_regions[idx]['ocr_score'] = 0.0
            compared_regions[idx]['length_difference'] = leng_diff
                

        
    return compared_regions
