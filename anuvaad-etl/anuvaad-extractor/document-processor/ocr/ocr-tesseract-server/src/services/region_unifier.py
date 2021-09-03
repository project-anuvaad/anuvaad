from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
from collections import namedtuple
from src.utilities.region_operations import add_font, collate_cell_regions,collate_regions, get_polygon,sort_regions, remvoe_regions,filterd_regions
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
                            avg_hor_dist = avg_hor_dist + hor_dis;   total_region = total_region +1 
                        if keys.get_right(region2)<keys.get_left(region):
                            hor_dis = abs(keys.get_right(region2) - keys.get_left(region))
                            avg_hor_dist = avg_hor_dist + hor_dis;   total_region = total_region +1 
            avg_hor_dist =  avg_hor_dist / total_region
        except:
            pass
        return avg_hor_dist

    def avg_line_info(self,page):
        try:
            avg_height   = 0;   total_line = 0;   avg_ver_dist = 0;   avg_width  = 0;  ver_dist_mes_count = 0
            for region in page:
                if region['children'] !=None:
                    total_line = total_line+len(region['children'])
                    for idx, line in enumerate(region['children']):
                        height = keys.get_height(line);  avg_height = avg_height + height; avg_width = avg_width+ keys.get_width(line); current_line_top = keys.get_top(line)
                        if idx<len(region['children'])-1:
                            next_line_top = keys.get_top(region['children'][idx+1]); ver_dis = abs(next_line_top-current_line_top)
                            max_height = max( keys.get_height(region['children'][idx+1]) ,keys.get_height(region['children'][idx]))
                            if ver_dis > max_height * 0.5 :
                                avg_ver_dist = avg_ver_dist + ver_dis;  ver_dist_mes_count +=1
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
            avg_height = 0; total_words = 0; avg_spacing = 0; avg_width = 0
            for line in page:
                if line['children'] != None:
                    total_words = total_words + len(line['children'])
                    for idx, word in enumerate(line['children']):
                        if idx < len(line['children']) - 1:
                            next_line_left = keys.get_left(line['children'][idx + 1]); current_line_right = keys.get_right(line['children'][idx])
                            spacing = abs(next_line_left - current_line_right); avg_spacing = avg_spacing + spacing
            avg_spacing = avg_spacing / (total_words - len(page))
        except:
            pass
        return avg_spacing


class Region_Unifier:

    def get_text_tabel_region(self,regions):
        text_region = [];   tabel_region = [];   image_region  = [];  n_text_table_regions = [];  head_foot= []
        for region in regions:
            if region['class'] in ['TEXT','PARA']:
                text_region.append(region)
            elif region['class']=='HEADER' or region['class']=='FOOTER':
                head_foot.append(region)
            elif region['class']=='TABLE' or region['class']=='CELL':
                tabel_region.append(region) 
            elif region['class']=='IMAGE':
                image_region.append(region)
            else :
                n_text_table_regions.append(region)
        return text_region,n_text_table_regions,tabel_region,image_region,head_foot
    
    def update_coord(self,reg1,reg2,clss,add_word = False):
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
            reg1['class'] = clss;  del_idx =[];  reg_updated =[]
            if add_word and reg1 is not None and reg2 is not None:
                    if 'regions' in reg1.keys() and 'identifier' in reg2.keys():
                        for idx,i in enumerate(reg1['regions']):
                            # This can cause repetations 
                            if i is not None and isinstance(i, dict) and 'identifier' in i.keys() and reg2['identifier']!=i['identifier']:
                                reg1['regions'].extend(reg2)
                            elif not isinstance(i, dict):
                                del_idx.append(idx)                       
                    else:
                        if reg2 is not None and isinstance(i, dict):
                            reg1['regions']=[];   reg1['regions'].extend(reg2)
            if len(reg1['regions'])>0:
                for idx,val in enumerate(reg1['regions']):
                    if idx not in del_idx:
                        reg_updated.append(val)
            reg1['regions']  = reg_updated
            return reg1
        except:
            return reg1

    def table_no_cell(self,tables,words,idxx):
        for idx,table in enumerate(tables):
            if 'regions' in table.keys():
                for idx2,cell in enumerate(table['regions']):
                    tmp_cells = copy.deepcopy(table['regions']);  del tmp_cells[idx2]
                    for word in words:
                        region_poly =get_polygon(word['boundingBox']); base_poly = get_polygon(cell['boundingBox']);  area=0
                        if region_poly and base_poly:
                            area = base_poly.intersection(region_poly); flag=False; indx = index.Index()
                            if area:
                                for idx3,tmp_cell in enumerate(tmp_cells):
                                    poly = get_polygon(tmp_cell['boundingBox'])
                                    indx.insert(idx3, poly.bounds)
                                intersected_regions = list(indx.intersection(region_poly.bounds))
                                if len(intersected_regions) > 0:
                                    flag=True
                                if flag==False and cell is not None and isinstance(cell, dict):
                                    cell2 = self.update_coord(cell,word,cell['class'],True)
                                    tables[idx]['regions'][idx2] = cell2
        return tables

    def add_region_attribute(self,v_list,t_list):
        page_config                         = Page_Config()
        avg_height, avg_ver_dist, avg_width = page_config.avg_line_info(v_list)
        if avg_height == 0:
            avg_height = 1
        self.avg_ver_ratio =   avg_ver_dist /avg_height
        for idx,v_block in enumerate(v_list):
            if 'class' in v_list[idx].keys():
                if v_list[idx]['class'] == 'TEXT':
                    v_list[idx]['class']= "PARA"
            if 'regions' in v_block.keys():
                if   v_block['regions'] != None and  len(v_block['regions']) > 1 :
                    avg__region_height, avg__region_ver_dist, avg__region_width = page_config.avg_line_info([v_block])
                    v_block['avg_ver_dist'] = avg__region_ver_dist
                    avrage_region_ver_ratio= avg__region_ver_dist / max(1,avg__region_height)
            else:
                log_info('region key not found for {}'.format(v_block),app_context.application_context )

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

        v_list.extend(t_list)
        return v_list

    def region_unifier(self,idx2,file, page_lines,page_regions,path):
        try:
            page_lines = add_font(page_lines)
            page_regions  = filterd_regions(page_regions)
            
            #if len(page_regions) > 0 :
            #    page_regions.sort(key=lambda x:x['boundingBox']['vertices'][0]['y'])
            #    sorted_page_regions = sort_regions(page_regions,[])
            #else:
            sorted_page_regions = page_regions
            
            text_regions,n_text_table_regions,tabel_regions,image_region,head_foot_region = self.get_text_tabel_region(sorted_page_regions)
            #Remove any table which would overlap with an image
            tabel_regions  = remvoe_regions(copy.deepcopy(image_region), copy.deepcopy(tabel_regions))
            #filtered_lines = remvoe_regions(copy.deepcopy(image_region), copy.deepcopy(page_lines))
            filtered_lines = copy.deepcopy(page_lines)
            page_lines2 = copy.deepcopy(page_lines)

            for idx,table in enumerate(tabel_regions):
                if 'regions' in table.keys():
                    filtered_lines    = remvoe_regions(copy.deepcopy(table['regions']), copy.deepcopy(filtered_lines))
                    # Adding lines to table cells 
                    tabel_regions[idx]['regions'] =  collate_regions(regions = copy.deepcopy(table['regions']),lines = copy.deepcopy(page_lines),child_class='LINE',grand_children=False,region_flag = False,child_key=True)
                    page_lines = filtered_lines

            # Taking care of lines which intersect with a table but not with any cell (error in cell detection)
            tabel_regions =  collate_cell_regions(copy.deepcopy(tabel_regions),copy.deepcopy(page_lines),child_class='CELL_TEXT',grand_children=False,region_flag = False)
            
            # Taking union of cell and lines coordinates which intersect (Why is this done?) 
            tabel_regions = self.table_no_cell(tabel_regions,page_lines2,idx2)
            
            filtered_lines   = remvoe_regions(copy.deepcopy(tabel_regions), copy.deepcopy(page_lines))
            text_regions  = remvoe_regions(copy.deepcopy(tabel_regions) ,copy.deepcopy(text_regions))
            head_foot_list =  collate_regions(copy.deepcopy(head_foot_region),copy.deepcopy(filtered_lines),child_class='LINE',grand_children=False,region_flag = False)
            filtered_lines  = remvoe_regions(copy.deepcopy(head_foot_list), copy.deepcopy(filtered_lines))
            
            text_regions       = collate_regions( copy.deepcopy( text_regions),copy.deepcopy( filtered_lines ),child_class='LINE' ,grand_children=False,add_font=False )
            #i_list       =  collate_regions(copy.deepcopy( image_region),copy.deepcopy(page_lines2),grand_children=False,region_flag = False,skip_enpty_children=True)
            
            text_regions.extend(head_foot_list)

            text_regions = self.add_region_attribute(text_regions,tabel_regions)
            if len(text_regions) > 0 :
                text_regions.sort(key=lambda x:x['boundingBox']['vertices'][0]['y'])
                text_regions = sort_regions(text_regions,[])
            
        except Exception as e:
            log_exception("Error occured during block unifier",  app_context.application_context, e)
            return None  ,None
        
        return text_regions, n_text_table_regions
