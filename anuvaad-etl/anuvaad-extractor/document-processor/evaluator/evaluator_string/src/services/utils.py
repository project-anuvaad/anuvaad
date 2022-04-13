def bound_coordinate(corrdinate,max):
    if corrdinate < 0 :
        corrdinate = 0
    if corrdinate > max:
        corrdinate = max - 2
    return int(corrdinate)
def process_text(text,img,conf_dict,coord,language):
	try:
		f_text = float(text)
		if f_text == int(f_text) or len(conf_dict['conf'])==0:
			coord[0,0]=coord[0,0]-5; coord[1,0]=coord[1,0]+5
			coord[2,0]=coord[2,0]+5; coord[3,0]=coord[3,0]-5
			crop_image = get_image_from_box(img, coord, height=abs(coord[0,1]-coord[2,1]))
			text  = pytesseract.image_to_string(crop_image, lang='hin',config="--psm 10 --oem 3 -c tessedit_char_whitelist=0123456789.,)(|/।|;:@#$%&`!?-_")
			if len(text)==0:
				text = pytesseract.image_to_string(img, lang="Devanagari "+LANG_MAPPING[language][0])
		return text
	except:
		return text



def process_dfs(temp_df):
	temp_df = temp_df[temp_df.text.notnull()]
	text = ""
	conf=0
	temp_dict1 ={"text":[],"conf":[]}
	for index, row in temp_df.iterrows():
		#temp_dict2 = {}
		conf = conf + row["conf"]
		temp_dict1["text"].append(row['text'])
		temp_dict1["conf"].append(row['conf'])
		text = text +" "+ str(row['text'])
		#temp_dict1.append(temp_dict2)
	return text,temp_dict1

def merger_text(line):
    text = ""
    word_count=0
    for word_idx, word in enumerate(line['regions']):
        if "text" in word.keys() and word["text"].replace(" ", "") != "":
            text = text+" "+ word["text"]
            word_count=word_count+1
    return text, word_count

def get_coord(bbox):
    temp_box = []
    temp_box_cv = []
    temp_box.append([bbox["boundingBox"]['vertices'][0]['x'],bbox["boundingBox"]['vertices'][0]['y']])
    temp_box.append([bbox["boundingBox"]['vertices'][1]['x'],bbox["boundingBox"]['vertices'][1]['y']])
    temp_box.append([bbox["boundingBox"]['vertices'][2]['x'],bbox["boundingBox"]['vertices'][2]['y']])
    temp_box.append([bbox["boundingBox"]['vertices'][3]['x'],bbox["boundingBox"]['vertices'][3]['y']])
    
    temp_box_cv.append(bbox["boundingBox"]['vertices'][0]['x'])
    temp_box_cv.append(bbox["boundingBox"]['vertices'][0]['y'])
    temp_box_cv.append(bbox["boundingBox"]['vertices'][2]['x'])
    temp_box_cv.append(bbox["boundingBox"]['vertices'][2]['y'])
    temp_box = np.array(temp_box)
    return temp_box,temp_box_cv
def frequent_height(page_info):
    text_height = []
    if len(page_info) > 0 :
        for idx, level in enumerate(page_info):
            coord_crop,coord = get_coord(level)
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
    mismatch_count = levenshtein(tgt_text, gt_text)
    match_count = abs(max(len(gt_text),len(tgt_text))-mismatch_count)
    score = match_count/max(len(gt_text),len(tgt_text))
    

#    matchs = list(SequenceMatcher(None, gt_text, tgt_text).get_matching_blocks())
#    match_count=0
##    match_lis = []
#    for match in matchs:
#        match_count = match_count + match.size
 
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
    tmp=0
        
    region['boundingBox']= {'vertices'  : [{'x':box[0]['x']-crop_factor,'y':box[0]['y']-crop_factor_y},\
                                                                 {'x':box[1]['x']+crop_factor+tmp,'y':box[1]['y']-crop_factor_y},\
                                                                 {'x':box[2]['x']+crop_factor+tmp,'y':box[2]['y']+crop_factor_y},\
                                                                 {'x':box[3]['x']-crop_factor,'y': box[3]['y']+crop_factor_y}]}
    return region
 


def sort_line(line):
    line['regions'].sort(key=lambda x: x['boundingBox']['vertices'][0]['x'],reverse=False)
    return line
