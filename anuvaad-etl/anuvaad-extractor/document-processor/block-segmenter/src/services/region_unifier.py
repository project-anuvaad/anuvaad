from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
from collections import namedtuple
from src.utilities.region_operations import collate_regions, MapKeys
keys = MapKeys()

Rectangle = namedtuple('Rectangle', 'xmin ymin xmax ymax')

def get_coord(bboxs):
    coord =[]
    if len(bboxs)>0:
        for bbox in bboxs:
            temp_box = []
            temp_box.append(bbox["boundingBox"]['vertices'][0]['x'])
            temp_box.append(bbox["boundingBox"]['vertices'][0]['y'])
            temp_box.append(bbox["boundingBox"]['vertices'][2]['x'])
            temp_box.append(bbox["boundingBox"]['vertices'][2]['y'])
            coord.append(temp_box)
    return coord

def get_text_region(regions):
    text_region = []
    for region in regions:
        if region['class']=='TEXT':
            text_region.append(region)
    return text_region
def check_horizon_region(box1,box2):
    if keys.get_right(box1)<keys.get_left(box2):# and (keys.get_left(box2)-keys.get_right(box1))<10:
        return True
    if keys.get_right(box2)<keys.get_left(box1):# and (keys.get_left(box1)-keys.get_right(box2))<10:
        return True
    else:
        return False
#def merge_condition()
    
    
def check_distance(reg1,reg2):
    box1_top = keys.get_top(reg1); box1_bottom = keys.get_bottom(reg1)
    box1_left = keys.get_left(reg1); box1_right = keys.get_right(reg1)
    box2_top = keys.get_top(reg2); box2_bottom = keys.get_bottom(reg2)
    box2_left = keys.get_left(reg2); box2_right = keys.get_right(reg2)
    box1_lines = reg1["children"];  box2_lines = reg2["children"]

    box1_top = keys.get_top(reg1)
    box2_top = keys.get_top(reg2)
    if box1_top < box2_top:
        merge_condition()
        box1_last_line = box1_lines[-1]; box2_first_line = box2_lines[0]
        if check_horizon_region(box1_last_line,box2_first_line):
            if (keys.get_left(box2_first_line)-keys.get_right(box1_last_line))<10 or (keys.get_left(box1_last_line)-keys.get_right(box2_first_line))<10:
                return True
            else:
                return False
        if abs(keys.get_left(box1_last_line)-keys.get_left(box2_first_line))<20 and abs(keys.get_right(box1_last_line)-keys.get_right(box2_first_line))<20 and abs(box2_top-box1_bottom)<150:
            return True
        if keys.get_right(box2_first_line)-keys.get_right(box1_last_line)>50 :
            return False
        if keys.get_right(box1_last_line)-keys.get_right(box2_first_line)>50 and abs(box2_top-box1_bottom)<150:
            return True
        
        
    # if box1_top < box2_top and abs(box2_top-box1_bottom)<100 and abs(box1_left-box2_left)<150 and abs(box1_right-box2_right)<150:
    #     return True
    # if box1_top > box2_top and abs(box2_bottom-box1_top)<100 and abs(box1_left-box2_left)<150 and abs(box1_right-box2_right)<150:
    #     return True
    # if (box1_top > box2_top and abs(box2_bottom-box1_top)<100 and abs(box1_left-box2_left)<20) or (box1_top < box2_top and abs(box2_top-box1_bottom)<100 and abs(box1_left-box2_left)<20):
    #     return True
    # if box1_top > box2_top and abs(box2_bottom-box1_top)<100 and abs(box1_right-box2_right)<20 or (box1_top < box2_top and abs(box2_top-box1_bottom)<100 and abs(box1_right-box2_right)<20):
    #     return True
    # if box1_right < box2_left and abs(box1_right-box2_left)<50:
    #     return True
    # if box2_right < box1_left and abs(box2_right-box1_left)<50:
    #     return True

# def update_coord(idx1,idx2,text_regions,reg1,reg2):
#     #try:
#     box1_top = reg1["boundingBox"]['vertices'][0]['y']; box1_bottom = reg1["boundingBox"]['vertices'][2]['y']
#     box1_left = reg1["boundingBox"]['vertices'][0]['x']; box1_right = reg1["boundingBox"]['vertices'][2]['x']
#     box2_top = reg2["boundingBox"]['vertices'][0]['y']; box2_bottom = reg2["boundingBox"]['vertices'][2]['y']
#     box2_left = reg2["boundingBox"]['vertices'][0]['x']; box2_right = reg2["boundingBox"]['vertices'][2]['x']

#     text_regions[idx1]["boundingBox"]["vertices"][0]['x']= min(box1_left,box2_left)
#     text_regions[idx1]["boundingBox"]["vertices"][0]['y']= min(box1_top,box2_top)
#     text_regions[idx1]["boundingBox"]["vertices"][1]['x']= max(box1_right,box2_right)
#     text_regions[idx1]["boundingBox"]["vertices"][1]['y']= min(box1_top,box2_top)
#     text_regions[idx1]["boundingBox"]["vertices"][2]['x']= max(box1_right,box2_right)
#     text_regions[idx1]["boundingBox"]["vertices"][2]['y']= max(box1_bottom,box2_bottom)
#     text_regions[idx1]["boundingBox"]["vertices"][3]['x']= min(box1_left,box2_left)
#     text_regions[idx1]["boundingBox"]["vertices"][3]['y']= max(box1_bottom,box2_bottom)

#     del text_regions[idx2]
#     # except:
#     #     pass
#     return text_regions
def update_region(idx,text_regions,box1_top,box1_left,box2_top,box2_left,box1_bottom,box1_right,box2_bottom,box2_right):
    text_regions[idx]["boundingBox"]["vertices"][0]['x']= min(box1_left,box2_left)
    text_regions[idx]["boundingBox"]["vertices"][0]['y']= min(box1_top,box2_top)
    text_regions[idx]["boundingBox"]["vertices"][1]['x']= max(box1_right,box2_right)
    text_regions[idx]["boundingBox"]["vertices"][1]['y']= min(box1_top,box2_top)
    text_regions[idx]["boundingBox"]["vertices"][2]['x']= max(box1_right,box2_right)
    text_regions[idx]["boundingBox"]["vertices"][2]['y']= max(box1_bottom,box2_bottom)
    text_regions[idx]["boundingBox"]["vertices"][3]['x']= min(box1_left,box2_left)
    text_regions[idx]["boundingBox"]["vertices"][3]['y']= max(box1_bottom,box2_bottom)
    return text_regions


def update_coord(reg1,reg2):
    #try:
    box1_top = reg1["boundingBox"]['vertices'][0]['y']; box1_bottom = reg1["boundingBox"]['vertices'][2]['y']
    box1_left = reg1["boundingBox"]['vertices'][0]['x']; box1_right = reg1["boundingBox"]['vertices'][2]['x']
    box2_top = reg2["boundingBox"]['vertices'][0]['y']; box2_bottom = reg2["boundingBox"]['vertices'][2]['y']
    box2_left = reg2["boundingBox"]['vertices'][0]['x']; box2_right = reg2["boundingBox"]['vertices'][2]['x']

    reg1["boundingBox"]["vertices"][0]['x']= min(box1_left,box2_left)
    reg1["boundingBox"]["vertices"][0]['y']= min(box1_top,box2_top)
    reg1["boundingBox"]["vertices"][1]['x']= max(box1_right,box2_right)
    reg1["boundingBox"]["vertices"][1]['y']= min(box1_top,box2_top)
    reg1["boundingBox"]["vertices"][2]['x']= max(box1_right,box2_right)
    reg1["boundingBox"]["vertices"][2]['y']= max(box1_bottom,box2_bottom)
    reg1["boundingBox"]["vertices"][3]['x']= min(box1_left,box2_left)
    reg1["boundingBox"]["vertices"][3]['y']= max(box1_bottom,box2_bottom)
    #text_regions = update_region(idx2,text_regions,box1_top,box1_left,box2_top,box2_left,box1_bottom,box1_right,box2_bottom,box2_right)
    #text_regions = update_region(idx1,text_regions,box1_top,box1_left,box2_top,box2_left,box1_bottom,box1_right,box2_bottom,box2_right)
    #del text_regions[idx2]
    # except:
    #     pass
    return reg1
def overlappingArea(l1, r1, l2, r2):
		x = 0; y = 1
		area1 = abs(l1[x] - r1[x]) * abs(l1[y] - r1[y])
		area2 = abs(l2[x] - r2[x]) * abs(l2[y] - r2[y])
		check=False
		areaI = ((min(r1[x], r2[x]) -max(l1[x], l2[x])) *(min(r1[y], r2[y]) -max(l1[y], l2[y])))
		thresh = 0
		# if ar==None:
		# 	ar=0
		# if area1<area2 and area1>0:
		# 	if abs(int(ar)/area1)>0.20:
		# 		thresh = abs(int(ar)/area1)
		# 		check=True
		# if area1>area2 and area2>0:
		# 	if abs(int(ar)/area2)>0.20:
		# 		thresh = abs(int(ar)/area2)
		# 		check=True
		if (r2[x] < r1[x] and l2[x] > l1[x] and l2[y] > l1[y] and l2[y] < l1[y]) or (r2[x] > r1[x] and l2[x] < l1[x] and l2[y] < l1[y] and l2[y] > l1[y]):
			check =True
		
		return check

def remove_overlap(coords):
    coord_update = coords
    count=0
    for idx1, coord1 in enumerate(coords):
        for idx2, coord2 in enumerate(coords):
            #ra = Rectangle(coord1[0],coord1[1],coord1[2],coord1[3])
            #rb = Rectangle(coord2[0],coord2[1], coord2[2],coord2[3])
            #ar = self.area(ra, rb)
            l1 = [coord1["boundingBox"]['vertices'][0]['x'],coord1["boundingBox"]['vertices'][0]['y']]; r1 = [coord1["boundingBox"]['vertices'][2]['x'],coord1["boundingBox"]['vertices'][2]['y']]
            l2 = [coord2["boundingBox"]['vertices'][0]['x'],coord2["boundingBox"]['vertices'][0]['y']]; r2 = [coord2["boundingBox"]['vertices'][2]['x'],coord2["boundingBox"]['vertices'][2]['y']]
            check = overlappingArea(l1, r1, l2, r2)
            if check:
                coord_update[idx1][0] = min(coord1[0],coord2[0]); coord_update[idx1][1] = min(coord1[1],coord2[1])
                coord_update[idx1][2] = max(coord1[2],coord2[2]); coord_update[idx1][3] = max(coord1[3],coord2[3])
                del coord_update[idx2+count]
                count=count+1
    return coord_update

# def region_unifier(regions):
#     text_regions = get_text_region(regions)
#     coord_updated =[]
#     skip=[]
#     for idx1,region1 in enumerate(text_regions):
#         #if idx1 in skip:
#             #continue
#         check_unify =False
#         for idx2,region2 in enumerate(text_regions):
#             #if idx2 in skip:
#                 #continue
#             if idx1!=idx2 and check_distance(region1,region2):
#                 region1,text_regions = update_coord(idx1,idx2,text_regions,region1,region2)
#                 check_unify = True
#                 skip.append(idx2)
#         #skip.append(idx1)
#         coord_updated.append(region1)
        
#     coord_updated = remove_overlap(coord_updated)
            

#     return coord_updated


def region_unifier(page_lines,page_regions):
    v_list       = collate_regions(page_regions,page_lines)
    
    text_regions = get_text_region(v_list)
    region_updated = []
    region_temp = text_regions

    while len(text_regions)>0:
        check = False
        for idx2,region2 in enumerate(region_temp):
            if check_distance(text_regions[0],region2):
                region1 = update_coord(text_regions[0],region2)
                text_regions[0] = region1
                check =True 
                del region_temp[idx2]
        if check == False:
            region_updated.append(text_regions[0])
            del text_regions[0]
        
    #region_updated = remove_overlap(region_updated)
            

    return region_updated




    

