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
            for region in page:
                if region['children'] !=None:
                    total_line = total_line+len(region['children'])
                    for idx, line in enumerate(region['children']):
                        height = keys.get_height(line)
                        avg_height = avg_height + height
                        avg_width = avg_width+ keys.get_width(line)
                        current_line_bottom = keys.get_bottom(line)
                        if idx<len(region['children'])-1:
                            next_line_top = keys.get_bottom(region['children'][idx+1])
                            ver_dis = abs(next_line_top-current_line_bottom)
                            avg_ver_dist = avg_ver_dist + ver_dis

            avg_height   =  avg_height / total_line
            avg_ver_dist =  avg_ver_dist / total_line
            avg_width    =  avg_width / total_line 
        except:
            pass

        return avg_height, avg_ver_dist, avg_width

class Region_Unifier:
    def check_horizon_region(self,box1,box2):
        if keys.get_right(box1)<keys.get_left(box2):
            return True
        if keys.get_right(box2)<keys.get_left(box1):
            return True
        else:
            return False

    def get_text_region(self,regions):
        text_region = []
        n_text_regions = []
        for region in regions:
            if region['class']=='TEXT':
                text_region.append(region)
            else :
                n_text_regions.append(region)
        return text_region,n_text_regions

    # def merge_condition(self,reg1,reg2):
        
    #     box1_top = keys.get_top(reg1); box1_bottom = keys.get_bottom(reg1)
    #     box1_left = keys.get_left(reg1); box1_right = keys.get_right(reg1)
    #     box2_top = keys.get_top(reg2); box2_bottom = keys.get_bottom(reg2)
    #     box2_left = keys.get_left(reg2); box2_right = keys.get_right(reg2)
    #     box1_lines = reg1["children"];  box2_lines = reg2["children"]

    #     if box1_lines!= None and len(box1_lines)>0 and box2_lines!=None and len(box2_lines)>0:
    #         box1_last_line = box1_lines[-1]; box2_first_line = box2_lines[0]
    #         if self.check_horizon_region(reg1,reg2):
    #             if (0<(keys.get_left(reg2)-keys.get_right(reg1))<10 and abs(box2_top-box1_bottom)<100) or (0<(keys.get_left(reg1)-keys.get_right(reg2))<10 and abs(box2_top-box1_bottom)<100):
    #                 return True
    #             else:
    #                 return False
    #         if abs(keys.get_left(box1_last_line)-keys.get_left(box2_first_line))<50 and abs(keys.get_right(box1_last_line)-keys.get_right(box2_first_line))<50 and abs(box2_top-box1_bottom)<150:
    #             return True
    #         if keys.get_right(box2_first_line)-keys.get_right(box1_last_line)>50 :
    #             return False
    #         if keys.get_right(box1_last_line)-keys.get_right(box2_first_line)>100 and abs(box2_top-box1_bottom)<80:
    #             return True
    #         if abs(box2_top-box1_bottom)<100 and abs(box1_left-box2_left)<50 and abs(box1_right-box2_right)<50:
    #             return True
    #         if (abs(box1_bottom-box2_top)<50 and abs(box1_left-box2_left)<10) or (abs(box1_bottom-box2_top)<50 and abs(box1_right-box2_right)<10):
    #             return True
            
    #     else:
    #         if abs(box2_top-box1_bottom)<100 and abs(box1_left-box2_left)<50 and abs(box1_right-box2_right)<50:
    #             return True
            
        
    def merge_condition(self,reg1,reg2,avg_height, avg_ver_dist, avg_width):
         
        box1_top = keys.get_top(reg1); box1_bottom = keys.get_bottom(reg1)
        box1_left = keys.get_left(reg1); box1_right = keys.get_right(reg1)
        box2_top = keys.get_top(reg2); box2_bottom = keys.get_bottom(reg2)
        box2_left = keys.get_left(reg2); box2_right = keys.get_right(reg2)
        box1_lines = reg1["children"];  box2_lines = reg2["children"]
        hor_diff_thresh = 10; line_width_diff = avg_width*0.05
        if box1_lines!= None and len(box1_lines)>0 and box2_lines!=None and len(box2_lines)>0:
            box1_last_line = box1_lines[-1]; box2_first_line = box2_lines[0]
            if keys.get_height(reg1)<= avg_height+50 and keys.get_height(reg2)<= avg_height+50 and abs(box2_top-box1_bottom)<5*avg_ver_dist:
                return True
            ############ conditions based on merging two horizon regions 
            if self.check_horizon_region(reg1,reg2):
                if (0<(keys.get_left(reg2)-keys.get_right(reg1))<hor_diff_thresh and abs(box2_top-box1_bottom)<avg_ver_dist) or (0<(keys.get_left(reg1)-keys.get_right(reg2))<hor_diff_thresh and abs(box2_top-box1_bottom)<avg_ver_dist):
                    return True
                else:
                    return False
            ############
            if abs(keys.get_width(box1_last_line)-keys.get_width(box2_first_line))<line_width_diff and abs(box2_top-box1_bottom)<avg_ver_dist:
                return True
            if keys.get_right(box2_first_line)-keys.get_right(box1_last_line)>line_width_diff:
                return False
            if keys.get_right(box1_last_line)-keys.get_right(box2_first_line)>line_width_diff and abs(box2_top-box1_bottom)<avg_ver_dist:
                return True
            # if abs(box2_top-box1_bottom)<avg_ver_dist and abs(box1_left-box2_left)<50 and abs(box1_right-box2_right)<50:
            #     return True
            if (abs(box1_bottom-box2_top)<avg_ver_dist*0.5 and abs(box1_left-box2_left)<line_width_diff) or (abs(box1_bottom-box2_top)<avg_ver_dist*0.5 and abs(box1_right-box2_right)<line_width_diff):
                return True
            else:
                return False
        else:
            return False

    def check_region_unification(self,reg1,reg2,avg_height, avg_ver_dist, avg_width):
        box1_top = keys.get_top(reg1)
        box2_top = keys.get_top(reg2)
        if box1_top < box2_top:
            return  self.merge_condition(reg1,reg2,avg_height, avg_ver_dist, avg_width)
        if box1_top > box2_top:
            return  self.merge_condition(reg2,reg1,avg_height, avg_ver_dist, avg_width)



    def update_children(self,reg1,reg2):
        if len(reg1['children']) > 0 :
            if len(reg2['children']) > 0 :
                children = sort_regions(reg1['children'] + reg2['children'] , [])
                if len(children) > 1 :
                    return horzontal_merging(children)
                    #v_list[idx] =v_block
                else:
                    return children
            else :
                return reg1['children']
        else :
            if len(reg2['children']) > 0 :
                return reg2['children']
            else :
                return []


    def update_coord(self,reg1,reg2):
        #try:
        box1_top = keys.get_top(reg1); box1_bottom = keys.get_bottom(reg1)
        box1_left = keys.get_left(reg1); box1_right = keys.get_right(reg1)
        box2_top = keys.get_top(reg2); box2_bottom = keys.get_bottom(reg2)
        box2_left = keys.get_left(reg2); box2_right = keys.get_right(reg2)

        reg1['children'] = self.update_children(reg1, reg2)


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


    def is_connected(self,region1, region2,avg_height, avg_ver_dist, avg_width):
        
        region_poly = get_polygon(region2['boundingBox'])
        base_poly = get_polygon(region1['boundingBox'])
        area = base_poly.intersection(region_poly).area
        check = self.check_region_unification(region1,region2,avg_height, avg_ver_dist, avg_width)
        return  area>0 or check


    def merge_remove_overlap(self,text_regions,avg_height, avg_ver_dist, avg_width):
        region_updated = []
        flag =False
        while len(text_regions)>0:
            check = False
            region_temp= text_regions[1:]
            for idx2,region2 in enumerate(region_temp):
                if self.is_connected(text_regions[0], region2, avg_height, avg_ver_dist, avg_width):
                    region1 = self.update_coord(text_regions[0],region2)
                    text_regions[0] = copy.deepcopy(region1)
                    check =True ;  flag = True
                    del text_regions[idx2+1]
                    break    
            if check == False:
                region_updated.append(copy.deepcopy(text_regions[0]))
                del text_regions[0]
        return region_updated, flag


    def region_unifier(self,page_lines,page_regions):
        #try:
        v_list       = collate_regions(page_regions,page_lines)
        for idx,v_block in enumerate(v_list):
            if len(v_block['children']) > 1 :
                v_block['children'] = horzontal_merging(v_block['children'])
                v_list[idx] =v_block

        text_regions, n_text_regions = self.get_text_region(v_list)

        ################### page configs for region unifier
        page_config                         = Page_Config()
        avg_height, avg_ver_dist, avg_width = page_config.avg_line_info(text_regions)
        avg_hor_dist                        = page_config.avg_region_info(text_regions)
        # print("av height : ",avg_height)
        # print("avg_ver_dist : ",avg_ver_dist)
        # print("av avg_width : ",avg_width)
        # print("avg_hor_dist", avg_hor_dist)
        # print("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
        ########################
        flag =True
        while flag==True:
            text_regions, flag = self.merge_remove_overlap(text_regions,avg_height, avg_ver_dist, avg_width)
        # except Exception as e:
        #     log_exception("Error occured during block unifier",  app_context.application_context, e)
        #     return None  ,None        

        return text_regions, n_text_regions
