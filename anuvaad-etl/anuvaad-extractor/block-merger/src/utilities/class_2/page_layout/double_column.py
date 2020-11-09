import cv2
# import numpy as np
#
# import matplotlib.pyplot as plt
# import glob
#
# image_dir = '/home/naresh/Tarento/PubLayNet/pdftoimage/1506.02640/'
# save_dir = '/home/naresh/Tarento/PubLayNet/crop_image/yolo/'
# config = {'edge_threshold_w': 0.75}
#

def sum_along_w(binary):
    h, w = binary.shape
    sum_w = []
    for i in range(w):
        sum_w.append(h - binary[:, i].sum())
    return sum_w


def sum_along_h(binary):
    h, w = binary.shape
    sum_h = []
    for i in range(h):
        sum_h.append(w - binary[i, :].sum())
    return sum_h


def get_column(image,width_ratio):
    # images = glob.glob(image_dir + '*.jpg')
    # for image in images:
    roll_number = cv2.imread(image, 0)
    image_height = roll_number.shape[0]
    filtered_2 = cv2.bilateralFilter(roll_number.copy(), 10, int(image_height / 2), int(image_height / 2))
    image_height = roll_number.shape[0]
    filtered_5 = cv2.bilateralFilter(roll_number.copy(), 10, int(image_height / 4), int(image_height / 4))
    binary = cv2.adaptiveThreshold(filtered_2, 1, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    binary_5 = cv2.adaptiveThreshold(filtered_5, 1, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    h, w = binary_5.shape
    # sum_h = sum_along_h(binary_5)
    sum_w = sum_along_w(binary_5)
    temp_index = sum_w[int(w / 2) - 200:int(w / 2) + 200].index(min(sum_w[int(w / 2) - 200:int(w / 2) + 200]))
    real_index = temp_index + int(w / 2) - 200
    real_index = int(real_index * width_ratio)
    regions = [{'text_top':0,'text_left':0,'text_width':real_index,'text_height':h},{'text_top':0,'text_left':real_index,'text_width':w - real_index,'text_height':h}]
    #
    # image1 = roll_number[:, 0:real_index]
    # image2 = roll_number[:, real_index:]
    # cv2.imwrite(save_dir + "1_" + str(image.split('/')[-1]), image1)
    # cv2.imwrite(save_dir + "2_" + str(image.split('/')[-1]), image2)
    return regions


#
# ver_crop_image(image_dir, save_dir)
#
#
