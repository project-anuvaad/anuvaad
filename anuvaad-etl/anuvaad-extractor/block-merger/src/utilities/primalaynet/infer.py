import layoutparser as lp
import cv2,os
import numpy as np 
from collections import namedtuple
Rectangle = namedtuple('Rectangle', 'xmin ymin xmax ymax')
import sys, random, torch, glob, torchvision
# from torchvision.models.detection.faster_rcnn import FastRCNNPredictor
# from torchvision.models.detection.mask_rcnn import MaskRCNNPredictor
# from torchvision.transforms import transforms
# from skimage import io


seed = 1234
random.seed(seed)
torch.manual_seed(seed)
torch.cuda.manual_seed_all(seed)
torch.backends.cudnn.deterministic = True
torch.backends.cudnn.benchmark = False

model_primalaynet = lp.Detectron2LayoutModel('lp://PrimaLayout/mask_rcnn_R_50_FPN_3x/config',label_map = {1:"TextRegion", 2:"ImageRegion", 3:"TableRegion", 4:"MathsRegion", 5:"SeparatorRegion", 6:"OtherRegion"},extra_config=["MODEL.ROI_HEADS.SCORE_THRESH_TEST", 0.5])

def overlappingArea(l1, r1, l2, r2,ar):
    x = 0
    y = 1
    area1 = abs(l1[x] - r1[x]) * abs(l1[y] - r1[y])
    area2 = abs(l2[x] - r2[x]) * abs(l2[y] - r2[y])
    check=False
    areaI = ((min(r1[x], r2[x]) -
              max(l1[x], l2[x])) *
             (min(r1[y], r2[y]) -
                 max(l1[y], l2[y])))
    thresh = 0
    if ar==None:
        ar=0
    if area1<area2:
        if abs(int(ar)/area1)>0.20:
            thresh = abs(int(ar)/area1)
            check=True
    if area1>area2:
        if abs(int(ar)/area2)>0.20:
            thresh = abs(int(ar)/area1)
            check=True
    if (r2[x] < r1[x] and l2[x] > l1[x] and l2[y] > l1[y] and l2[y] < l1[y]) or (r2[x] > r1[x] and l2[x] < l1[x] and l2[y] < l1[y] and l2[y] > l1[y]):
        check =True
     
        
    return check, thresh

def area(a, b):  # returns None if rectangles don't intersect
    
    dx = min(a.xmax, b.xmax) - max(a.xmin, b.xmin)
    dy = min(a.ymax, b.ymax) - max(a.ymin, b.ymin)
    if (dx>=0) and (dy>=0):
        return dx*dy

def filter_overlapping(coord,layout,index,tag):
	
	if index<len(layout):
		coord_update = coord
		skip=[-1]
		tag_update = tag
		for idx,ele in enumerate(layout):
			coord2 =ele
			coord1= coord_update
			l1=[coord1[0],coord1[1]]; r1=[coord1[2],coord1[3]]
			l2=[coord2[0],coord2[1]]; r2=[coord2[2],coord2[3]]
			ra = Rectangle(coord1[0],coord1[1],coord1[2],coord1[3])
			rb = Rectangle(coord2[0],coord2[1], coord2[2],coord2[3])
			ar = area(ra, rb)
			check=False
			check,thresh = overlappingArea(l1, r1, l2, r2,ar)
			if ((tag[idx]=="ImageRegion" and tag[index]=="ImageRegion") and ar!=None  and  idx!=index) or ((tag[idx]=="ImageRegion" and tag[index]!="ImageRegion") and thresh>0.40 and idx!=index) or ((tag[idx]!="ImageRegion" and tag[index]=="ImageRegion") and thresh>0.40 and  idx!=index ):
				coord_update[0]=min(coord1[0],coord2[0])
				coord_update[1]=min(coord1[1],coord2[1])
				coord_update[2]=max(coord1[2],coord2[2])
				coord_update[3]=max(coord1[3],coord2[3])
				skip.append(idx)
				tag_update="ImageRegion"
			elif ar!=None and ar>0.01 and tag[idx]=="TextRegion" and tag[index]=="TextRegion":
				coord_update[0]=min(coord1[0],coord2[0])
				coord_update[1]=min(coord1[1],coord2[1])
				coord_update[2]=max(coord1[2],coord2[2])
				coord_update[3]=max(coord1[3],coord2[3])
				skip.append(idx)
				tag_update="TextRegion"
			elif ar!=None and ((abs(coord1[0]-coord2[0])<300 and abs(coord1[2]-coord2[2])<300) and check==True) and idx!=index and (tag[idx]!="ImageRegion" and tag[index]!="ImageRegion"):# and (thresh>0.90)) or ((tag[idx]!="ImageRegion" and tag[index]=="ImageRegion") and (thresh>0.90))):
				coord_update[0]=min(coord1[0],coord2[0])
				coord_update[1]=min(coord1[1],coord2[1])
				coord_update[2]=max(coord1[2],coord2[2])
				coord_update[3]=max(coord1[3],coord2[3])
				skip.append(idx)
				tag_update=tag[idx]
		return coord_update, skip,tag_update
			
def draw_box(layout,df,width_ratio,height_ratio):

    skip=[-1]; bbox = []; tag =[]
    for idx,ele in enumerate(layout):
        bbox.append(list(ele.coordinates))
        tag.append(ele.type)
        
    final_box= []
    final_tag = []
    for idx, ele in enumerate(bbox):
        if (idx in skip) or abs(ele[0]-ele[2])<10 or abs(ele[1]-ele[3])<10:
          continue
        ele,skip ,tag_update= filter_overlapping(ele,bbox,idx,tag)
        final_box.append(ele)
        final_tag.append(tag_update)
            
    boxes,coords = sort(final_box,final_tag,df,width_ratio,height_ratio)  
    return boxes, coords

def update_box(boxes):
	updated_box =[]; skip=0
	boxes = sorted(boxes , key=lambda k: [k[1]])
	for idx, box in enumerate(boxes):
		coord = box
		if idx+1<len(boxes):
			box2 = boxes[idx+1]
		if skip>0:
			skip=skip-1
			continue
		for idx2, box2 in enumerate(boxes):
			coord[0]=min(box2[0],box[0]); coord[1]=min(box2[1],box[1]); coord[2]=max(box2[2],box[2]); coord[3]=max(box2[3],box[3])
			idx=idx+1
			skip=skip+1
			box=coord
			box2 = boxes[idx]
		
		updated_box.append(coord)
	return updated_box

def remove_overlap(coords):
	coord_update = coords
	rm_index=[]
	for idx1,coord1 in enumerate(coords):
		for idx2,coord2 in enumerate(coords):
			ra = Rectangle(coord1[0],coord1[1],coord1[2],coord1[3])
			rb = Rectangle(coord2[0],coord2[1], coord2[2],coord2[3])
			ar = area(ra, rb)
			l1=[coord1[0],coord1[1]]; r1=[coord1[2],coord1[3]]
			l2=[coord2[0],coord2[1]]; r2=[coord2[2],coord2[3]]
			check,thresh = overlappingArea(l1, r1, l2, r2,ar)
			if ar!=None and thresh>0 and idx1<len(coord_update):
				coord_update[idx1][0]=min(coord1[0],coord2[0]); coord_update[idx1][1]=min(coord1[1],coord2[1])
				coord_update[idx1][2]=max(coord1[2],coord2[2]); coord_update[idx1][3]=max(coord1[3],coord2[3])
				del coord_update[idx2]

	return coord_update
				
def df_to_wordbox(df,width_ratio,height_ratio):
	boxes = []
	for index, row in df.iterrows():
		temp_box = []
		temp_box.append(row['text_left']/width_ratio); temp_box.append(row['text_top']/height_ratio)
		temp_box.append((row['text_width']+row['text_left'])/width_ratio); temp_box.append((row['text_height']+row['text_top'])/height_ratio)
		#boxes.append(temp_box)
		#temp_box.append(row['text_left']); temp_box.append(row['text_top'])
		#temp_box.append((row['text_width'])); temp_box.append((row['text_height']))
		boxes.append(temp_box)

	return boxes
			
def craft_refinement(coords,df,width_ratio,height_ratio):
	coords_update = []
	org_coord = coords
	org_coord2= coords
	boxes = df_to_wordbox(df,width_ratio,height_ratio)
	boxes_final = []
	drop_lis    = []
	for idx1, coord1 in enumerate(boxes):
		min_area = 0; count=0
		index=idx1; check =False
		for idx2, coord2 in enumerate(org_coord):
			ra = Rectangle(coord1[0],coord1[1],coord1[2],coord1[3])
			rb = Rectangle(coord2[0],coord2[1], coord2[2],coord2[3])
			ar = area(ra, rb)
			if ar!=None and min_area<ar:
				min_area =ar
				index= idx2
				check =True
			if ar==None:
				count=count+1
		if check ==True:
			org_coord2[index][0] = int(min(coord1[0],org_coord2[index][0])); org_coord2[index][1] = int(min(coord1[1],org_coord2[index][1]))
			org_coord2[index][2] = int(max(coord1[2],org_coord2[index][2])); org_coord2[index][3] = int(max(coord1[3],org_coord2[index][3]))
			
		if count == len(org_coord):
			boxes_final.append(coord1)

	coords = remove_overlap(org_coord2)
	if len(boxes_final)!=0:
		for box in boxes_final:
			vertical_min_dis = sys.maxsize
			horizon_min_dis  = sys.maxsize
			ver_coord_update = None
			hor_coord_update = None
			hor_index = None
			ver_inex = None
			for idx,coord in enumerate(coords):
				top_dis = abs(coord[1]-box[1]); left_dis = abs(coord[0]-box[2])
				bottom_dis = abs(coord[1]-box[3]); right_dis = abs(coord[2]-box[2])
				top_dis1 = abs(coord[3]-box[1]); left_dis1 = abs(coord[0]-box[0])
				bottom_dis1 = abs(coord[3]-box[3]); right_dis1 = abs(coord[2]-box[0])
				vertical_dis = min(top_dis,bottom_dis,top_dis1,bottom_dis1)
				horizon_dis = min(left_dis,right_dis,left_dis1,right_dis1)
				#if (vertical_min_dis>vertical_dis and (box[0]<=coord[0]-30 and box[2]< and box[2]>coord[0]) or (vertical_min_dis>vertical_dis and box[2]>coord[0]):
				if (vertical_min_dis>vertical_dis and abs(box[0]-coord[0])<100):
					vertical_min_dis = vertical_dis
					ver_coord_update = coord
					ver_index= idx
				if horizon_min_dis>horizon_dis:
					horizon_min_dis = horizon_dis
					hor_coord_update = coord
					hor_index = idx
			
			if abs(vertical_min_dis)<150 :
				coords[ver_index][0] = int(min(ver_coord_update[0],box[0])); coords[ver_index][1] = int(min(ver_coord_update[1],box[1]))
				coords[ver_index][2] = int(max(ver_coord_update[2],box[2])); coords[ver_index][3] = int(max(ver_coord_update[3],box[3]))
			#elif abs(horizon_min_dis)<10:
				 
				#coords[hor_index][0] = int(min(hor_coord_update[0],box[0])); coords[hor_index][1] = int(min(hor_coord_update[1],box[1]))
				#coords[hor_index][2] = int(max(hor_coord_update[2],box[2])); coords[hor_index][3] = int(max(hor_coord_update[3],box[3]))
			else:
				
				coords.append(box)
	coords = remove_overlap(coords)
	return boxes,coords	
				
def sort(final_box,final_tag,df,width_ratio,height_ratio):

	skip=[-1]; final_coord =[]
	for idx,box in enumerate(final_box):
		if idx in skip:
			continue
		coord1=box
		coord_update = coord1
		for idx2,box2 in enumerate(final_box):
			coord2=box2
			l1=[coord1[0],coord1[1]]; r1=[coord1[2],coord1[3]]
			l2=[coord2[0],coord2[1]]; r2=[coord2[2],coord2[3]]
			ra = Rectangle(coord1[0],coord1[1],coord1[2],coord1[3])
			rb = Rectangle(coord2[0],coord2[1], coord2[2],coord2[3])
			ar = area(ra, rb)
			if ar!=None and abs(ar)>0.1 and final_tag[idx]=="TextRegion" and final_tag[idx2]=="TextRegion":
				coord_update[0]=min(coord1[0],coord2[0])
				coord_update[1]=min(coord1[1],coord2[1])
				coord_update[2]=max(coord1[2],coord2[2])
				coord_update[3]=max(coord1[3],coord2[3])
				skip.append(idx)
		final_coord.append(coord_update)
	boxes,coords = craft_refinement(final_coord,df,width_ratio,height_ratio)
	
	
	return boxes, coords
		

def predict_primanet(image_path,in_df,width_ratio,height_ratio):
	image1  = cv2.imread(image_path)
	image = image1[..., ::-1] 
	layout = model_primalaynet.detect(image)
	boxes,coords = draw_box(layout,in_df,width_ratio,height_ratio)
	final_coord= []
	for coord in coords:
		temp_dict={}
		temp_dict['text_left'] =coord[0]*width_ratio; temp_dict['text_top']=coord[1]*height_ratio
		temp_dict['text_width']=abs((coord[2]-coord[0])*width_ratio); temp_dict['text_height']=abs((coord[3]-coord[1])*height_ratio)
		#temp_dict['text_left'] =coord[0]; temp_dict['text_top']=coord[1]
		#temp_dict['text_width']=abs(coord[2]-coord[0]); temp_dict['text_height']=abs(coord[3]-coord[1])
		final_coord.append(temp_dict)
	return final_coord
