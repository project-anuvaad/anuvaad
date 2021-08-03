from shapely.geometry import Polygon
from rtree import index
import copy
import uuid
from collections import Counter

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
    spacing_threshold = abs(check_y - region_lines[0]['boundingBox']['vertices'][3]['y'])* 0.6 #0.8  # *2 #*0.5
    same_line =  list(filter(lambda x: (abs(x['boundingBox']['vertices'][0]['y']  - check_y) <= spacing_threshold), region_lines))
    next_line =   list(filter(lambda x: (abs(x['boundingBox']['vertices'][0]['y']  - check_y) > spacing_threshold), region_lines))
    if len(same_line) >1 :
       same_line.sort(key=lambda x: x['boundingBox']['vertices'][0]['x'],reverse=False)
    sorted_lines += same_line
    if len(next_line) > 0:
        sort_regions(next_line, sorted_lines)
    return sorted_lines

def add_font(regions):
    for idx,region in enumerate(regions):
        if not 'font' in region.keys():
            height = abs(region['boundingBox']['vertices'][0]['y'] - region['boundingBox']['vertices'][2]['y'])
            regions[idx]['font']={'family':'Arial Unicode MS', 'size':height, 'style':'REGULAR'}
    return regions

def collate_regions(regions, lines, child_class=None, grand_children=False,region_flag = True,skip_enpty_children=False,add_font=False ):
    child_key='regions'
    idx = index.Index()
    lines_intersected = []
   
    if regions !=None and len(regions) > 0:
        lines_intersected =[]
        for line_idx, line in enumerate(lines):
            if child_class == 'LINE':
                if 'text' in line.keys():
                    del lines[line_idx]['text']
            if add_font and 'font' not in line.keys():
                height = abs(line['boundingBox']['vertices'][0]['y'] - line['boundingBox']['vertices'][2]['y'])
                lines[line_idx]['font']={'family':'Arial Unicode MS', 'size':height, 'style':'REGULAR'}

            if child_class is not None:
                lines[line_idx]['class'] = child_class
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
                            if child_key not in lines[intr_index].keys():
                                grand_child  = copy.deepcopy(lines[intr_index])
                                grand_child['class'] = 'WORD'
                                lines[intr_index][child_key] = [grand_child]
                        
                        line_poly = get_polygon(lines[intr_index]['boundingBox'])
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
                    regions[region_index]['avg_size'] = get_avrage_size(region_lines)
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

def collate_cell_regions(regions, lines, child_class=None, grand_children=False,region_flag = True,skip_enpty_children=False,add_font=False ):

    child_key='regions'
    idx = index.Index()
    lines_intersected = []
    
    if regions !=None and len(regions) > 0:
        lines_intersected =[]
        for line_idx, line in enumerate(lines):

            if child_class == 'LINE':
                if 'text' in line.keys():
                    del lines[line_idx]['text']
            if add_font:
                height = abs(line['boundingBox']['vertices'][0]['y'] - line['boundingBox']['vertices'][2]['y'])
                lines[line_idx]['font']={'family':'Arial Unicode MS', 'size':height, 'style':'REGULAR'}

            if child_class is not None:
                lines[line_idx]['class'] = child_class
            poly = get_polygon(line['boundingBox'])
            if poly:
                idx.insert(line_idx, poly.bounds)
        for region_index, region in enumerate(regions):
            children_lines =[]
            region_poly = get_polygon(region['boundingBox'])
            if region_poly:
                children_lines = list(idx.intersection(region_poly.bounds))
            if len(children_lines) > 0:
                region_lines = []
                for intr_index in children_lines:
                    if intr_index not in lines_intersected:
                        if grand_children :
                            if child_key not in lines[intr_index].keys():
                                grand_child  = copy.deepcopy(lines[intr_index])
                                grand_child['class'] = 'WORD'
                                lines[intr_index][child_key] = [grand_child]
                        line_poly = get_polygon(lines[intr_index]['boundingBox'])
                        if line_poly:
                            area = region_poly.intersection(line_poly).area
                            reg_area = region_poly.area
                            line_area = line_poly.area
                            if reg_area>0 and line_area>0 and area/min(line_area,reg_area) >0.5 :
                                region_lines.append(lines[intr_index])
                                lines_intersected.append(intr_index)
                if child_key in region.keys() and type(region[child_key]) is list:
                    pass
                else:
                    region[child_key] = []

                region_lines.sort(key=lambda x:x['boundingBox']['vertices'][0]['y'])
                if len(region_lines) > 1:
                    regions[region_index][child_key].extend(sort_regions(region_lines,[]))
                    regions[region_index]['avg_size'] = get_avrage_size(region_lines)
                else :
                    regions[region_index][child_key].extend(region_lines)
                    regions[region_index]['avg_size'] = get_avrage_size(region_lines)
                
    return regions

def collate_text(file,craft_words, google_words):
  
    idx = index.Index()
    words_intersected = []
    if craft_words !=None and len(craft_words) > 0:
        words_intersected =[]
        for word_idx, g_word in enumerate(google_words):
            poly = get_polygon(g_word['boundingBox'])
            if poly:
                idx.insert(word_idx, poly.bounds)
        for region_index, region in enumerate(craft_words):
            region_poly = get_polygon(region['boundingBox'])
            if region_poly:
                child_words = list(idx.intersection(region_poly.bounds))
                text= '';  avg_conf = 0; conf_counter = 0; lang = []
                if len(child_words) > 0:
                    region_words = []
                    for intr_index in child_words:
                        if intr_index not in words_intersected:
                        
                            line_poly = get_polygon(google_words[intr_index]['boundingBox'])
                            if line_poly:
                                area = region_poly.intersection(line_poly).area
                                reg_area = region_poly.area
                                line_area = line_poly.area
                                if reg_area>0 and line_area>0 and area/min(line_area,reg_area) >0.3 :
                                    region_words.append(google_words[intr_index])
                                    words_intersected.append(intr_index)
                        
                    region_words.sort(key=lambda x:x['boundingBox']['vertices'][0]['x'])
                    for region_word in region_words:
                        try:
                            text = text + str(region_word['text'])+" "
                            if 'conf' in region_word.keys() and region_word['conf'] is not None:
                                 avg_conf += region_word['conf']
                                 conf_counter += 1
                            if 'language' in region_word.keys() and region_word['language'] is not None:
                                 lang.append(region_word['language'])
                                 
                        except Exception as e:
                            print('error in collating text' + str(e))
                    if  "craft_word" in file['config']["OCR"].keys() and file['config']["OCR"]["craft_word"]=="False" and len(region_words)>0:
                        craft_words[region_index]['boundingBox'] = merge_corrds(region_words)
                    if  "craft_word" not in file['config']["OCR"].keys() and len(region_words)>0:
                        craft_words[region_index]['boundingBox'] = merge_corrds(region_words)
                craft_words[region_index]['text'] = text
                if conf_counter> 0:
                    craft_words[region_index]['conf'] = avg_conf/conf_counter
                else :
                    craft_words[region_index]['conf'] = avg_conf
                craft_words[region_index]['language'] = frequent_element(lang)
                
    for g_word_index, g_word in enumerate(google_words):
        if g_word_index not in words_intersected:
            craft_words.append(g_word)

    return craft_words

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

def filterd_regions(regions):
    f_regions = []
    if regions != None :
        for region in regions :
            height = abs(region['boundingBox']['vertices'][0]['y'] - region['boundingBox']['vertices'][2]['y'])
            if height > 0 :
                f_regions.append(region)

    return f_regions

def frequent_element(l_ist):
    if len(l_ist) > 0 :
        occurence_count = Counter(l_ist)
        return occurence_count.most_common(1)[0][0]
    else :
        return  None
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
            v_blocks['font']['size'] = max(v_block['regions'], key=lambda x: x['font']['size'])['font']['size']
            if len(v_block['regions']) > 0 :
                v_blocks[block_index]['text'] = v_block['regions'][0]['text']
                if  len(v_block['regions']) > 1:
                    for child in range(1, len(v_block['regions'])):
                        v_blocks[block_index]['text'] += ' ' + str(v_block['regions'][child]['text'])
        except Exception as e:
            print('Error in merging text {}'.format(e))

    return v_blocks

def get_avrage_size(regions):
    size = 0
    if regions != None:
        len_regions = len(regions)
        count=0
        if len_regions> 0 :
            for region in regions :
                
                if 'font' in region.keys():
                    size += region['font']['size']
                    count=count+1
            if count==0:
                count=1
            return int(size/ count)
        else:
            return size
    else:
        return size


def set_font_info(page_words,font_info):
    idx = index.Index()
    if font_info != None and len(font_info) > 0:
        for word_idx, word in enumerate(page_words):
            height = abs(word['boundingBox']['vertices'][0]['y'] - word['boundingBox']['vertices'][2]['y'])
            page_words[word_idx]['font'] = {'family': 'Arial Unicode MS', 'size': height, 'style': 'REGULAR'}
            poly = get_polygon(word['boundingBox'])
            if poly:
                idx.insert(word_idx, poly.bounds)
        for region_index, region in enumerate(font_info):
            region_poly = get_polygon(region['boundingBox'])
            if region_poly:
                children_lines = list(idx.intersection(region_poly.bounds))
                if len(children_lines) > 0:
                    for intr_index in children_lines:
                        #if intr_index not in words_intersected:
                        line_poly = get_polygon(page_words[intr_index]['boundingBox'])
                        if line_poly:
                            area = region_poly.intersection(line_poly).area
                            reg_area = region_poly.area
                            line_area = line_poly.area
                            if reg_area > 0 and line_area > 0 :
                                if (region['class'] == 'BOLD') and (area / min(line_area, reg_area) > 0.2):
                                        page_words[intr_index]['font']['style']= update_style(page_words[intr_index]['font']['style'], 'BOLD')
                                if (region['class'] == 'SUPERSCRIPT') and (region_poly.union(line_poly).area != 0):
                                        iou = area / region_poly.union(line_poly).area
                                        if iou > 0.33:
                                            page_words[intr_index]['font']['style']= update_style(page_words[intr_index]['font']['style'], 'SUPERSCRIPT')

    return  page_words

def update_style(prior_cls, cls):
    if prior_cls == 'REGULAR':
        return cls
    else :
        if prior_cls == cls:
            return cls
        else :
            return '{},{}'.format(prior_cls,cls)

def merge_children(siblings,children_none=False):
    box = Box().get_box()
    if not children_none:
            box['regions'] = copy.deepcopy(siblings)
    box['boundingBox']['vertices'][0]['x']   =  min(siblings, key=lambda x: x['boundingBox']['vertices'][0]['x'])['boundingBox']['vertices'][0]['x']
    box['boundingBox']['vertices'][0]['y']   =  min(siblings, key=lambda x: x['boundingBox']['vertices'][0]['y'])['boundingBox']['vertices'][0]['y']
    box['boundingBox']['vertices'][1]['x']   =  max(siblings, key=lambda x: x['boundingBox']['vertices'][1]['x'])['boundingBox']['vertices'][1]['x']
    box['boundingBox']['vertices'][1]['y']   =  min(siblings, key=lambda x: x['boundingBox']['vertices'][1]['y'])['boundingBox']['vertices'][1]['y']
    box['boundingBox']['vertices'][2]['x']   =  max(siblings, key=lambda x: x['boundingBox']['vertices'][2]['x'])['boundingBox']['vertices'][2]['x']
    box['boundingBox']['vertices'][2]['y']   =  max(siblings, key=lambda x: x['boundingBox']['vertices'][2]['y'])['boundingBox']['vertices'][2]['y']
    box['boundingBox']['vertices'][3]['x']   =  min(siblings, key=lambda x: x['boundingBox']['vertices'][3]['x'])['boundingBox']['vertices'][3]['x']
    box['boundingBox']['vertices'][3]['y']   =  max(siblings, key=lambda x: x['boundingBox']['vertices'][3]['y'])['boundingBox']['vertices'][3]['y']

    return box
def merge_corrds(siblings,children_none=False):
    box = Box().get_box()
    box['boundingBox']['vertices'][0]['x']   =  min(siblings, key=lambda x: x['boundingBox']['vertices'][0]['x'])['boundingBox']['vertices'][0]['x']
    box['boundingBox']['vertices'][0]['y']   =  min(siblings, key=lambda x: x['boundingBox']['vertices'][0]['y'])['boundingBox']['vertices'][0]['y']
    box['boundingBox']['vertices'][1]['x']   =  max(siblings, key=lambda x: x['boundingBox']['vertices'][1]['x'])['boundingBox']['vertices'][1]['x']
    box['boundingBox']['vertices'][1]['y']   =  min(siblings, key=lambda x: x['boundingBox']['vertices'][1]['y'])['boundingBox']['vertices'][1]['y']
    box['boundingBox']['vertices'][2]['x']   =  max(siblings, key=lambda x: x['boundingBox']['vertices'][2]['x'])['boundingBox']['vertices'][2]['x']
    box['boundingBox']['vertices'][2]['y']   =  max(siblings, key=lambda x: x['boundingBox']['vertices'][2]['y'])['boundingBox']['vertices'][2]['y']
    box['boundingBox']['vertices'][3]['x']   =  min(siblings, key=lambda x: x['boundingBox']['vertices'][3]['x'])['boundingBox']['vertices'][3]['x']
    box['boundingBox']['vertices'][3]['y']   =  max(siblings, key=lambda x: x['boundingBox']['vertices'][3]['y'])['boundingBox']['vertices'][3]['y']

    return box['boundingBox']

