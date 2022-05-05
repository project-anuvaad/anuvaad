from shapely.geometry import Polygon
from collections import Counter
from src.services.horizontal_merging import horzontal_merging
from rtree import index
import copy
import numpy as np
import src.utilities.app_context as app_context
import uuid, os, io, sys
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
    def get_height(self,box):
        height = int(abs(self.get_top(box) - self.get_bottom(box)))
        return height
    def get_width(self,box):
        width =  int(abs(self.get_left(box) - self.get_right(box)))
        return width

keys = MapKeys()

class RemoveOverlap:
    def __init__(self):
        self.left    =  None
        self.right   =  None
        self.top     =  None
        self.bottom  =  None
    def update_coord(self,reg1,reg2):
        try:
            box1_top = keys.get_top(reg1); box1_bottom = keys.get_bottom(reg1)
            box1_left = keys.get_left(reg1); box1_right = keys.get_right(reg1)
            box2_top = keys.get_top(reg2); box2_bottom = keys.get_bottom(reg2)
            box2_left = keys.get_left(reg2); box2_right = keys.get_right(reg2)


            reg1["boundingBox"]["vertices"][0]['x']= min(box1_left,box2_left)
            reg1["boundingBox"]["vertices"][0]['y']= min(box1_top,box2_top)
            reg1["boundingBox"]["vertices"][1]['x']= max(box1_right,box2_right)
            reg1["boundingBox"]["vertices"][1]['y']= min(box1_top,box2_top)
            reg1["boundingBox"]["vertices"][2]['x']= max(box1_right,box2_right)
            reg1["boundingBox"]["vertices"][2]['y']= max(box1_bottom,box2_bottom)
            reg1["boundingBox"]["vertices"][3]['x']= min(box1_left,box2_left)
            reg1["boundingBox"]["vertices"][3]['y']= max(box1_bottom,box2_bottom)
            
            
        except:
            pass

        return reg1
    def get_polygon(self,region):
        points = []
        vertices = region['vertices']
        for point in vertices:
            points.append((point['x'], point['y']))
        if not (max(points)==(0,0) and min(points)==(0,0)):
            poly = Polygon(points)
            if not poly.is_valid:
                poly = poly.buffer(0.01)
            return poly
        else:
            return False

    def is_connected(self,region1, region2):
            
        region_poly = self.get_polygon(region2['boundingBox'])
        base_poly = self.get_polygon(region1['boundingBox'])
        area=0
        if region_poly and base_poly:
            #area = base_poly.intersection(region_poly).area
            area = base_poly.intersection(region_poly)

        if area:
            return True
        else:
            return False

    def merge_overlap(self,text_regions):
        region_updated = []
        flag =False
        while len(text_regions)>0:
            check = False
            region_temp= text_regions[1:]
            
            for idx2,region2 in enumerate(region_temp):
                cond = self.is_connected(text_regions[0], region2)
                if cond:
                    region1 = self.update_coord(text_regions[0],region2)
                    text_regions[0] = copy.deepcopy(region1)
                    check =True ;  flag = True
                    del text_regions[idx2+1]
                    break    
            if check == False:
                region_updated.append(copy.deepcopy(text_regions[0]))
                del text_regions[0]
        return region_updated, flag
    def remove_overlap(self,layouts):
        flag=True
        #while flag==True:
        layouts, flag = self.merge_overlap(layouts)
        return layouts

removeoverlap = RemoveOverlap()
def get_coord(bbox):
    temp_box_cv = []
    temp_box_cv.append(bbox["boundingBox"]['vertices'][0]['x'])
    temp_box_cv.append(bbox["boundingBox"]['vertices'][0]['y'])
    temp_box_cv.append(bbox["boundingBox"]['vertices'][2]['x'])
    temp_box_cv.append(bbox["boundingBox"]['vertices'][2]['y'])
    return temp_box_cv
def frequent_height(regions):
    text_height = []
    if len(regions) > 0 :
        for idx, level in enumerate(regions):
            coord = get_coord(level)
            if len(coord)!=0:
                text_height.append(abs(coord[3]-coord[1]))
        occurence_count = Counter(text_height)
        return occurence_count.most_common(1)[0][0]
    else :
        return  0
def sort_regions(region_lines, sorted_lines=[]):
    check_y =region_lines[0]['boundingBox']['vertices'][0]['y']
    spacing_threshold = abs(check_y - region_lines[0]['boundingBox']['vertices'][3]['y'])* 0.8  # *2 #*0.5
    same_line =  list(filter(lambda x: (abs(x['boundingBox']['vertices'][0]['y']  - check_y) <= spacing_threshold), region_lines))
    next_line =   list(filter(lambda x: (abs(x['boundingBox']['vertices'][0]['y']  - check_y) > spacing_threshold), region_lines))
    if len(same_line) >1 :
       same_line.sort(key=lambda x: x['boundingBox']['vertices'][0]['x'],reverse=False)
    sorted_lines += same_line
    if len(next_line) > 0:
        sort_regions(next_line, sorted_lines)
    return sorted_lines


def collate_regions(regions, lines, child_class=None, grand_children=False,region_flag = False,skip_enpty_children=False,add_font=False ):
    child_key='regions'
    idx = index.Index()
    lines_intersected = []
   
    if regions !=None and len(regions) > 0:
        lines_intersected =[]
        for line_idx, line in enumerate(lines):
            poly = removeoverlap.get_polygon(line['boundingBox'])
            if poly:
                idx.insert(line_idx, poly.bounds)
        for region_index, region in enumerate(regions):
            
            region_poly = removeoverlap.get_polygon(region['boundingBox'])
            children_lines =[]
            if region_poly:
                children_lines = list(idx.intersection(region_poly.bounds))
            if len(children_lines) > 0:
                region_lines = []
                for intr_index in children_lines:
                    if intr_index not in lines_intersected:                        
                        line_poly = removeoverlap.get_polygon(lines[intr_index]['boundingBox'])
                        if line_poly:
                            area = region_poly.intersection(line_poly).area
                            reg_area = region_poly.area
                            line_area = line_poly.area
                            if reg_area>0 and line_area>0 and area/min(line_area,reg_area) >0.5 :
                                region_lines.append(lines[intr_index])
                                lines_intersected.append(intr_index)
                    
                region_lines.sort(key=lambda x:x['boundingBox']['vertices'][0]['y'])
                
                if len(region_lines) > 0:
                    regions[region_index][child_key] = sort_regions(region_lines,[])
                else:
                    regions[region_index][child_key] = []
            else:
                regions[region_index][child_key] = []

    if region_flag:
        for line_index, line in enumerate(lines):
            if line_index not in lines_intersected:
                line[child_key] = [ copy.deepcopy(line)]
                if child_class is not None:
                    if child_class is 'LINE':
                        line['class'] = 'PARA'
                    if child_class is 'WORD':
                        line['class'] ='LINE'
                regions.append(line)

    return regions
def merger_lines_words(lines,words):
    updated_lines = []
    mode_height = frequent_height(lines)
    for idx,line in enumerate(lines):
        box_top = keys.get_top(line); box_bottom = keys.get_bottom(line)
        if abs(box_bottom-box_top)>mode_height:
            updated_line =  collate_regions(regions = copy.deepcopy([line]),lines = copy.deepcopy(words),grand_children=False,region_flag = False)
            h_lines      =  horzontal_merging(updated_line[0]['regions'])
            if h_lines!=None and len(h_lines)>0:
                updated_lines.extend(h_lines)
            else:
                updated_lines.extend(updated_line)
        else:
            updated_lines.append(line)
    return updated_lines

