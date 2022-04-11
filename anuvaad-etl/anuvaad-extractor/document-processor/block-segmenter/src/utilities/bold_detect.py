import time
from pathlib import Path

import cv2
import torch
import torch.backends.cudnn as cudnn
from numpy import random
import numpy as np
from src.utilities.yolov5.experimental import attempt_load
from src.utilities.yolov5.datasets import LoadStreams, LoadImages
from src.utilities.yolov5.general import check_img_size, check_requirements, check_imshow, non_max_suppression, apply_classifier, \
    scale_coords, xyxy2xywh, strip_optimizer
from src.utilities.yolov5.plots import plot_one_box
from src.utilities.yolov5.torch_utils import select_device, load_classifier, time_synchronized

import config

def load_model(weights=config.WEIGHT_PATH ,device=config.DEVICE):
    select_d = select_device(device)
    return attempt_load([weights], map_location=select_d)


model = load_model()


def detect( image_path ,model=model, image_size = config.IMAGE_SIZE,s_device=config.DEVICE):

    # Load model
    stride = int(model.stride.max())  # model stride
    imgsz = check_img_size(image_size, s=stride)  # check img_size

    # Get names and colors
    names = model.module.names if hasattr(model, 'module') else model.names
    colors = [[random.randint(0, 255) for _ in range(3)] for _ in names]

    device = select_device(s_device)
    # Run inference
    # if device == 'cpu':
    #     model(torch.zeros(1, 3, imgsz, imgsz).to(device).type_as(next(model.parameters())))  # run once

    t0 = time.time()
    dataset = LoadImages(image_path, img_size=imgsz, stride=stride)

    for path, img, im0s, vid_cap in dataset:
        img = torch.from_numpy(img).to(device)
        img = img/255
        if img.ndimension() == 3:
            img = img.unsqueeze(0)

        # Inference
        t1 = time_synchronized()
        pred = model(img, augment=None)[0]

        # Apply NMS
        pred = non_max_suppression(pred, config.CONF_THRESHOLD, config.IOU_THRESHOLD)
        t2 = time_synchronized()

        output = []
        # Process detections
        for i, det in enumerate(pred):  # detections per image
            p, s, im0, frame = path, '', im0s, getattr(dataset, 'frame', 0)
            p = Path(p)  # to Path

            s += '%gx%g ' % img.shape[2:]  # print string
            gn = torch.tensor(im0.shape)[[1, 0, 1, 0]]  # normalization gain whwh
            if len(det):
                # Rescale boxes from img_size to im0 size
                det[:, :4] = scale_coords(img.shape[2:], det[:, :4], im0.shape).round()

                # Print results
                for c in det[:, -1].unique():
                    n = (det[:, -1] == c).sum()  # detections per class
                    s += f"{n} {names[int(c)]}{'s' * (n > 1)}, "  # add to string

                for *xyxy, conf, cls in reversed(det):
                    #label = f'{names[int(cls)]} {conf:.2f}'
                    bbox = {'vertices':[]}

                    bbox['vertices'].append({'x': int(xyxy[0]), 'y': int(xyxy[1])})
                    bbox['vertices'].append({'x': int(xyxy[2]), 'y': int(xyxy[1])})
                    bbox['vertices'].append({'x': int(xyxy[2]), 'y': int(xyxy[3])})
                    bbox['vertices'].append({'x': int(xyxy[0]), 'y': int(xyxy[3])})



                    output.append({'class':names[int(cls)], 'boundingBox':bbox  ,'conf' :round(float(conf),2) })
                    #plot_one_box(xyxy, im0, label=label, color=colors[int(cls)], line_thickness=3)

            print(f'{s}Done. ({t2 - t1:.3f}s)')

            # Stream results
            # view_img =True
            # save_txt =True
            # for *xyxy, conf, cls in reversed(det):
            #     if save_txt:  # Write to file
            #         xywh = (xyxy2xywh(torch.tensor(xyxy).view(1, 4)) / gn).view(-1).tolist()  # normalized xywh
            #         # line = (cls, *xywh, conf) if opt.save_conf else (cls, *xywh)  # label format
            #         # with open(txt_path + '.txt', 'a') as f:
            #         #     f.write(('%g ' * len(line)).rstrip() % line + '\n')
            #
            #     if view_img:  # Add bbox to image
            #         label = f'{names[int(cls)]} {conf:.2f}'
            #         plot_one_box(xyxy, im0, label=label, color=colors[int(cls)], line_thickness=3)
            #
            # if view_img:
            #     cv2.imwrite('/home/dhiraj/b.png',im0)
            #     cv2.imshow(str(p), im0)
            #     cv2.waitKey(1)  # 1 millisecond

            #Save results (image with detections)

    print(f'Done. ({time.time() - t0:.3f}s)')
    return output
