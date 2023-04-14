# import layoutparser as lp
# import cv2
# from anuvaad_auditor.loghandler import log_info
# from anuvaad_auditor.loghandler import log_exception
# import src.utilities.app_context as app_context
# import uuid
# from config import PRIMA_SCORE_THRESH_TEST, LAYOUT_CONFIG_PATH, LAYOUT_MODEL_PATH, LAYOUT_CLASSES
# from collections import namedtuple
# import pandas as pd
# Rectangle = namedtuple('Rectangle', 'xmin ymin xmax ymax')
# import sys, random, torch, glob, torchvision
# import os
# from src.utilities.remove_water_mark import clean_image
#
# # device = torch.device("cpu")
# os.environ["CUDA_VISIBLE_DEVICES"] = ""
#
# seed = 1234
# random.seed(seed)
# torch.manual_seed(seed)
# # if torch.cuda.is_available():
# #	torch.cuda.device(0)
# # torch.cuda.manual_seed_all(seed)
# # torch.backends.cudnn.deterministic = True
# # torch.backends.cudnn.benchmark = False
# #
# # model_primalaynet = lp.Detectron2LayoutModel('lp://PrimaLayout/mask_rcnn_R_50_FPN_3x/config',label_map = {1:"TextRegion", 2:"ImageRegion", 3:"TableRegion", 4:"MathsRegion", 5:"SeparatorRegion", 6:"OtherRegion"}, \
# # 	extra_config=["MODEL.ROI_HEADS.SCORE_THRESH_TEST", PRIMA_SCORE_THRESH_TEST])#,"MODEL.ROI_HEADS.NMS_THRESH_TEST", 0.2])
# # model_primalaynet = lp.Detectron2LayoutModel(
#
# model_primalaynet = lp.Detectron2LayoutModel(LAYOUT_CONFIG_PATH, model_path=LAYOUT_MODEL_PATH,
#                                              label_map={0: "FooterRegion", 1: "TextRegion", 2: "ImageRegion",
#                                                         3: "TableRegion", 4: "HeaderRegion", 5: "OtherRegion"})
#
#
# #             config_path ='lp://PubLayNet/mask_rcnn_X_101_32x8d_FPN_3x/config', # In model catalog
# #             label_map   ={0: "Text", 1: "Title", 2: "List", 3:"Table", 4:"Figure"}, # In model`label_map`
# #             extra_config=["MODEL.ROI_HEADS.SCORE_THRESH_TEST", 0.5] # Optional
# #         )
# class PRIMA(object):
#     def overlappingArea(self, l1, r1, l2, r2, ar):
#         x = 0;
#         y = 1
#         area1 = abs(l1[x] - r1[x]) * abs(l1[y] - r1[y])
#         area2 = abs(l2[x] - r2[x]) * abs(l2[y] - r2[y])
#         check = False
#         areaI = ((min(r1[x], r2[x]) - max(l1[x], l2[x])) * (min(r1[y], r2[y]) - max(l1[y], l2[y])))
#         thresh = 0
#         if ar == None:
#             ar = 0
#         if area1 < area2 and area1 > 0:
#             if abs(int(ar) / area1) > 0.20:
#                 thresh = abs(int(ar) / area1)
#                 check = True
#         if area1 > area2 and area2 > 0:
#             if abs(int(ar) / area2) > 0.20:
#                 thresh = abs(int(ar) / area2)
#                 check = True
#         if (r2[x] < r1[x] and l2[x] > l1[x] and l2[y] > l1[y] and l2[y] < l1[y]) or (
#                 r2[x] > r1[x] and l2[x] < l1[x] and l2[y] < l1[y] and l2[y] > l1[y]):
#             check = True
#
#         return check, thresh
#
#     def area(self, a, b):  # returns None if rectangles don't intersect
#         dx = min(a.xmax, b.xmax) - max(a.xmin, b.xmin)
#         dy = min(a.ymax, b.ymax) - max(a.ymin, b.ymin)
#         if (dx >= 0) and (dy >= 0):
#             return dx * dy
#
#     def filter_overlapping(self, coord, layout, index, tag):
#         if index < len(layout):
#             coord_update = coord;
#             skip = [-1]
#             tag_update = tag
#             flag = False
#             for idx, ele in enumerate(layout):
#                 coord2 = ele;
#                 coord1 = coord_update
#                 l1 = [coord1[0], coord1[1]];
#                 r1 = [coord1[2], coord1[3]]
#                 l2 = [coord2[0], coord2[1]];
#                 r2 = [coord2[2], coord2[3]]
#                 ra = Rectangle(coord1[0], coord1[1], coord1[2], coord1[3])
#                 rb = Rectangle(coord2[0], coord2[1], coord2[2], coord2[3])
#                 ar = self.area(ra, rb);
#                 check = False
#                 check, thresh = self.overlappingArea(l1, r1, l2, r2, ar)
#                 if ((tag[idx] == "ImageRegion" and tag[index] == "ImageRegion") and ar != None and idx != index) or ((
#                                                                                                                              tag[
#                                                                                                                                  idx] == "ImageRegion" and
#                                                                                                                              tag[
#                                                                                                                                  index] != "ImageRegion") and thresh > 0.40 and idx != index) or (
#                         (tag[idx] != "ImageRegion" and tag[index] == "ImageRegion") and thresh > 0.40 and idx != index):
#                     coord_update[0] = min(coord1[0], coord2[0])
#                     coord_update[1] = min(coord1[1], coord2[1])
#                     coord_update[2] = max(coord1[2], coord2[2])
#                     coord_update[3] = max(coord1[3], coord2[3])
#                     flag = True
#                     skip.append(idx)
#                     tag_update = "ImageRegion"
#                 elif ar != None and ar > 0.01 and tag[idx] == "TextRegion" and tag[index] == "TextRegion":
#                     coord_update[0] = min(coord1[0], coord2[0])
#                     coord_update[1] = min(coord1[1], coord2[1])
#                     coord_update[2] = max(coord1[2], coord2[2])
#                     coord_update[3] = max(coord1[3], coord2[3])
#                     flag = True
#                     skip.append(idx)
#                     tag_update = "TextRegion"
#                 elif ar != None and ((abs(coord1[0] - coord2[0]) < 300 and abs(
#                         coord1[2] - coord2[2]) < 300) and check == True) and idx != index and (
#                         tag[idx] != "ImageRegion" and tag[
#                     index] != "ImageRegion"):  # and (thresh>0.90)) or ((tag[idx]!="ImageRegion" and tag[index]=="ImageRegion") and (thresh>0.90))):
#                     coord_update[0] = min(coord1[0], coord2[0])
#                     coord_update[1] = min(coord1[1], coord2[1])
#                     coord_update[2] = max(coord1[2], coord2[2])
#                     coord_update[3] = max(coord1[3], coord2[3])
#                     skip.append(idx)
#                     flag = True
#                     tag_update = tag[idx]
#             if not flag:
#                 tag_update = tag[index]
#
#             return coord_update, skip, tag_update
#
#     def prima_region(self, layout, craft_coords):
#         skip = [-1];
#         bbox = [];
#         tag = []
#         for idx, ele in enumerate(layout):
#             bbox.append(list(ele.coordinates))
#             tag.append(ele.type)
#
#         final_box = []
#         final_tag = []
#         for idx, ele in enumerate(bbox):
#             if (idx in skip) or abs(ele[0] - ele[2]) < 10 or abs(ele[1] - ele[3]) < 10:
#                 continue
#             ele, skip, tag_update = self.filter_overlapping(ele, bbox, idx, tag)
#             final_box.append(ele)
#             final_tag.append(tag_update)
#         boxes, coords, layout_class = self.prima_refinement(final_box, final_tag, craft_coords)
#
#         return boxes, coords, layout_class
#
#     def update_box(self, boxes):
#         updated_box = [];
#         skip = 0
#         boxes = sorted(boxes, key=lambda k: [k[1]])
#         for idx, box in enumerate(boxes):
#             coord = box
#             if idx + 1 < len(boxes):
#                 box2 = boxes[idx + 1]
#             if skip > 0:
#                 skip = skip - 1
#                 continue
#             for idx2, box2 in enumerate(boxes):
#                 coord[0] = min(box2[0], box[0]);
#                 coord[1] = min(box2[1], box[1]);
#                 coord[2] = max(box2[2], box[2]);
#                 coord[3] = max(box2[3], box[3])
#                 idx = idx + 1
#                 skip = skip + 1
#                 box = coord
#                 box2 = boxes[idx]
#
#             updated_box.append(coord)
#         return updated_box
#
#     def remove_overlap(self, coords, tags_final):
#         coord_update = coords
#         tag_update = tags_final
#         for idx1, coord1 in enumerate(coords):
#             for idx2, coord2 in enumerate(coords):
#                 ra = Rectangle(coord1[0], coord1[1], coord1[2], coord1[3])
#                 rb = Rectangle(coord2[0], coord2[1], coord2[2], coord2[3])
#                 ar = self.area(ra, rb)
#                 l1 = [coord1[0], coord1[1]];
#                 r1 = [coord1[2], coord1[3]]
#                 l2 = [coord2[0], coord2[1]];
#                 r2 = [coord2[2], coord2[3]]
#                 check, thresh = self.overlappingArea(l1, r1, l2, r2, ar)
#                 if ar != None and thresh > 0 and idx1 < len(coord_update):
#                     coord_update[idx1][0] = min(coord1[0], coord2[0]);
#                     coord_update[idx1][1] = min(coord1[1], coord2[1])
#                     coord_update[idx1][2] = max(coord1[2], coord2[2]);
#                     coord_update[idx1][3] = max(coord1[3], coord2[3])
#                     del coord_update[idx2]
#                     del tag_update[idx2]
#         return coord_update, tag_update
#
#     '''
#     def df_to_wordbox(self,df):
#         boxes = []
#         for index, row in df.iterrows():
#             temp_box = []
#             temp_box.append(row['text_left']); temp_box.append(row['text_top'])
#             temp_box.append((row['text_width']+row['text_left'])); temp_box.append((row['text_height']+row['text_top']))
#             boxes.append(temp_box)
#         return boxes '''
#
#     def craft_refinement(self, boxes_final, coords, layout_class):
#         if len(boxes_final) != 0:
#             for box in boxes_final:
#                 vertical_min_dis = sys.maxsize
#                 horizon_min_dis = sys.maxsize
#                 ver_coord_update = None
#                 hor_coord_update = None
#                 hor_index = None
#                 ver_inex = None
#                 for idx, coord in enumerate(coords):
#                     top_dis = abs(coord[1] - box[1]);
#                     left_dis = abs(coord[0] - box[2])
#                     bottom_dis = abs(coord[1] - box[3]);
#                     right_dis = abs(coord[2] - box[2])
#                     top_dis1 = abs(coord[3] - box[1]);
#                     left_dis1 = abs(coord[0] - box[0])
#                     bottom_dis1 = abs(coord[3] - box[3]);
#                     right_dis1 = abs(coord[2] - box[0])
#                     vertical_dis = min(top_dis, bottom_dis, top_dis1, bottom_dis1)
#                     horizon_dis = min(left_dis, right_dis, left_dis1, right_dis1)
#                     if (vertical_min_dis > vertical_dis and abs(box[0] - coord[0]) < 100):
#                         vertical_min_dis = vertical_dis
#                         ver_coord_update = coord
#                         ver_index = idx
#                     if horizon_min_dis > horizon_dis:
#                         horizon_min_dis = horizon_dis
#                         hor_coord_update = coord
#                         hor_index = idx
#
#                 if abs(vertical_min_dis) < 150:
#                     coords[ver_index][0] = int(min(ver_coord_update[0], box[0]));
#                     coords[ver_index][1] = int(min(ver_coord_update[1], box[1]))
#                     coords[ver_index][2] = int(max(ver_coord_update[2], box[2]));
#                     coords[ver_index][3] = int(max(ver_coord_update[3], box[3]))
#                 # elif abs(horizon_min_dis)<10:
#
#                 # coords[hor_index][0] = int(min(hor_coord_update[0],box[0])); coords[hor_index][1] = int(min(hor_coord_update[1],box[1]))
#                 # coords[hor_index][2] = int(max(hor_coord_update[2],box[2])); coords[hor_index][3] = int(max(hor_coord_update[3],box[3]))
#                 else:
#                     layout_class.append('text')
#                     coords.append(box)
#         coords, layout_class = self.remove_overlap(coords, layout_class)
#
#         return coords, layout_class
#
#     def prima_craft_refinement(self, coords, boxes, tag_final):
#         org_coord = coords
#         org_coord2 = coords
#         boxes_final = []
#         for idx1, coord1 in enumerate(boxes):
#             min_area = 0;
#             count = 0
#             index = idx1;
#             check = False
#             for idx2, coord2 in enumerate(org_coord):
#                 ra = Rectangle(coord1[0], coord1[1], coord1[2], coord1[3])
#                 rb = Rectangle(coord2[0], coord2[1], coord2[2], coord2[3])
#                 ar = self.area(ra, rb)
#                 if ar != None and min_area < ar:
#                     min_area = ar;
#                     index = idx2;
#                     check = True
#                 if ar == None:
#                     count = count + 1
#             if check == True:
#                 org_coord2[index][0] = int(min(coord1[0], org_coord2[index][0]));
#                 org_coord2[index][1] = int(min(coord1[1], org_coord2[index][1]))
#                 org_coord2[index][2] = int(max(coord1[2], org_coord2[index][2]));
#                 org_coord2[index][3] = int(max(coord1[3], org_coord2[index][3]))
#
#         # if count == len(org_coord):
#         # 	boxes_final.append(coord1)
#         # 	tag_final.append("text")
#
#         coords, layout_class = self.remove_overlap(org_coord2, tag_final)
#
#         # coords, layout_class  = self.craft_refinement(boxes_final, coords, layout_class)
#
#         return boxes, coords, layout_class
#
#     def prima_refinement(self, final_box, final_tag, craft_coords):
#
#         skip = [-1];
#         final_coord = [];
#         final_tags = []
#         for idx, box in enumerate(final_box):
#             if idx in skip:
#                 continue
#             coord1 = box
#             coord_update = coord1
#             for idx2, box2 in enumerate(final_box):
#                 coord2 = box2
#                 l1 = [coord1[0], coord1[1]];
#                 r1 = [coord1[2], coord1[3]]
#                 l2 = [coord2[0], coord2[1]];
#                 r2 = [coord2[2], coord2[3]]
#                 ra = Rectangle(coord1[0], coord1[1], coord1[2], coord1[3])
#                 rb = Rectangle(coord2[0], coord2[1], coord2[2], coord2[3])
#                 ar = self.area(ra, rb)
#                 if ar != None and abs(ar) > 0.1 and final_tag[idx] == "TextRegion" and final_tag[idx2] == "TextRegion":
#                     coord_update[0] = min(coord1[0], coord2[0])
#                     coord_update[1] = min(coord1[1], coord2[1])
#                     coord_update[2] = max(coord1[2], coord2[2])
#                     coord_update[3] = max(coord1[3], coord2[3])
#                     skip.append(idx)
#             final_coord.append(coord_update)
#             final_tags.append(final_tag[idx])
#
#         boxes, coords, layout_class = self.prima_craft_refinement(final_coord, craft_coords, final_tags)
#
#         return boxes, coords, layout_class
#
#     # def class_mapping(self,class_name):
#     # 	if class_name == "TextRegion" or class_name == "text":
#     # 		class_name = "TEXT"
#     # 	if class_name == "TableRegion":
#     # 		class_name = "TABLE"
#     # 	if class_name == "ImageRegion":
#     # 		class_name = "IMAGE"
#     # 	if class_name == "MathsRegion":
#     # 		class_name = "TEXT"
#     # 	if class_name == "SeparatorRegion":
#     # 		class_name = "LINE"
#     # 	if class_name == "OtherRegion":
#     # 		class_name = "TEXT"
#     #
#     # 	return class_name
#
#     def class_mapping(self, class_name):
#         # if class_name == "HeaderRegion":
#         #         class_name = "Header"
#         if class_name == "TextRegion" or class_name == "text":
#             class_name = "TEXT"
#         if class_name == "TableRegion":
#             class_name = "TABLE"
#         if class_name == "ImageRegion":
#             class_name = "IMAGE"
#         if class_name == "MathsRegion":
#             class_name = "TEXT"
#         if class_name == "HeaderRegion":
#             class_name = "Header"
#         if class_name == "OtherRegion":
#             class_name = "Other"
#         if class_name == "FooterRegion":
#             class_name = "Footer"
#         #               if class_name=="HeaderRegion":
#         #                        class_name = "Header"
#
#         #               if class_name == "HeaderRegion":
#         #                        class_name = "Header"
#         return class_name
#
#     def predict_primanet(self, image, craft_coords):
#         print('headddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddder')
#
#         left_key = 'text_left'
#         top_key = 'text_top'
#         width_key = 'text_width'
#         height_key = 'text_height'
#
#
#         try:
#             image = cv2.imread(image)  # ("/home/naresh/anuvaad/anuvaad-etl/anuvaad-extractor/document-processor/word-detector/craft/"+image)
#             image = clean_image(image)
#
#             image = image[..., ::-1]
#             layout = model_primalaynet.detect(image)
#             boxes, coords, layout_class = self.prima_region(layout, craft_coords)
#             final_coord = []
#             for idx, coord in enumerate(coords):
#                 if layout_class[idx] == 'TableRegion':
#                     print('')
#                 else:
#                     temp_dict = {};
#                     vert = []
#                     temp_dict['identifier'] = str(uuid.uuid4())
#                     vert.append({'x': coord[0], 'y': coord[1]})
#                     vert.append({'x': coord[2], 'y': coord[1]})
#                     vert.append({'x': coord[2], 'y': coord[3]})
#                     vert.append({'x': coord[0], 'y': coord[3]})
#                     temp_dict['boundingBox'] = {}
#                     temp_dict['boundingBox']["vertices"] = vert
#
#
#
#                     temp_dict['class'] = self.class_mapping(layout_class[idx])
#                     ###################################################
#                     temp_dict[left_key]   = vert[0]['x']
#                     temp_dict[top_key]    = vert[0]['y']
#                     temp_dict[width_key]  = abs( vert[0]['x']  - vert[1]['x'])
#                     temp_dict[height_key] =  abs( vert[0]['y']  -vert[3]['y'])
#
#                     #################################################
#
#                     # print((layout_class[idx]))
#
#                     # print("kkkkkk",layout_class[idx])
#                     # temp_dict['text_left']  = coord[0]; temp_dict['text_top'] = coord[1]
#                     # temp_dict['text_width'] = abs((coord[2]-coord[0])); temp_dict['text_height'] = abs((coord[3]-coord[1]))
#                     if temp_dict['class'] in LAYOUT_CLASSES :
#                         final_coord.append(temp_dict)
#             return pd.DataFrame(final_coord)
#         except Exception as e:
#             log_exception("Error occured during prima layout detection ", app_context.application_context, e)
#             return None


import layoutparser as lp
import cv2
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
import src.utilities.app_context as app_context
import uuid
from config import PRIMA_SCORE_THRESH_TEST, LAYOUT_CONFIG_PATH, LAYOUT_MODEL_PATH,LAYOUT_CLASSES
import pandas as pd
from collections import namedtuple

Rectangle = namedtuple('Rectangle', 'xmin ymin xmax ymax')
import sys, random, torch, glob, torchvision
import os
from config import WATERMARK_REMOVE
import copy
from shapely.geometry import Polygon
from src.utilities.remove_water_mark import clean_image

# device = torch.device("cpu")
#os.environ["CUDA_VISIBLE_DEVICES"] = ""

seed = 1234
random.seed(seed)
torch.manual_seed(seed)
# if torch.cuda.is_available():
#	torch.cuda.device(0)
# torch.cuda.manual_seed_all(seed)
# torch.backends.cudnn.deterministic = True
# torch.backends.cudnn.benchmark = False
#
# model_primalaynet = lp.Detectron2LayoutModel('lp://PrimaLayout/mask_rcnn_R_50_FPN_3x/config',label_map = {1:"TextRegion", 2:"ImageRegion", 3:"TableRegion", 4:"MathsRegion", 5:"SeparatorRegion", 6:"OtherRegion"},extra_config=["MODEL.ROI_HEADS.SCORE_THRESH_TEST", PRIMA_SCORE_THRESH_TEST])#,"MODEL.ROI_HEADS.NMS_THRESH_TEST", 0.2])
# model_primalaynet = lp.Detectron2LayoutModel(

# model_primalaynet = lp.Detectron2LayoutModel(LAYOUT_CONFIG_PATH, model_path=LAYOUT_MODEL_PATH,
#                                              label_map={0: "FooterRegion", 1: "TextRegion", 2: "ImageRegion",
#                                                         3: "TableRegion", 4: "HeaderRegion", 5: "OtherRegion"},
#                                              extra_config=["MODEL.ROI_HEADS.SCORE_THRESH_TEST",
#                                                            PRIMA_SCORE_THRESH_TEST])
model_primalaynet = lp.Detectron2LayoutModel(LAYOUT_CONFIG_PATH, model_path=LAYOUT_MODEL_PATH,
                                             label_map={0:"FooterRegion",1:"TextRegion", 2:"ImageRegion", 3:"TableRegion", 4:"HeaderRegion",5:"OtherRegion", 6:"MathsRegion", 7:"SeparatorRegion"},
                                             extra_config=["MODEL.ROI_HEADS.SCORE_THRESH_TEST",
                                                           PRIMA_SCORE_THRESH_TEST])

#             config_path ='lp://PubLayNet/mask_rcnn_X_101_32x8d_FPN_3x/config', # In model catalog
#             label_map   ={0: "Text", 1: "Title", 2: "List", 3:"Table", 4:"Figure"}, # In model`label_map`
#             extra_config=["MODEL.ROI_HEADS.SCORE_THRESH_TEST", 0.5] # Optional
#         )
class MapKeys:
    def __init__(self):
        self.left = None
        self.right = None
        self.top = None
        self.bottom = None

    def get_left(self, box):
        left = int(box['boundingBox']['vertices'][0]['x'])
        return left

    def get_right(self, box):
        right = int(box['boundingBox']['vertices'][1]['x'])
        return right

    def get_top(self, box):
        top = int(box['boundingBox']['vertices'][0]['y'])
        return top

    def get_bottom(self, box):
        bottom = int(box['boundingBox']['vertices'][3]['y'])
        return bottom

    def get_height(self, box):
        height = int(abs(self.get_top(box) - self.get_bottom(box)))
        return height

    def get_width(self, box):
        width = int(abs(self.get_left(box) - self.get_right(box)))
        return width


keys = MapKeys()


class PRIMA(object):
    def area(self, a, b):  # returns None if rectangles don't intersect
        dx = min(a.xmax, b.xmax) - max(a.xmin, b.xmin)
        dy = min(a.ymax, b.ymax) - max(a.ymin, b.ymin)
        if (dx >= 0) and (dy >= 0):
            return dx * dy

    def prima_region(self, layout):
        bbox = [];
        tag = []
        for idx, ele in enumerate(layout):
            bbox.append(list(ele.coordinates))
            tag.append(ele.type)
        return bbox, tag

    def craft_refinement(self, boxes_final, coords, layout_class):
        if len(boxes_final) != 0:
            for box in boxes_final:
                vertical_min_dis = sys.maxsize;
                horizon_min_dis = sys.maxsize
                ver_coord_update = None;
                hor_coord_update = None
                hor_index = None;
                ver_inex = None
                for idx, coord in enumerate(coords):
                    top_dis = abs(coord[1] - box[1]);
                    left_dis = abs(coord[0] - box[2])
                    bottom_dis = abs(coord[1] - box[3]);
                    right_dis = abs(coord[2] - box[2])
                    top_dis1 = abs(coord[3] - box[1]);
                    left_dis1 = abs(coord[0] - box[0])
                    bottom_dis1 = abs(coord[3] - box[3]);
                    right_dis1 = abs(coord[2] - box[0])
                    vertical_dis = min(top_dis, bottom_dis, top_dis1, bottom_dis1)
                    horizon_dis = min(left_dis, right_dis, left_dis1, right_dis1)
                    if (vertical_min_dis > vertical_dis and abs(box[0] - coord[0]) < 100):
                        vertical_min_dis = vertical_dis
                        ver_coord_update = coord
                        ver_index = idx
                    if horizon_min_dis > horizon_dis:
                        horizon_min_dis = horizon_dis
                        hor_coord_update = coord
                        hor_index = idx

                if abs(vertical_min_dis) < 150:
                    coords[ver_index][0] = int(min(ver_coord_update[0], box[0]));
                    coords[ver_index][1] = int(min(ver_coord_update[1], box[1]))
                    coords[ver_index][2] = int(max(ver_coord_update[2], box[2]));
                    coords[ver_index][3] = int(max(ver_coord_update[3], box[3]))
                # elif abs(horizon_min_dis)<10:

                # coords[hor_index][0] = int(min(hor_coord_update[0],box[0])); coords[hor_index][1] = int(min(hor_coord_update[1],box[1]))
                # coords[hor_index][2] = int(max(hor_coord_update[2],box[2])); coords[hor_index][3] = int(max(hor_coord_update[3],box[3]))
                else:
                    layout_class.append('TextRegion')
                    coords.append(box)

        return coords, layout_class

    def prima_craft_refinement(self, coords, boxes, tag_final):
        org_coord = coords
        org_coord2 = coords
        boxes_final = []

        for idx1, coord1 in enumerate(boxes):
            min_area = 0;
            count = 0
            index = idx1;
            check = False
            for idx2, coord2 in enumerate(org_coord):
                ra = Rectangle(coord1[0], coord1[1], coord1[2], coord1[3])
                rb = Rectangle(int(coord2[0]), int(coord2[1]), int(coord2[2]), int(coord2[3]))
                ar = self.area(ra, rb)

                if ar != None and min_area < ar:
                    min_area = ar;
                    index = idx2;
                    check = True
                if ar == None:
                    count = count + 1
            if check == True:
                org_coord2[index][0] = int(min(coord1[0], org_coord2[index][0]));
                org_coord2[index][1] = int(min(coord1[1], org_coord2[index][1]))
                org_coord2[index][2] = int(max(coord1[2], org_coord2[index][2]));
                org_coord2[index][3] = int(max(coord1[3], org_coord2[index][3]))

            if count == len(org_coord):
                boxes_final.append(coord1)
                tag_final.append("TextRegion")

        coords, layout_class = self.craft_refinement(boxes_final, coords, tag_final)

        return coords, layout_class

    def get_polygon(self, region):
        points = []
        vertices = region['vertices']
        for point in vertices:
            points.append((point['x'], point['y']))
        poly = Polygon(points)
        return poly

    def class_mapping(self, class_name):
        if class_name == "TextRegion":
            class_name = "TEXT"
        if class_name == "TableRegion":
            class_name = "TABLE"
        if class_name == "ImageRegion":
            class_name = "IMAGE"
        if class_name == "MathsRegion":
            class_name = "TEXT"
        if class_name == "HeaderRegion":
            class_name = "HEADER"
        if class_name == "OtherRegion":
            class_name = "Other"
        if class_name == "FooterRegion":
            class_name = "FOOTER"

        return class_name

    def update_box_format(self, coords, tags):
        final_coord = []
        for idx, coord in enumerate(coords):
            temp_dict = {};
            vert = []
            temp_dict['identifier'] = str(uuid.uuid4())
            vert.append({'x': coord[0], 'y': coord[1]})
            vert.append({'x': coord[2], 'y': coord[1]})
            vert.append({'x': coord[2], 'y': coord[3]})
            vert.append({'x': coord[0], 'y': coord[3]})
            temp_dict['boundingBox'] = {}
            temp_dict['boundingBox']["vertices"] = vert

            temp_dict['class'] = self.class_mapping(tags[idx])
            final_coord.append(temp_dict)
        return final_coord

    def update_coord(self, reg1, reg2, clss):
        # try:
        box1_top = keys.get_top(reg1);
        box1_bottom = keys.get_bottom(reg1)
        box1_left = keys.get_left(reg1);
        box1_right = keys.get_right(reg1)
        box2_top = keys.get_top(reg2);
        box2_bottom = keys.get_bottom(reg2)
        box2_left = keys.get_left(reg2);
        box2_right = keys.get_right(reg2)

        reg1["boundingBox"]["vertices"][0]['x'] = min(box1_left, box2_left)
        reg1["boundingBox"]["vertices"][0]['y'] = min(box1_top, box2_top)
        reg1["boundingBox"]["vertices"][1]['x'] = max(box1_right, box2_right)
        reg1["boundingBox"]["vertices"][1]['y'] = min(box1_top, box2_top)
        reg1["boundingBox"]["vertices"][2]['x'] = max(box1_right, box2_right)
        reg1["boundingBox"]["vertices"][2]['y'] = max(box1_bottom, box2_bottom)
        reg1["boundingBox"]["vertices"][3]['x'] = min(box1_left, box2_left)
        reg1["boundingBox"]["vertices"][3]['y'] = max(box1_bottom, box2_bottom)
        # reg1['class'] = 'TEXT'
        # except:
        #     pass

        return reg1

    def is_connected(self, region1, region2, height, width):

        region_poly = self.get_polygon(region2['boundingBox'])
        base_poly = self.get_polygon(region1['boundingBox'])
        area = base_poly.intersection(region_poly).area
        area1 = base_poly.area
        area2 = region_poly.area
        tag1 = region1['class']
        tag2 = region2['class']
        y1 = keys.get_top(region1);
        y2 = keys.get_top(region2)
        if (area > 0 and tag1 == 'Other') or (area > 0 and tag2 == 'Other'):
            if tag1 != 'Other':
                return tag1, True
            else:
                return tag2, True
        elif (area > 0 and tag1 == 'Footer' and y1 < height * 0.75) or (
                area > 0 and tag2 == 'Footer' and y2 < height * 0.75):
            if tag1 != 'Footer':
                return tag1, True
            else:
                return tag2, True
        elif (area > 0 and tag1 == 'Footer' and y1 >= height * 0.75) or (
                area > 0 and tag2 == 'Footer' and y2 > height * 0.75):
            if (tag1 == 'Footer' and area1 / area2 > 0.8) or (area2 / area1 > 0.8 and tag2 == 'Footer'):
                return 'Footer', True
            elif tag1 != 'Footer':
                return tag1, True
            else:
                return tag2, True
        elif (area > 0 and tag1 == 'Header' and y1 > height * 0.30) or (
                area > 0 and tag2 == 'Header' and y2 > height * 0.30):
            if tag1 != 'Header':
                return tag1, True
            else:
                return tag2, True
        elif (area > 0 and tag1 == 'Header' and y1 < height * 0.30) or (
                area > 0 and tag2 == 'Header' and y2 < height * 0.30):
            if (tag1 == 'Header' and area1 / area2 > 0.8) or (tag2 == 'Header' and area2 / area1 > 0.8):
                return 'Header', True
            elif tag1 != 'Header':
                return tag1, True
            else:
                return tag2, True
        elif (area > 0 and tag1 == tag2):
            return tag1, True
        else:
            if (area > 0 and area1 < area2 and area1 / area2 > 0.8) or (
                    area > 0 and area1 > area2 and area2 / area1 > 0.8):
                return tag1, True
            else:
                return None, False

    # check = self.check_region_unification(region1,region2,avg_height, avg_ver_dist, avg_width,avg_word_sepc)
    # return  area>0 and

    def merge_remove_overlap(self, text_regions, height, width):
        region_updated = []
        flag = False
        while len(text_regions) > 0:
            check = False
            region_temp = text_regions[1:]
            for idx2, region2 in enumerate(region_temp):
                clss, cond = self.is_connected(text_regions[0], region2, height, width)
                if cond:
                    region1 = self.update_coord(text_regions[0], region2, clss)
                    text_regions[0] = copy.deepcopy(region1)
                    check = True;
                    flag = True
                    del text_regions[idx2 + 1]
                    break
            if check == False:
                region_updated.append(copy.deepcopy(text_regions[0]))
                del text_regions[0]
        return region_updated, flag

    def predict_primanet(self, image, craft_coords):

        left_key = 'text_left'
        top_key = 'text_top'
        width_key = 'text_width'
        height_key = 'text_height'

        try:
            # print(image,"iiiiiiiiiiiiiiiiiiiiiiiiii")
            # image   = cv2.imread("/home/naresh/anuvaad/anuvaad-etl/anuvaad-extractor/document-processor/layout-detector/prima/"+image)
            image = cv2.imread(image)
            height, width, channels = image.shape
            # image = cv2.imread(image)
            if WATERMARK_REMOVE:
                image   = clean_image(image)

            # image   = image[..., ::-1]
            layout = model_primalaynet.detect(image)
            bbox, tag = self.prima_region(layout)
            ############### craft refinement logic
            bbox, tag = self.prima_craft_refinement(bbox, craft_coords, tag)
            layouts = self.update_box_format(bbox, tag)
            flag = True
            while flag == True:
                layouts, flag = self.merge_remove_overlap(layouts, height, width)

            regions = []
            for lay in layouts :
                vert = lay['boundingBox']["vertices"]
                lay[left_key]  = vert[0]['x']
                lay[top_key] =  vert[0]['y']
                lay[width_key] = abs( vert[0]['x']  - vert[1]['x'])
                lay[height_key] =  abs( vert[0]['y']  -vert[3]['y'])
                if lay['class'] in LAYOUT_CLASSES:
                    regions.append(lay)

            return pd.DataFrame(regions)
        except Exception as e:
            log_exception("Error occured during prima layout detection ", app_context.application_context, e)
            return None