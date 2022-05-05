import glob
import config
import pandas as pd
import os
import cv2
from src.utilities.tesseract.post_process import post_process_ocr_text
from src.utilities.tesseract.utils import crop_region, get_tess_text,adjust_crop_coord


def tess_eval(input):
    lang, image_crop, coord, left, top,c_x, c_y = input
    line_text = get_tess_text(image_crop, lang,
                          left, top, c_x, c_y)
    #words  = post_process_ocr_text(image_crop,words,mode_height)
    return line_text


def add_lines_to_tess_queue(page_lines, queue, lang, image):
    for index, coord in enumerate(page_lines):
        try:
            adjusted_box,c_x,c_y = adjust_crop_coord(coord)
            image_crop = crop_region(adjusted_box,image)
            vertices = coord['boundingBox']['vertices']
            left = vertices[0]['x'];  top = vertices[0]['y']
            if image_crop is not None and image_crop.shape[1] > 3 and image_crop.shape[0] > 3:
                line_meta_data = [lang, image_crop, coord,left, top, c_x, c_y]
                queue.put(line_meta_data)
            else:
                queue.put([])
        except:
            queue.put([])
