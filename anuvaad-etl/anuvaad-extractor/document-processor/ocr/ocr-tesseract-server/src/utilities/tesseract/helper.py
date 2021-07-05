import glob
import config
import pandas as pd
import os
import cv2
from src.utilities.tesseract.dynamic_adjustment import coord_adjustment
from src.utilities.tesseract.post_process import post_process_ocr_text
from src.utilities.tesseract.utils import scale_coords,crop_region,get_tess_text,frequent_height




def tess_eval(input):
    lang,image_crop,coord,mode_height,left,top,rgn_idx,line_idx= input
    words  = get_tess_text(image_crop,lang,mode_height,left,top)
    #words  = post_process_ocr_text(image_crop,words,mode_height)   
    return  words,rgn_idx,line_idx

def add_lines_to_tess_queue(page_lines,queue,lang,image,mode_height,rgn_idx,line_idx):
    for index,coord in enumerate(page_lines):
        image_crop = crop_region(coord,image)
        vertices = coord['boundingBox']['vertices']
        left = vertices[0]['x'];  top = vertices[0]['y']
        if image_crop is not None and image_crop.shape[1] >3 and image_crop.shape[0] > 3:
            line_meta_data = [lang, image_crop,coord,mode_height,left,top,rgn_idx,line_idx]
            queue.put(line_meta_data) 
        else:
            queue.put([]) 
    
