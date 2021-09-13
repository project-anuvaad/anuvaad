import pandas as pd
import json
import copy

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

#keys = MapKeys()
def sort_regions(region_lines, sorted_lines=[]):
    if len(region_lines[0]['boundingBox']['vertices'])==4:
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
    else:
        return region_lines




def get_ngram(indices, window_size = 2):
    ngrams = []
    count  = 0
    for token in indices[:len(indices)-window_size+1]:
        ngrams.append(indices[count:count+window_size])
        count = count+1
    return ngrams

def update_coord(reg1,reg2):
    box1 = MapKeys()
    box2 = MapKeys()
    #reg1['children'] = update_children(reg1, reg2)
    reg1["boundingBox"]["vertices"][0]['x']= min(box1.get_left(reg1),box2.get_left(reg2))
    reg1["boundingBox"]["vertices"][0]['y']= min(box1.get_top(reg1),box2.get_top(reg2))
    reg1["boundingBox"]["vertices"][1]['x']= max(box1.get_right(reg1),box2.get_right(reg2))
    reg1["boundingBox"]["vertices"][1]['y']= min(box1.get_top(reg1),box2.get_top(reg2))
    reg1["boundingBox"]["vertices"][2]['x']= max(box1.get_right(reg1),box2.get_right(reg2))
    reg1["boundingBox"]["vertices"][2]['y']= max(box1.get_bottom(reg1),box2.get_bottom(reg2))
    reg1["boundingBox"]["vertices"][3]['x']= min(box1.get_left(reg1),box2.get_left(reg2))
    reg1["boundingBox"]["vertices"][3]['y']= max(box1.get_bottom(reg1),box2.get_bottom(reg2))

    return reg1

def are_hlines(region1,region2):

    space = abs( region1['boundingBox']['vertices'][0]['y'] - region2['boundingBox']['vertices'][0]['y'])
    sepration = abs(region2['boundingBox']['vertices'][0]['x'] - region1['boundingBox']['vertices'][1]['x'])
    h1 = abs(region1['boundingBox']['vertices'][3]['y'] - region1['boundingBox']['vertices'][0]['y'])
    h2 = abs(region2['boundingBox']['vertices'][3]['y'] - region2['boundingBox']['vertices'][0]['y'])
    max_height = max( h1 , h2 ) #*0.5
    diff_threshold = max_height * 0.5

    #return ((space <= diff_threshold ) or(sepration <= 3 *avg_height)) and  (sepration < 6 * avg_height) and (space <= diff_threshold *2.5 )
    return  sepration  < 5 * max_height  and space <= diff_threshold

def horzontal_merging(region_words):
    if len(region_words)>0:
        children = sort_regions(region_words, sorted_lines=[])
        if len(children) > 1:
            bi_gram = get_ngram(children, 2)
            lines = [bi_gram[0][0]]
            for pair in bi_gram:
                connected = are_hlines(pair[0], pair[1])
                if connected:
                    #reg1 = pair[0]
                    reg1 = copy.deepcopy(lines[-1])
                    reg2 = copy.deepcopy(pair[1])
                    lines[-1]= update_coord(reg1,reg2)
                else:
                    lines.append(pair[1])
            return lines
        else:
            return children
    else:
        return region_words