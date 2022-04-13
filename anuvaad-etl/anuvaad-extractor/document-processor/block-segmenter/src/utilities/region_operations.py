from shapely.geometry import Polygon
from rtree import index
import copy
import uuid


class Box:

    def __init__(self):
        self.box= {}
        self.box['boundingBox'] = {'vertices':[{'x':0,'y':0} ,{'x':0,'y':0},{'x':0,'y':0},{'x':0,'y':0}]}
        self.box['identifier'] = str(uuid.uuid4())
        self.box['text'] = ''
        self.box['class']  ='TEXT'
        self.box['font'] = {'family':'Arial Unicode MS', 'size':0, 'style':'REGULAR'}


    def get_box(self):
        return  self.box


class MapKeys:
    def __init__(self,box):
        self.box     =  box
        self.left    =  None
        self.right   =  None
        self.top     =  None
        self.height  =  None
        self.width   =  None
        self.bottom  =  None

    def get_left(self):
        if self.left != None:
            return self.left
        else :
            self.left = int(self.box['boundingBox']['vertices'][0]['x'])
            return self.left

    def get_right(self):
        if self.right != None:
            return self.right
        else :
            self.right = int(self.box['boundingBox']['vertices'][1]['x'])
            return self.right

    def get_top(self):
        if self.top != None:
            return self.top
        else :
            self.top = int(self.box['boundingBox']['vertices'][0]['y'])
            return self.top

    def get_bottom(self):
        if self.bottom != None:
            return self.bottom
        else :
            self.bottom = int(self.box['boundingBox']['vertices'][3]['y'])
            return self.bottom

    def get_height(self):
        if self.height != None:
            return self.height
        else :
            self.height = int(abs(self.get_top() - self.get_bottom()))
            return self.height

    def get_width(self):
        if self.width != None:
            return self.width
        else :
            self.width =  int(abs(self.get_left() - self.get_right()))
            return self.width



def index_tree(poly_index, poly, idx):
    idx.insert(poly_index, poly.bounds)


def get_polygon(region):
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

def collate_regions(regions, lines,grand_children=False,region_flag = True,skip_enpty_children=False):
    idx = index.Index()
    lines_intersected = []
    if regions !=None and len(regions) > 0:
        lines_intersected =[]
        for line_idx, line in enumerate(lines):
            poly = get_polygon(line['boundingBox'])
            if poly:
                idx.insert(line_idx, poly.bounds)
        for region_index, region in enumerate(regions):
            region_poly = get_polygon(region['boundingBox'])
            children_lines =[]
            if region_poly:
                children_lines = list(idx.intersection(region_poly.bounds))
            if len(children_lines) > 0:
                region_lines = []
                for intr_index in children_lines:
                    if intr_index not in lines_intersected:
                        if grand_children :
                            if 'children' not in lines[intr_index].keys():
                                lines[intr_index]['children'] = [copy.deepcopy(lines[intr_index])]
                    
                        line_poly = get_polygon(lines[intr_index]['boundingBox'])
                        if line_poly:
                            area = region_poly.intersection(line_poly).area
                            reg_area = region_poly.area
                            line_area = line_poly.area
                            if reg_area>0 and line_area>0 and area/min(line_area,reg_area) >0.5 :
                                region_lines.append(lines[intr_index])
                                lines_intersected.append(intr_index)
                region_lines.sort(key=lambda x:x['boundingBox']['vertices'][0]['y'])
                if len(region_lines) > 1:
                    regions[region_index]['children'] = sort_regions(region_lines,[])
                    regions[region_index]['avg_size'] = get_avrage_size(region_lines)
                else :
                    regions[region_index]['children']  = region_lines
                    regions[region_index]['avg_size'] = get_avrage_size(region_lines)
            else:
                if not skip_enpty_children :
                    if grand_children :
                        regions[region_index]['children'] = [copy.deepcopy(regions[region_index])]
                    regions[region_index]['children'] = [copy.deepcopy(regions[region_index])]
    #orphan_lines = []
    if region_flag:
        for line_index, line in enumerate(lines):
            if line_index not in lines_intersected:
                line['children'] = [ copy.deepcopy(line)]
                regions.append(line)

    return regions




def remvoe_regions(regions, lines):
    idx = index.Index()
    lines_intersected = []
    not_intersecting  = []
    if regions !=None and len(regions) > 0:
        lines_intersected =[]
        for line_idx, line in enumerate(lines):
            poly = get_polygon(line['boundingBox'])
            if poly:
                idx.insert(line_idx, poly.bounds)
        for region_index, region in enumerate(regions):
            region_poly = get_polygon(region['boundingBox'])
            if region_poly:
                children_lines = list(idx.intersection(region_poly.bounds))
                if len(children_lines) > 0:
                    region_lines = []
                    for intr_index in children_lines:
                        region_lines.append(lines[intr_index])
                        lines_intersected.append(intr_index)

    for line_index, line in enumerate(lines):
        if line_index not in lines_intersected:
            not_intersecting.append(line)

    return not_intersecting





def get_ngram(indices, window_size = 2):
    ngrams = []
    count  = 0
    for token in indices[:len(indices)-window_size+1]:
        ngrams.append(indices[count:count+window_size])
        count = count+1
    return ngrams

def are_hlines(region1,region2,avg_ver_ratio):

    space = abs( region1['boundingBox']['vertices'][0]['y'] - region2['boundingBox']['vertices'][0]['y'])
    sepration = region2['boundingBox']['vertices'][0]['x'] - region1['boundingBox']['vertices'][1]['x']
    h1 = abs(region1['boundingBox']['vertices'][3]['y'] - region1['boundingBox']['vertices'][0]['y'])
    h2 = abs(region2['boundingBox']['vertices'][3]['y'] - region2['boundingBox']['vertices'][0]['y'])
    max_height = max( h1 , h2 ) #*0.5
    if avg_ver_ratio < 1.8 :
        diff_threshold = max_height * 0.8

    if avg_ver_ratio >= 1.8 :
        diff_threshold = max_height * 0.9

    #return ((space <= diff_threshold ) or(sepration <= 3 *avg_height)) and  (sepration < 6 * avg_height) and (space <= diff_threshold *2.5 )
    return  sepration  < 5 * max_height  and space <= diff_threshold


def merge_text(v_blocks):
    for block_index, v_block in enumerate(v_blocks):
        try:
            v_blocks[block_index]['font']    ={'family':'Arial Unicode MS', 'size':0, 'style':'REGULAR'}
            v_blocks['font']['size'] = max(v_block['children'], key=lambda x: x['font']['size'])['font']['size']
            if len(v_block['children']) > 0 :
                v_blocks[block_index]['text'] = v_block['children'][0]['text']
                if  len(v_block['children']) > 1:
                    for child in range(1, len(v_block['children'])):
                        v_blocks[block_index]['text'] += ' ' + str(v_block['children'][child]['text'])
            #print('text merged')
        except Exception as e:
            print('Error in merging text {}'.format(e))

    return v_blocks




def get_avrage_size(regions):
    size = 0
    if regions != None:
        len_regions = len(regions)
        if len_regions> 0 :
            for region in regions :
                size += region['font']['size']
            return int(size/ len_regions)
        else:
            return size
    else:
        return size



def merge_children(siblings,children_none=False):
    box = Box().get_box()
    if not children_none:
            box['children'] = copy.deepcopy(siblings)


    box['boundingBox']['vertices'][0]['x']   =  min(siblings, key=lambda x: x['boundingBox']['vertices'][0]['x'])['boundingBox']['vertices'][0]['x']
    box['boundingBox']['vertices'][0]['y']   =  min(siblings, key=lambda x: x['boundingBox']['vertices'][0]['y'])['boundingBox']['vertices'][0]['y']
    box['boundingBox']['vertices'][1]['x']   =  max(siblings, key=lambda x: x['boundingBox']['vertices'][1]['x'])['boundingBox']['vertices'][1]['x']
    box['boundingBox']['vertices'][1]['y']   =  min(siblings, key=lambda x: x['boundingBox']['vertices'][1]['y'])['boundingBox']['vertices'][1]['y']
    box['boundingBox']['vertices'][2]['x']   =  max(siblings, key=lambda x: x['boundingBox']['vertices'][2]['x'])['boundingBox']['vertices'][2]['x']
    box['boundingBox']['vertices'][2]['y']   =  max(siblings, key=lambda x: x['boundingBox']['vertices'][2]['y'])['boundingBox']['vertices'][2]['y']
    box['boundingBox']['vertices'][3]['x']   =  min(siblings, key=lambda x: x['boundingBox']['vertices'][3]['x'])['boundingBox']['vertices'][3]['x']
    box['boundingBox']['vertices'][3]['y']   =  max(siblings, key=lambda x: x['boundingBox']['vertices'][3]['y'])['boundingBox']['vertices'][3]['y']

    return box

