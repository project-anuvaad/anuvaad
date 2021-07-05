from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
from collections import namedtuple
from src.utilities.region_operations import add_font, collate_cell_regions,collate_regions, get_polygon,sort_regions, remvoe_regions,filterd_regions,collate_text
from src.services.segment import horzontal_merging
import src.utilities.app_context as app_context
import copy
from shapely.geometry import Polygon
from rtree import index
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
    def get_height(self,box):
        height = int(abs(self.get_top(box) - self.get_bottom(box)))
        return height
    def get_width(self,box):
        width =  int(abs(self.get_left(box) - self.get_right(box)))
        return width

keys = MapKeys()

class Page_Config:
    
    def avg_region_info(self,page):
        try:
            total_region = 0;  avg_hor_dist = 0 
            for idx, region in enumerate(page):
                if idx+1<len(page):
                    for idx2, region2 in enumerate(page[idx+1:]):
                        if keys.get_right(region)<keys.get_left(region2):
                            hor_dis = abs(keys.get_right(region) - keys.get_left(region2))
                            avg_hor_dist = avg_hor_dist + hor_dis
                            total_region = total_region +1 
                        if keys.get_right(region2)<keys.get_left(region):
                            hor_dis = abs(keys.get_right(region2) - keys.get_left(region))
                            avg_hor_dist = avg_hor_dist + hor_dis
                            total_region = total_region +1 

            avg_hor_dist =  avg_hor_dist / total_region
        except:
            pass
        return avg_hor_dist

    def avg_line_info(self,page):
        try:
            avg_height   = 0;   total_line = 0
            avg_ver_dist = 0;   avg_width  = 0
            ver_dist_mes_count = 0
            for region in page:
                if region['children'] !=None:
                    total_line = total_line+len(region['children'])
                    for idx, line in enumerate(region['children']):
                        height = keys.get_height(line)
                        avg_height = avg_height + height
                        avg_width = avg_width+ keys.get_width(line)
                        current_line_top = keys.get_top(line)
                        if idx<len(region['children'])-1:
                            next_line_top = keys.get_top(region['children'][idx+1])
                            max_height = max( keys.get_height(region['children'][idx+1]) ,keys.get_height(region['children'][idx]))
                            ver_dis = abs(next_line_top-current_line_top)
                            if ver_dis > max_height * 0.5 :
                                avg_ver_dist = avg_ver_dist + ver_dis
                                ver_dist_mes_count +=1


            avg_height   =  avg_height / total_line
            avg_width    =  avg_width / total_line
            if ver_dist_mes_count > 0 :
                avg_ver_dist = avg_ver_dist / ver_dist_mes_count
            else:
                avg_ver_dist = avg_height

        except:
            pass

        return avg_height, avg_ver_dist, avg_width

    def avg_word_sep(self, page):
        try:
            avg_height = 0
            total_words = 0
            avg_spacing = 0
            avg_width = 0
            for line in page:
                if line['children'] != None:
                    total_words = total_words + len(line['children'])
                    for idx, word in enumerate(line['children']):

                        if idx < len(line['children']) - 1:
                            next_line_left = keys.get_left(line['children'][idx + 1])
                            current_line_right = keys.get_right(line['children'][idx])
                            spacing = abs(next_line_left - current_line_right)
                            avg_spacing = avg_spacing + spacing

            avg_spacing = avg_spacing / (total_words - len(page))
        except:
            pass
        return avg_spacing


class Region_Unifier:
    def check_horizon_region(self,box1,box2):
        if keys.get_right(box1)<keys.get_left(box2):
            return True
        if keys.get_right(box2)<keys.get_left(box1):
            return True
        else:
            return False

    def get_text_tabel_region(self,regions):
        text_region = []
        tabel_region = []
        image_region  = []
        n_text_table_regions = []
        head_foot= []
        for region in regions:
            if region['class'] in ['TEXT']:
                text_region.append(region)
            else:
                if region['class']=='HEADER' or region['class']=='FOOTER':
                    head_foot.append(region)
                elif region['class']=='TABLE' or region['class']=='CELL':
                    tabel_region.append(region)
                else:
                    if region['class']=='IMAGE':
                        image_region.append(region)
                    else :
                        n_text_table_regions.append(region)
        return text_region,n_text_table_regions,tabel_region,image_region,head_foot
    
    def check_double_column(self,boxes,avg_height):
        total_regions = len(boxes)
        count =0
        regions = copy.deepcopy(boxes)
        while len(regions)>2:
            flag = False
            reg1 = regions[0]
            for idx,reg2 in enumerate(regions[1:]):
                if self.check_horizon_region(reg1,reg2) and keys.get_height(reg1)>3*avg_height and keys.get_height(reg2)>3*avg_height :
                    flag = True
                    del regions[0]
                    break
            if flag==True:
                count=count+1
            else:
                del regions[0]
        if count>0.3*total_regions:
            return True
        else:
            return False  
    def merge_condition(self,reg1,reg2,avg_height, avg_ver_dist, avg_width,avg_word_sepc):
         
        box1_top = keys.get_top(reg1); box1_bottom = keys.get_bottom(reg1)
        box1_left = keys.get_left(reg1); box1_right = keys.get_right(reg1)
        box2_top = keys.get_top(reg2); box2_bottom = keys.get_bottom(reg2)
        box2_left = keys.get_left(reg2); box2_right = keys.get_right(reg2)
        box1_lines = reg1["children"];  box2_lines = reg2["children"]
        hor_diff_thresh = avg_word_sepc*2 ; line_width_diff = avg_width*0.1
        
        if box1_left > box2_left :
            sepration = abs(box1_left -box2_right)
        else :
            sepration = abs(box2_left -box1_right)


        if box1_lines!= None and len(box1_lines)>0 and box2_lines!=None and len(box2_lines)>0:
            box1_last_line = box1_lines[-1]; box2_first_line = box2_lines[0]

            if self.check_horizon_region(reg1,reg2) \
                    and  (keys.get_height(reg1)<= avg_height*2 and keys.get_height(reg2)<= avg_height*2)  :
                if (0<(keys.get_left(reg2)-keys.get_right(reg1))<hor_diff_thresh \
                    and abs(box2_top-box1_bottom)<avg_ver_dist) \
                        or (0<(keys.get_left(reg1)-keys.get_right(reg2))<hor_diff_thresh \
                            and abs(box2_top-box1_bottom)<avg_ver_dist):
                    return True
                else:
                    return False
            #IF a running paragraph is broken (1) :
            if len(box1_lines) > 1 :
                box_1_second_last_line = box1_lines[-2]
                if (keys.get_left(box2_first_line)-keys.get_left(box1_last_line)< hor_diff_thresh)\
                        and (keys.get_right(box_1_second_last_line)-keys.get_right(box1_last_line)< hor_diff_thresh)\
                        and abs(box2_top-box1_bottom)<avg_ver_dist *2 :
                    return True
            # IF a running paragraph is broken  (2)
            if keys.get_right(box2_first_line)-keys.get_right(box1_last_line) > hor_diff_thresh*0.5 :
                return  False
            # based on box separation :
            if  abs(box2_top-box1_bottom)<avg_ver_dist *2 \
                    and  keys.get_right(box2_first_line)-keys.get_right(box1_last_line)< hor_diff_thresh \
                    and  keys.get_left(box2_first_line)-keys.get_left(box1_last_line)< hor_diff_thresh :
                return True
        else:
            return False

    def check_region_unification(self,reg1,reg2,avg_height, avg_ver_dist, avg_width,avg_word_sepc):
        box1_top = keys.get_top(reg1)
        box2_top = keys.get_top(reg2)
        if box1_top < box2_top:
            return  self.merge_condition(reg1,reg2,avg_height, avg_ver_dist, avg_width,avg_word_sepc)
        if box1_top > box2_top:
            return  self.merge_condition(reg2,reg1,avg_height, avg_ver_dist, avg_width,avg_word_sepc)



    def update_children(self,reg1,reg2):
        page_config = Page_Config()

        if reg1['regions']!=None and len(reg1['regions']) > 0 :
            if reg2['regions']!=None and len(reg2['regions']) > 0 :
                agg_children =  reg1['regions'] + reg2['regions']
                agg_children.sort(key=lambda x: x['boundingBox']['vertices'][0]['y'])

                children = sort_regions(agg_children , [])
                if len(children) > 1 :
                    avg__region_height, avg__region_ver_dist, avg__region_width = page_config.avg_line_info([{'children': children}])
                    avrage_region_ver_ratio = avg__region_ver_dist / max(1,avg__region_height)
                    return horzontal_merging(children, avrage_region_ver_ratio)
                    #v_list[idx] =v_block
                else:
                    return children
            else :
                return reg1['regions']
        else :
            if reg2['regions']!=None and len(reg2['regions']) > 0 :
                return reg2['regions']
            else :
                return []


    def update_coord(self,reg1,reg2,clss,add_word = False):
        box1_top = keys.get_top(reg1); box1_bottom = keys.get_bottom(reg1)
        box1_left = keys.get_left(reg1); box1_right = keys.get_right(reg1)
        box2_top = keys.get_top(reg2); box2_bottom = keys.get_bottom(reg2)
        box2_left = keys.get_left(reg2); box2_right = keys.get_right(reg2)
        if add_word==False:
            reg1['regions'] = self.update_children(reg1, reg2)
        reg1["boundingBox"]["vertices"][0]['x']= min(box1_left,box2_left)
        reg1["boundingBox"]["vertices"][0]['y']= min(box1_top,box2_top)
        reg1["boundingBox"]["vertices"][1]['x']= max(box1_right,box2_right)
        reg1["boundingBox"]["vertices"][1]['y']= min(box1_top,box2_top)
        reg1["boundingBox"]["vertices"][2]['x']= max(box1_right,box2_right)
        reg1["boundingBox"]["vertices"][2]['y']= max(box1_bottom,box2_bottom)
        reg1["boundingBox"]["vertices"][3]['x']= min(box1_left,box2_left)
        reg1["boundingBox"]["vertices"][3]['y']= max(box1_bottom,box2_bottom)
        reg1['class'] = clss
        if add_word:
            if 'regions' in reg1.keys():
                reg1['regions'].append(reg2)
            else:
                reg1['regions']=[]
                reg1['regions'].append(reg2)
        return reg1

    def is_connected(self,region1, region2,avg_height, avg_ver_dist, avg_width,avg_word_sepc):
        
        region_poly = get_polygon(region2['boundingBox'])
        base_poly = get_polygon(region1['boundingBox'])
        area=0
        check=False
        if region_poly and base_poly:
            area = base_poly.intersection(region_poly).area
            check = self.check_region_unification(region1,region2,avg_height, avg_ver_dist, avg_width,avg_word_sepc)
        return  area>0 or check


    def merge_remove_overlap(self,text_regions,avg_height, avg_ver_dist, avg_width,avg_word_sepc):
        region_updated = []
        flag =False
        while len(text_regions)>0:
            check = False
            region_temp= text_regions[1:]
            for idx2,region2 in enumerate(region_temp):
                if self.is_connected(text_regions[0], region2, avg_height, avg_ver_dist, avg_width,avg_word_sepc):
                    region1 = self.update_coord(text_regions[0],region2)
                    text_regions[0] = copy.deepcopy(region1)
                    check =True ;  flag = True
                    del text_regions[idx2+1]
                    break    
            if check == False:
                region_updated.append(copy.deepcopy(text_regions[0]))
                del text_regions[0]
        return region_updated, flag

    def table_no_cell(self,tables,words,idxx):
        
        for idx,table in enumerate(tables):
            if 'regions' in table.keys():
                for idx2,cell in enumerate(table['regions']):
                    tmp_cells = copy.deepcopy(table['regions'])
                    del tmp_cells[idx2]
                    for word in words:
                        region_poly =get_polygon(word['boundingBox']); base_poly = get_polygon(cell['boundingBox'])
                        area=0
                        if region_poly and base_poly:
                            area = base_poly.intersection(region_poly).area
                            flag=False
                            indx = index.Index()
                            if area>0:
                                for idx3,tmp_cell in enumerate(tmp_cells):
                                    poly = get_polygon(tmp_cell['boundingBox'])
                                    indx.insert(idx3, poly.bounds)
                                intersected_regions = list(indx.intersection(region_poly.bounds))
                                if len(intersected_regions) > 0:
                                    flag=True
                                if flag==False:
                                    cell = self.update_coord(cell,word,cell['class'],True)
                                    tables[idx]['regions'][idx2] = cell
        return tables
                

    def region_unifier(self,idx2,file,page_g_words, page_lines,page_regions,page_c_words,path):
        try:
            page_lines = add_font(page_lines)
            page_regions  = filterd_regions(page_regions)
            if len(page_regions) > 0 :
                page_regions.sort(key=lambda x:x['boundingBox']['vertices'][0]['y'])
                sorted_page_regions = sort_regions(page_regions,[])
            else:
                sorted_page_regions = page_regions
            #page_words = collate_text(file,page_c_words, page_g_words)
            page_words = page_g_words
            page_words2 = copy.deepcopy(page_words)
            text_region,n_text_table_regions,tabel_region,image_region,head_foot_region = self.get_text_tabel_region(sorted_page_regions)
            tabel_region  = remvoe_regions(copy.deepcopy(image_region), copy.deepcopy(tabel_region))
            filtered_words = remvoe_regions(copy.deepcopy(image_region), copy.deepcopy(page_words))
            filtered_lines = remvoe_regions(copy.deepcopy(image_region), copy.deepcopy(page_lines))
            
            t_list = []
            for idx,table in enumerate(tabel_region):
                if 'regions' in table.keys():
                    filtered_words     = remvoe_regions(copy.deepcopy(table['regions']), copy.deepcopy(filtered_words))
                    filtered_lines    = remvoe_regions(copy.deepcopy(table['regions']), copy.deepcopy(filtered_lines))
                    tabel_region[idx]['regions'] =  collate_regions(regions = copy.deepcopy(table['regions']),lines = copy.deepcopy(page_words),child_class='WORD',grand_children=False,region_flag = False)
                    
                    page_words = filtered_words
                    page_lines = filtered_lines
                    t_list.append(tabel_region[idx])
                    
            
            t_list =  collate_cell_regions(copy.deepcopy(t_list),copy.deepcopy(page_words),child_class='CELL_TEXT',grand_children=True,region_flag = False)
            t_list = self.table_no_cell(t_list,page_words2,idx2)
            
            page_words   = remvoe_regions(copy.deepcopy(t_list), copy.deepcopy(page_words))
            
            filtered_lines   = remvoe_regions(copy.deepcopy(t_list), copy.deepcopy(page_lines))
            filtered_words = copy.deepcopy(page_words)
            text_region  = remvoe_regions(copy.deepcopy(t_list) ,copy.deepcopy(text_region))
            line_list    = collate_regions(copy.deepcopy( filtered_lines), copy.deepcopy( filtered_words),child_class='WORD',add_font=True)

            head_foot_list =  collate_regions(copy.deepcopy(head_foot_region),copy.deepcopy(line_list),child_class='LINE',grand_children=True,region_flag = False)
            filtered_lines  = remvoe_regions(copy.deepcopy(head_foot_list), copy.deepcopy(line_list))
            
            v_list       = collate_regions( copy.deepcopy( text_region),copy.deepcopy( filtered_lines ),child_class='LINE' ,grand_children=True,add_font=True )
            i_list       =  collate_regions(copy.deepcopy( image_region),copy.deepcopy(page_words),grand_children=True,region_flag = False,skip_enpty_children=True)
            
            page_config                         = Page_Config()
            avg_height, avg_ver_dist, avg_width = page_config.avg_line_info(v_list)

            if avg_height == 0:
                avg_height = 1
            self.avg_ver_ratio =   avg_ver_dist /avg_height
            v_list.extend(head_foot_list)

            for idx,v_block in enumerate(v_list):
                if 'class' in v_list[idx].keys():
                    if v_list[idx]['class'] == 'TEXT':
                        v_list[idx]['class']= "PARA"

                if 'regions' in v_block.keys():
                    if   v_block['regions'] != None and  len(v_block['regions']) > 1 :
                        avg__region_height, avg__region_ver_dist, avg__region_width = page_config.avg_line_info([v_block])
                        v_block['avg_ver_dist'] = avg__region_ver_dist
                        avrage_region_ver_ratio= avg__region_ver_dist / max(1,avg__region_height)
                        #v_block['regions'] = horzontal_merging(v_block['regions'],avrage_region_ver_ratio)
                else:
                    log_info('region key not found for {}  in page {}'.format(v_block, path),app_context.application_context )

                if 'children' in v_block.keys():
                    v_block.pop('children')
                    v_list[idx] =copy.deepcopy(v_block)

            for idx,t_block in enumerate(t_list):
                t_list[idx]['class'] = 'TABLE'
                if   t_block['regions'] != None and  len(t_block['regions']) > 1 :
                    avg__region_height, avg__region_ver_dist, avg__region_width = page_config.avg_line_info([t_block])
                    t_block['avg_ver_dist'] = avg__region_ver_dist
                    avrage_region_ver_ratio= avg__region_ver_dist / max(1,avg__region_height)
                    t_list[idx] =copy.deepcopy(t_block)

            avg_word_sepc     = page_config.avg_word_sep(line_list)
            v_list.extend(t_list)
            if self.check_double_column(v_list,avg_height):
                return v_list, n_text_table_regions
            flag = False
            while flag==True:
                v_list, flag = self.merge_remove_overlap(v_list,avg_height, avg_ver_dist, avg_width,avg_word_sepc)

        except Exception as e:
            log_exception("Error occured during block unifier",  app_context.application_context, e)
            return None  ,None
        
        return v_list, n_text_table_regions
