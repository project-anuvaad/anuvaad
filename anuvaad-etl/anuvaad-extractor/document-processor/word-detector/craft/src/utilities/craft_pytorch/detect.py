#import sys
#import os
import time
import argparse
import torch
#import torch.nn as nn
import torch.backends.cudnn as cudnn
from torch.autograd import Variable
#from PIL import Image
import cv2
import pandas as pd
import uuid
#from skimage import io
import numpy as np
from src.utilities.craft_pytorch import craft_utils
from src.utilities.craft_pytorch import imgproc
#import json
import config
from anuvaad_auditor.loghandler import log_info
import src.utilities.app_context as app_context
#import zipfile
from src.utilities.craft_pytorch.craft import CRAFT
from collections import OrderedDict
from anuvaad_auditor.loghandler import log_error
from src.utilities.remove_water_mark import clean_image


def copyStateDict(state_dict):
    if list(state_dict.keys())[0].startswith("module"):
        start_idx = 1
    else:
        start_idx = 0
    new_state_dict = OrderedDict()
    for k, v in state_dict.items():
        name = ".".join(k.split(".")[start_idx:])
        new_state_dict[name] = v
    return new_state_dict

def str2bool(v):
    return v.lower() in ("yes", "y", "true", "t", "1")


def load_craft_model():
    net = CRAFT()
    net.load_state_dict(copyStateDict(torch.load(config.CRAFT_MODEL_PATH, map_location='cpu')))
    net.eval()
    return net
#net = load_craft_model()

parser = argparse.ArgumentParser(description='CRAFT Text Detection')
parser.add_argument('--trained_model', default='./model/craft_mlt_25k.pth', type=str, help='pretrained model')
parser.add_argument('--text_threshold', default=0.5, type=float, help='text confidence threshold')
parser.add_argument('--low_text', default=0.4, type=float, help='text low-bound score')
parser.add_argument('--link_threshold', default=0.95, type=float, help='link confidence threshold')
parser.add_argument('--cuda', default=torch.cuda.is_available(), type=str2bool, help='Use cuda for inference')
parser.add_argument('--canvas_size', default=2500, type=int, help='image size for inference')
parser.add_argument('--mag_ratio', default=1.0, type=float, help='image magnification ratio')
parser.add_argument('--poly', default=False, action='store_true', help='enable polygon type')
parser.add_argument('--show_time', default=False, action='store_true', help='show processing time')
parser.add_argument('--test_folder', default='/data/', type=str, help='folder path to input images')
parser.add_argument('--refine', default=True, action='store_true', help='enable link refiner')
parser.add_argument('--refiner_model', default='./model/craft_refiner_CTW1500.pth', type=str, help='pretrained refiner model')
args = parser.parse_args(args=[])

def load_model():
    net = CRAFT()     # initialize
    if args.cuda:
        net.load_state_dict(copyStateDict(torch.load(config.CRAFT_MODEL_PATH)))
    else:
        net.load_state_dict(copyStateDict(torch.load(config.CRAFT_MODEL_PATH, map_location='cpu')))

    if args.cuda:
        print('Model is using cuda')
        net = net.cuda()
        net = torch.nn.DataParallel(net)
        cudnn.benchmark = False

    net.eval()

    # LinkRefiner
    refine_net = None
    if args.refine:
        from .refinenet import RefineNet
        refine_net = RefineNet()
        print('Loading weights of refiner from checkpoint (' + args.refiner_model + ')')
        if args.cuda:
            refine_net.load_state_dict(copyStateDict(torch.load(config.CRAFT_REFINE_MODEL_PATH)))
            refine_net = refine_net.cuda()
            refine_net = torch.nn.DataParallel(refine_net)
        else:
            refine_net.load_state_dict(copyStateDict(torch.load(config.CRAFT_REFINE_MODEL_PATH, map_location='cpu')))

        refine_net.eval()
    return net,refine_net
net ,refine_net= load_model()

def test_net(image, text_threshold, link_threshold, low_text, cuda, poly, refine_net=None):
    t0 = time.time()

    # resize
    img_resized, target_ratio, size_heatmap = imgproc.resize_aspect_ratio(image, args.canvas_size, interpolation=cv2.INTER_CUBIC, mag_ratio=config.MAGNIFICATION_RATIO)
    ratio_h = ratio_w = 1 / target_ratio

    # preprocessing
    x = imgproc.normalizeMeanVariance(img_resized)
    x = torch.from_numpy(x).permute(2, 0, 1)    # [h, w, c] to [c, h, w]
    x = Variable(x.unsqueeze(0))                # [c, h, w] to [b, c, h, w]
    if cuda:
        x = x.cuda()

    # forward pass
    with torch.no_grad():
        y, feature = net(x)
 
    # make score and link map
    score_text = y[0,:,:,0].cpu().data.numpy()
    score_link = y[0,:,:,1].cpu().data.numpy()

    # refine link
    if refine_net is not None:
        with torch.no_grad():
            y_refiner = refine_net(y, feature)
        score_link = y_refiner[0,:,:,0].cpu().data.numpy()

    t0 = time.time() - t0
    t1 = time.time()
    
    # Post-processing
    boxes, polys = craft_utils.getDetBoxes(score_text, score_link, text_threshold, link_threshold, low_text, poly)
    #print("intialllllllllllllllllllllll score_text    l", len(score_text))
    #print("intialllllllllllllllllllllll score_link    l", len(score_link))
    # coordinate adjustment
    boxes = craft_utils.adjustResultCoordinates(boxes, ratio_w, ratio_h)
    polys = craft_utils.adjustResultCoordinates(polys, ratio_w, ratio_h)
    for k in range(len(polys)):
        if polys[k] is None: polys[k] = boxes[k]

    t1 = time.time() - t1

    render_img = score_text.copy()
    render_img = np.hstack((render_img, score_link))
    ret_score_text = imgproc.cvt2HeatmapImg(render_img)

    if args.show_time : print("\ninfer/postproc time : {:.3f}/{:.3f}".format(t0, t1))

    return boxes, polys, ret_score_text


def sort_regions(contours_df, sorted_contours=[]):
    check_y = contours_df.iloc[0]['text_top']
    spacing_threshold = contours_df.iloc[0]['text_height']  * 0.8  # *2 #*0.5

    same_line = contours_df[abs(contours_df['text_top'] - check_y) < spacing_threshold]
    next_lines = contours_df[abs(contours_df['text_top'] - check_y) >= spacing_threshold]

    #     if len(same_line) > 0 :
    #         check_y = same_line['text_top'].max()
    #         same_line = contours_df[abs(contours_df['text_top'] - check_y) < spacing_threshold ]
    #         next_lines = contours_df[abs(contours_df['text_top'] - check_y) >=spacing_threshold]

    next_lines = contours_df[abs(contours_df['text_top'] - check_y) >= spacing_threshold]
    sort_lines = same_line.sort_values(by=['text_left'])
    for index, row in sort_lines.iterrows():
        sorted_contours.append(row)
    if len(next_lines) > 0:
        sort_regions(next_lines, sorted_contours)

    return sorted_contours
#
# def convert_to_in_df(craft_df):
#
#     in_df_columns = ['xml_index', 'text_top', 'text_left', 'text_width', 'text_height',
#                      'text', 'font_size', 'font_family', 'font_color', 'attrib']
#     in_df = pd.DataFrame(columns=in_df_columns)
#     in_df['text_top'] = craft_df['y1']
#     in_df['text_left'] = craft_df['x1']
#     in_df['text_height'] =(craft_df['y4'] - craft_df['y1'])
#     in_df['text_width'] = (craft_df['x2'] - craft_df['x1'])
#     in_df['text'] = ''
#     in_df['attrib'] = None
#     in_df['font_family'] = 'Arial Unicode MS'
#     in_df['font_family_updated'] = 'Arial Unicode MS'
#     in_df['font_size'] = in_df['text_height']
#     in_df['font_size_updated'] = in_df['text_height']
#     #in_df['detection_confidence'] = craft_df['confidence']
#
#     if len(in_df) > 0 :
#         in_df = in_df.sort_values(by=['text_top'])
#         in_df = pd.DataFrame(sort_regions(in_df, []))
#
#     return  in_df


def detect_text_per_file(image_paths,network,text_threshold,low_text_threshold,link_threshold,img_class="single_col"):
    
    in_dfs = []
    number_of_pages = len(image_paths)
    if img_class == "double_col":
        number_of_pages = 1
        image_paths = [image_paths]

    t = time.time()
    for image_path in image_paths :
        if type(image_path) == str:
            image = cv2.imread(image_path)
        else:
            image = image_path

        image = clean_image(image)
        # if img_class == "double_col":
        #     image = image_path
        # else:
        #     image = imgproc.loadImage(image_path)
        if network :
            bboxes, polys, score_text = test_net(image, text_threshold, link_threshold, low_text_threshold, args.cuda, args.poly, refine_net)
        else :
            bboxes, polys, score_text = test_net(image, text_threshold, link_threshold, low_text_threshold,args.cuda, args.poly, None)
        column_names = ["x1","y1" ,"x4","y4", "x2","y2","x3","y3"]
        df = pd.DataFrame(columns = column_names)
        for index, box in enumerate(bboxes):
        #for index, box in enumerate(polys):
            poly = np.array(box).astype(np.int32).reshape((-1))
            df.at[index,'x1']= int(poly[0]); df.at[index,'y1']= int(poly[1])
            df.at[index,'x2']= int(poly[2]); df.at[index,'y2']= int(poly[3])
            df.at[index,'x3']= int(poly[4]); df.at[index,'y3']= int(poly[5])
            df.at[index,'x4']= int(poly[6]); df.at[index,'y4']= int(poly[7])
            color = (255, 0, 0)
            thickness = 2
            #cv2.rectangle(image, (int(poly[0]),int(poly[1])), (int(poly[4]),int(poly[5])), color, thickness)
        #cv2.imwrite("/home/naresh/word_compare3/"+str(uuid.uuid4())+".jpg", image)
        #in_df = convert_to_in_df(df)
        in_dfs.append(df)
    time_taken = time.time() - t
    time_take_per_page = time_taken / number_of_pages

    message = 'Time taken for text detection is ' + str(time_taken) + '/' + str(number_of_pages) + 'time per page : ' + str(time_take_per_page)
    log_info(message, app_context.application_context)
    return in_dfs



def detect_text(images,language) :
    try:
        word_coordinates = []
        line_coordinates = []
        for index,image_set in enumerate(images):
            #lang = language[index]
            lang = 'hi'
            word_in_dfs = detect_text_per_file(image_set,network=False,\
                                            text_threshold=config.LANGUAGE_WORD_THRESOLDS[lang]['text_threshold'],\
                                                low_text_threshold= config.LANGUAGE_WORD_THRESOLDS[lang]['low_text'],link_threshold =config.LANGUAGE_WORD_THRESOLDS[lang]['link_threshold'])
            line_in_df  = detect_text_per_file(image_set,network=True,\
                                                text_threshold=config.LANGUAGE_LINE_THRESOLDS[lang]['text_threshold'],\
                                                low_text_threshold= config.LANGUAGE_LINE_THRESOLDS[lang]['low_text'],link_threshold =config.LANGUAGE_LINE_THRESOLDS[lang]['link_threshold'])
            word_coordinates.append(word_in_dfs)
            line_coordinates.append((line_in_df))
    except Exception as e :
        log_error('error detecting text' + str(e), app_context.application_context, e)
        return None,None
    return word_coordinates, line_coordinates






#extract_word_bbox("/home/naresh/Tarento/CRAFT-pytorch/test_images/mp_hc_1995_CRA237_hi-01.jpg")
