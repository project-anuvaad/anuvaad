import cv2
import numpy as np
import os
#import config

class RectRepositories:
    def __init__(self, filepath):
        self.filepath = filepath
    
    def get_tables_and_lines(self):
        tables         = []
        lines          = []
        imgs           = []

        img, intersection, shapes  = self.get_contours_and_intersections()
        for idx, shape in enumerate(shapes):
            x,y,w,h = shape
            rect    = self.get_external_coordinates(intersection[y:y+h,x:x+w])
            if len(rect) == 0:
                lines.append({'x': x, 'y': y, 'w': w, 'h': h})
            else:
                tables.append({'x': x, 'y': y, 'w': w, 'h': h})
        return lines, tables

    def get_external_coordinates(self, intersection):
        contours = cv2.findContours(intersection, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)
        contours = contours[0] if len(contours) == 2 else contours[1]
        rects = []
        if len(contours) == 0:
            return rects

        contours, boundingBoxes = self.sort_contours(contours)
        for c in contours:
            x, y, w, h = cv2.boundingRect(c)
            rects.append((x, y, w, h))
        return rects

    def get_contours_and_intersections(self):
        if type(self.filepath) == str:
            img = cv2.imread(self.filepath, 0)
        else:
            img = self.filepath

        MAX_THRESHOLD_VALUE  = 255
        BLOCK_SIZE           = 15
        THRESHOLD_CONSTANT   = 0
        SCALE                = 15

        filtered   = cv2.adaptiveThreshold(~img, MAX_THRESHOLD_VALUE, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, BLOCK_SIZE, THRESHOLD_CONSTANT)
        horizontal = filtered.copy()
        vertical   = filtered.copy()

        horizontal_size      = int(horizontal.shape[1] / SCALE)
        horizontal_structure = cv2.getStructuringElement(cv2.MORPH_RECT, (horizontal_size, 1))
        horizontal           = cv2.erode(horizontal, horizontal_structure)
        horizontal           = cv2.dilate(horizontal, horizontal_structure)

        vertical_size        = int(vertical.shape[0] / SCALE)
        vertical_structure   = cv2.getStructuringElement(cv2.MORPH_RECT, (1, vertical_size))
        vertical             = cv2.erode(vertical, vertical_structure)
        vertical             = cv2.dilate(vertical, vertical_structure)

        mask          = horizontal + vertical
        contours      = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        contours      = contours[0] if len(contours) == 2 else contours[1]
        intersection  = cv2.bitwise_and(horizontal, vertical)

        rects = []
        if len(contours) == 0:
            return img, intersection, rects

        contours, boundingBoxes = self.sort_contours(contours)
        for c in contours:
            x, y, w, h = cv2.boundingRect(c)
            rects.append((x, y, w, h))
        
        return img, intersection, rects

    def sort_contours(self, cnts, method="left-to-right"):
        reverse = False
        i = 0
        if method == "right-to-left" or method == "bottom-to-top":
            reverse = True
        if method == "top-to-bottom" or method == "bottom-to-top":
            i = 1
        boundingBoxes = [cv2.boundingRect(c) for c in cnts]
        (cnts, boundingBoxes) = zip(*sorted(zip(cnts, boundingBoxes),key=lambda b:b[1][i], reverse=reverse))
        return (cnts, boundingBoxes)
