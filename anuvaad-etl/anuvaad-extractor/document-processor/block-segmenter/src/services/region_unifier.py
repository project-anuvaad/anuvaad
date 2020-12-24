from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
from collections import namedtuple
from src.utilities.region_operations import collate_regions, get_polygon,sort_regions
from src.services.segment import horzontal_merging
import src.utilities.app_context as app_context
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


def get_text_region(regions):
    text_region = []
    n_text_regions = []
    for region in regions:
        if region['class']=='TEXT':
            text_region.append(region)
        else :
            n_text_regions.append(region)
    return text_region,n_text_regions

def check_horizon_region(box1,box2):
    if keys.get_right(box1)<keys.get_left(box2):
        return True
    if keys.get_right(box2)<keys.get_left(box1):
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
    if box1_top < box2_top:
       return  merge_condition(reg1,reg2)
    if box1_top > box2_top:
       return  merge_condition(reg2,reg1)



def update_children(reg1,reg2):
    if len(reg1['children']) > 0 :
        if len(reg2['children']) > 0 :
            return sort_regions(reg1['children'] + reg2['children'] , [])
        else :
            return reg1['children']
    else :
        if len(reg2['children']) > 0 :
            return reg2['children']
        else :
            return []


def update_coord(reg1,reg2):
    #try:
    box1_top = keys.get_top(reg1); box1_bottom = keys.get_bottom(reg1)
    box1_left = keys.get_left(reg1); box1_right = keys.get_right(reg1)
    box2_top = keys.get_top(reg2); box2_bottom = keys.get_bottom(reg2)
    box2_left = keys.get_left(reg2); box2_right = keys.get_right(reg2)

    reg1['children'] = update_children(reg1, reg2)

    reg1["boundingBox"]["vertices"][0]['x']= min(box1_left,box2_left)
    reg1["boundingBox"]["vertices"][0]['y']= min(box1_top,box2_top)
    reg1["boundingBox"]["vertices"][1]['x']= max(box1_right,box2_right)
    reg1["boundingBox"]["vertices"][1]['y']= min(box1_top,box2_top)
    reg1["boundingBox"]["vertices"][2]['x']= max(box1_right,box2_right)
    reg1["boundingBox"]["vertices"][2]['y']= max(box1_bottom,box2_bottom)
    reg1["boundingBox"]["vertices"][3]['x']= min(box1_left,box2_left)
    reg1["boundingBox"]["vertices"][3]['y']= max(box1_bottom,box2_bottom)

    return reg1


def is_connected(region1, region2):
    
    region_poly = get_polygon(region2['boundingBox'])
    base_poly = get_polygon(region1['boundingBox'])
    area = base_poly.intersection(region_poly).area
    check = check_distance(region1,region2)
    return  area>0 or check


def remove_overlap(text_regions):
    region_updated = []
    #original_len = len(text_regions)
    #false_count=0
    flag =False
    while len(text_regions)>0:
        check = False
        region_temp= text_regions[1:]
        for idx2,region2 in enumerate(region_temp):
            if is_connected(text_regions[0], region2):
                region1 = update_coord(text_regions[0],region2)
                text_regions[0] = copy.deepcopy(region1)
                check =True 
                flag = True
                del text_regions[idx2+1]
                break    
        if check == False:
            # if  len(text_regions[0]['children'] ) == 0 :
            #     text_regions[0]['children'] = [copy.deepcopy(text_regions[0])]
            region_updated.append(copy.deepcopy(text_regions[0]))
            del text_regions[0]
            #false_count=false_count+1
    return region_updated, flag


def region_unifier(page_lines,page_regions):
    try:
        v_list       = collate_regions(page_regions,page_lines)
        for idx,v_block in enumerate(v_list):
            if len(v_block['children']) > 1 :
                v_block['children'] = horzontal_merging(v_block['children'])
                v_list[idx] =v_block

        text_regions,n_text_regions = get_text_region(v_list)
        
        flag =True
        region_updated, flag = remove_overlap(text_regions)
        while flag==True:
            region_updated, flag = remove_overlap(region_updated)
    except Exception as e:
        log_exception("Error occured during block unifier ",  app_context.application_context, e)
        return None, None

    return region_updated, n_text_regions




    

