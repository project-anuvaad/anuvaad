from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
from collections import namedtuple
from src.utilities.region_operations import collate_regions, get_polygon
from src.services.segment import horzontal_merging, break_block
from shapely.geometry import Polygon
from rtree import index
import copy
Rectangle = namedtuple('Rectangle', 'xmin ymin xmax ymax')

class MapKeys:
    def __init__(self):
        self.left    =  None
        self.right   =  None
        self.top     =  None
        self.bottom  =  None

    def get_left(self,box):
        left = int(box['boundingBox']['vertices'][0]['x'])
        return left

    def get_right(self,box):
        right = int(box['boundingBox']['vertices'][1]['x'])
        return right

    def get_top(self,box):
        top = int(box['boundingBox']['vertices'][0]['y'])
        return top

    def get_bottom(self,box):
        bottom = int(box['boundingBox']['vertices'][3]['y'])
        return bottom

keys = MapKeys()

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
def merge_condition(reg1,reg2):
    
    box1_top = keys.get_top(reg1); box1_bottom = keys.get_bottom(reg1)
    box1_left = keys.get_left(reg1); box1_right = keys.get_right(reg1)
    box2_top = keys.get_top(reg2); box2_bottom = keys.get_bottom(reg2)
    box2_left = keys.get_left(reg2); box2_right = keys.get_right(reg2)
    box1_lines = reg1["children"];  box2_lines = reg2["children"]
    
    if box1_lines!= None and len(box1_lines)>0 and box2_lines!=None and len(box2_lines)>0:
        box1_last_line = box1_lines[-1]; box2_first_line = box2_lines[0]
        if check_horizon_region(reg1,reg2):
            if (0<(keys.get_left(reg2)-keys.get_right(reg1))<10 and abs(box2_top-box1_bottom)<100) or (0<(keys.get_left(reg1)-keys.get_right(reg2))<10 and abs(box2_top-box1_bottom)<100):
                return True
            else:
                return False
        if abs(keys.get_left(box1_last_line)-keys.get_left(box2_first_line))<50 and abs(keys.get_right(box1_last_line)-keys.get_right(box2_first_line))<50 and abs(box2_top-box1_bottom)<150:
            return True
        if keys.get_right(box2_first_line)-keys.get_right(box1_last_line)>50 :
            return False
        if keys.get_right(box1_last_line)-keys.get_right(box2_first_line)>100 and abs(box2_top-box1_bottom)<80:
            return True
        if abs(box2_top-box1_bottom)<100 and abs(box1_left-box2_left)<50 and abs(box1_right-box2_right)<50:
            return True
        if (abs(box1_bottom-box2_top)<50 and abs(box1_left-box2_left)<10) or (abs(box1_bottom-box2_top)<50 and abs(box1_right-box2_right)<10):
            return True
        
    else:
        if abs(box2_top-box1_bottom)<100 and abs(box1_left-box2_left)<50 and abs(box1_right-box2_right)<50:
            return True
        
    
    
def check_distance(reg1,reg2):
    

    box1_top = keys.get_top(reg1)
    box2_top = keys.get_top(reg2)
    #return merge_condition(reg1,reg2)
    if box1_top < box2_top:
       return  merge_condition(reg1,reg2)
    if box1_top > box2_top:
       return  merge_condition(reg2,reg1)




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

# def remove_overlap(coords):
#     coord_update = coords
#     count=0
#     for idx1, coord1 in enumerate(coords):
#         for idx2, coord2 in enumerate(coords):
#             #ra = Rectangle(coord1[0],coord1[1],coord1[2],coord1[3])
#             #rb = Rectangle(coord2[0],coord2[1], coord2[2],coord2[3])
#             #ar = self.area(ra, rb)
#             l1 = [coord1["boundingBox"]['vertices'][0]['x'],coord1["boundingBox"]['vertices'][0]['y']]; r1 = [coord1["boundingBox"]['vertices'][2]['x'],coord1["boundingBox"]['vertices'][2]['y']]
#             l2 = [coord2["boundingBox"]['vertices'][0]['x'],coord2["boundingBox"]['vertices'][0]['y']]; r2 = [coord2["boundingBox"]['vertices'][2]['x'],coord2["boundingBox"]['vertices'][2]['y']]
#             check = overlappingArea(l1, r1, l2, r2)
#             if check:
#                 coord_update[idx1][0] = min(coord1[0],coord2[0]); coord_update[idx1][1] = min(coord1[1],coord2[1])
#                 coord_update[idx1][2] = max(coord1[2],coord2[2]); coord_update[idx1][3] = max(coord1[3],coord2[3])
#                 del coord_update[idx2+count]
#                 count=count+1
#     return coord_update

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
# def remove_overlap(text_regions):

#     region_updated = []
#     region_temp = copy.deepcopy(text_regions)

#     while len(text_regions)>0:
#         #idx = index.Index()
#         base_poly = get_polygon(text_regions[0]['boundingBox'])
#         #idx.insert(0, poly.bounds)
#         check = False
        
#         for idx2,region2 in enumerate(region_temp):
#             #print(len(region_temp),text_regions[0]["boundingBox"]['vertices'][0]['y'] )
#             print(base_poly.area)
#             region_poly = get_polygon(region2['boundingBox'])
#             #intersect_region = list(idx.intersection(region_poly.bounds))
#             area = base_poly.intersection(region_poly).area 
#             if area>0:
#                 print("xxxx")
#                 region1 = update_coord(text_regions[0],region2)
#                 text_regions[0] = copy.deepcopy(region1)
#                 check =True 
#                 del region_temp[idx2]
#         print("forrrrrrrrrrrrrrrr")     
#         if check == False:
#             print("yyyyyyyyyyyyyyy")
#             text_regions[0]['children']= None
#             region_updated.append(copy.deepcopy(text_regions[0]))
#             #region_updated.append(text_regions[0])
#             del text_regions[0]
#     return region_updated
def remove_overlap(text_regions):

    region_updated = []
    

    while len(text_regions)>0:
        #idx = index.Index()
        base_poly = get_polygon(text_regions[0]['boundingBox'])
        #idx.insert(0, poly.bounds)
        check = False
        print("lllllll",len(text_regions))
        region_temp = text_regions[1:]
        for idx2,region2 in enumerate(region_temp):
            #print(len(region_temp),text_regions[0]["boundingBox"]['vertices'][0]['y'] )
            #print(base_poly.area)
            region_poly = get_polygon(region2['boundingBox'])
            #intersect_region = list(idx.intersection(region_poly.bounds))
            area = base_poly.intersection(region_poly).area 
            if area>0:
                print("xxxx")
                region1 = update_coord(text_regions[0],region2)
                text_regions[0] = copy.deepcopy(region1)
                check =True 
                #del region_temp[idx2]
                
                #del text_regions[idx2+1]
                print(idx2, len(text_regions))

                #break

        #print("forrrrrrrrrrrrrrrr")     
        if check == False:
            #print("yyyyyyyyyyyyyyy")
            text_regions[0]['children']= None
            region_updated.append(copy.deepcopy(text_regions[0]))
            #region_updated.append(text_regions[0])
            del text_regions[0]
    return region_updated


def region_unifier(page_lines,page_regions):
    v_list       = collate_regions(page_regions,page_lines)
    for idx,v_block in enumerate(v_list):
        if len(v_block['children']) > 1 :
            v_block['children'] = horzontal_merging(v_block['children'])
            v_list[idx] =v_block

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
            text_regions[0]['children']= None
            region_updated.append(text_regions[0])
            del text_regions[0]
    #print("lengggggggggggggg",len(region_updated))
    region_updated = remove_overlap(region_updated)
    #print("lengggggggggggggg2",len(region_updated))
            

    return region_updated




    

