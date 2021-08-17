import layoutparser as lp
import cv2
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
import src.utilities.app_context as app_context
import uuid
from config import LINE_PRIMA_SCORE_THRESH_TEST, LINE_LAYOUT_CONFIG_PATH,LINE_LAYOUT_MODEL_PATH
from collections import namedtuple
Rectangle = namedtuple('Rectangle', 'xmin ymin xmax ymax')
import sys, random, torch, glob, torchvision
import os
import numpy as np
import copy
from shapely.geometry import Polygon

#device = torch.device("cuda")
os.environ["CUDA_VISIBLE_DEVICES"] = ""

# seed = 1234
# random.seed(seed)
# torch.manual_seed(seed)
# if torch.cuda.is_available():
# 	torch.cuda.device(0)
# 	print("*******cuda available")
# torch.cuda.manual_seed_all(seed)
# torch.backends.cudnn.deterministic = True
# torch.backends.cudnn.benchmark = False

model_primalinenet = lp.Detectron2LayoutModel(LINE_LAYOUT_CONFIG_PATH,model_path = LINE_LAYOUT_MODEL_PATH,label_map = {0:"LineRegion"},extra_config=["MODEL.ROI_HEADS.SCORE_THRESH_TEST", LINE_PRIMA_SCORE_THRESH_TEST])

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

class PRIMA(object): 
	def area(self,a, b):  # returns None if rectangles don't intersect
		dx = min(a.xmax, b.xmax) - max(a.xmin, b.xmin)
		dy = min(a.ymax, b.ymax) - max(a.ymin, b.ymin)
		if (dx>=0) and (dy>=0):
			return dx*dy
	
	def prima_region(self, layout):
		bbox = []; tag =[]; score =[]
		for idx, ele in enumerate(layout):
			bbox.append(list(ele.coordinates))
			tag.append(ele.type)
			score.append(format(ele.score,'.2f'))
		return bbox,tag,score

	def craft_refinement(self, boxes_final, coords, layout_class,score):
		if len(boxes_final) != 0:
			for box in boxes_final:
				vertical_min_dis = sys.maxsize; horizon_min_dis  = sys.maxsize
				ver_coord_update = None;  hor_coord_update = None
				hor_index = None;  ver_inex  = None
				for idx,coord in enumerate(coords):
					top_dis      = abs(coord[1]-box[1]); left_dis   = abs(coord[0]-box[2])
					bottom_dis   = abs(coord[1]-box[3]); right_dis  = abs(coord[2]-box[2])
					top_dis1     = abs(coord[3]-box[1]); left_dis1  = abs(coord[0]-box[0])
					bottom_dis1  = abs(coord[3]-box[3]); right_dis1 = abs(coord[2]-box[0])
					vertical_dis = min(top_dis,bottom_dis,top_dis1,bottom_dis1)
					horizon_dis  = min(left_dis,right_dis,left_dis1,right_dis1)
					if (vertical_min_dis > vertical_dis and abs(box[0]-coord[0]) < 100):
						vertical_min_dis = vertical_dis
						ver_coord_update = coord
						ver_index        = idx
					if horizon_min_dis>horizon_dis:
						horizon_min_dis  = horizon_dis
						hor_coord_update = coord
						hor_index        = idx
				
				if abs(vertical_min_dis)<150 :
					coords[ver_index][0] = int(min(ver_coord_update[0],box[0])); coords[ver_index][1] = int(min(ver_coord_update[1],box[1]))
					coords[ver_index][2] = int(max(ver_coord_update[2],box[2])); coords[ver_index][3] = int(max(ver_coord_update[3],box[3]))
				#elif abs(horizon_min_dis)<10:
					
					#coords[hor_index][0] = int(min(hor_coord_update[0],box[0])); coords[hor_index][1] = int(min(hor_coord_update[1],box[1]))
					#coords[hor_index][2] = int(max(hor_coord_update[2],box[2])); coords[hor_index][3] = int(max(hor_coord_update[3],box[3]))
				else:
					layout_class.append('TextRegion')
					score.append(float(92))
					coords.append(box)

		return coords, layout_class,score

	def prima_craft_refinement(self, coords, boxes, tag_final,score):
		org_coord     = coords
		org_coord2    = coords
		boxes_final   = []

		for idx1, coord1 in enumerate(boxes):
			min_area = 0; count=0
			index=idx1; check =False
			for idx2, coord2 in enumerate(org_coord):
				ra = Rectangle(coord1[0],coord1[1],coord1[2],coord1[3])
				rb = Rectangle(int(coord2[0]),int(coord2[1]), int(coord2[2]),int(coord2[3]))
				ar = self.area(ra, rb)
				
				if ar!=None and min_area<ar:
					min_area =ar;  index= idx2;  check =True
				if ar==None:
					count=count+1
			if check ==True:
				org_coord2[index][0] = int(min(coord1[0],org_coord2[index][0])); org_coord2[index][1] = int(min(coord1[1],org_coord2[index][1]))
				org_coord2[index][2] = int(max(coord1[2],org_coord2[index][2])); org_coord2[index][3] = int(max(coord1[3],org_coord2[index][3]))
				
			if count == len(org_coord):
				boxes_final.append(coord1)
				tag_final.append("TextRegion")
				score.append(float(92))


		coords, layout_class,score  = self.craft_refinement(boxes_final, coords, tag_final,score)
		
		
		return coords, layout_class,score
	
	
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

	def class_mapping(self, class_name):
		if class_name == "LineRegion":
			class_name = "LINE"

		return class_name

	def update_box_format(self,coords,tags,score):
		final_coord =[]
		for idx,coord in enumerate(coords):
			temp_dict = {}; vert=[]
			temp_dict['identifier'] = str(uuid.uuid4())
			vert.append({'x':coord[0],'y':coord[1]})
			vert.append({'x':coord[2],'y':coord[1]})
			vert.append({'x':coord[2],'y':coord[3]})
			vert.append({'x':coord[0],'y':coord[3]})
			temp_dict['boundingBox']={}
			temp_dict['boundingBox']["vertices"] = vert
			temp_dict['score'] = score[idx]

			temp_dict['class']      = self.class_mapping(tags[idx])
			final_coord.append(temp_dict)
		return final_coord
	def update_coord(self,reg1,reg2,clss):
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
			reg1['class'] = clss
			return reg1
		except:
		    return reg1

		
	def polygon_overlap(self,reg1,reg2,org_reg1,org_reg2):
		area1 = reg1.area
		area2 = reg2.area
		if area1>area2:
			if keys.get_left(org_reg1)<keys.get_left(org_reg2) and keys.get_right(org_reg1)>keys.get_right(org_reg2) \
				and keys.get_top(org_reg1)<keys.get_top(org_reg2) and keys.get_bottom(org_reg1)>keys.get_bottom(org_reg2) :
				return True
			if (reg2.intersection(reg1).area/area2)*100>50:
				return True
		if area1<area2:
			if keys.get_left(org_reg2)<keys.get_left(org_reg1) and keys.get_right(org_reg2)>keys.get_right(org_reg1) \
				and keys.get_top(org_reg2)<keys.get_top(org_reg1) and keys.get_bottom(org_reg2)>keys.get_bottom(org_reg1) :
				return True
			if (reg1.intersection(reg2).area/area1)*100>50:
				return True
		if reg1.contains(reg2) or reg2.contains(reg1):
				return True
		if (keys.get_top(org_reg2)<keys.get_top(org_reg1) and keys.get_bottom(org_reg2)>keys.get_bottom(org_reg1)) \
				and  (keys.get_top(org_reg2)>keys.get_top(org_reg1) and keys.get_bottom(org_reg2)<keys.get_bottom(org_reg1)):
				return True 
		
		return False
    
	def is_connected(self,region1, region2):
			
		region_poly = self.get_polygon(region2['boundingBox'])
		base_poly = self.get_polygon(region1['boundingBox'])
		area=0
		if region_poly and base_poly:
			total_intsc_area = base_poly.intersection(region_poly).area
			area1 = region_poly.area
			area2 = base_poly.area
			area = base_poly.intersection(region_poly)
			superimpose = self.polygon_overlap(region_poly,base_poly,region1,region2)
		if (superimpose) or (area and abs(keys.get_top(region1)-keys.get_top(region2))<keys.get_height(region2)*0.2) or (area and total_intsc_area>max(area1,area2)*0.3):
			return True
		else:
			return False
		

	def merge_remove_overlap(self,text_regions,height,width):
		region_updated = []
		flag =False
		while len(text_regions)>0:
			check = False
			region_temp= text_regions[1:]
			for idx2,region2 in enumerate(region_temp):
				clss, cond = self.is_connected(text_regions[0], region2)
				if cond:
					region1 = self.update_coord(text_regions[0],region2,clss)
					text_regions[0] = copy.deepcopy(region1)
					check =True ;  flag = True
					del text_regions[idx2+1]
					break    
			if check == False:
				region_updated.append(copy.deepcopy(text_regions[0]))
				del text_regions[0]
		return region_updated, flag

	def predict_primanet(self,images,craft_coords=None):
		try:
			lines = []
			#image   = cv2.imread("/home/naresh/anuvaad/anuvaad-etl/anuvaad-extractor/document-processor/layout-detector/prima/"+image)
			for index,image_set in enumerate(images):
				for index,image_path in enumerate(image_set):
					print("image_path",image_path)
					if type(image_path) == str:
						image = cv2.imread(image_path)
					else:
						image = image_path
					print(image)
					height, width, channels = image.shape
					layout   = model_primalinenet.detect(image)
					print(layout)
					bbox,tag,score = self.prima_region(layout)
					############### craft refinement logic 
					#bbox, tag,score = self.prima_craft_refinement(bbox,craft_coords,tag,score)
					layouts  = self.update_box_format(bbox,tag,score)
					flag=True
					while flag==True:
						layouts, flag = self.merge_remove_overlap(layouts,height,width)
					lines.append(layouts)
			return lines
		except Exception as e:
			log_exception("Error occured during prima line detection ",  app_context.application_context, e)
			return None