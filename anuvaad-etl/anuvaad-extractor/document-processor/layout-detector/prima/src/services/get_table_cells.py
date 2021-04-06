import pandas as pd
from src.utilities.table.table import TableRepositories
from src.utilities.table.line import RectRepositories
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
from collections import Counter
import cv2
import src.utilities.app_context as app_context
from src.utilities.remove_water_mark import clean_image
from src.utilities.model_response import Box


def end_point_correction(region, margin, ymax,xmax):
    # check if after adding margin the endopints are still inside the image
    x,y,w,h = region['x'] ,region['y'] , region['w'] ,region['h']
    if (y - margin) < 0:
        ystart = 0
    else:
        ystart = y - margin
    if (y + h + margin) > ymax:
        yend = ymax
    else:
        yend = y + h + margin
    if (x - margin) < 0:
        xstart = 0
    else:
        xstart = x - margin
    if (x + w + margin) > xmax:
        xend = xmax
    else:
        xend = x + w + margin
    return ystart, yend, xstart, xend


def mask_image(image, regions , image_width,image_height,input_json,margin= 0 ,fill=255):
    for table in regions:
        try :
            row_top, row_bottom,row_left,row_right = end_point_correction(table, 2,image_height,image_width)
            if len(image.shape) == 2 :
                image[row_top - margin : row_bottom + margin , row_left - margin: row_right + margin] = fill
            if len(image.shape) == 3 :
                image[row_top - margin: row_bottom + margin, row_left - margin: row_right + margin,:] = fill
        except Exception as e :
            log_error("Service TableExtractor Error in masking bg image" +str(e), input_json, e)
            return image
    return image



def get_regions(regions,clss):

    r_box= []
    if clss == 'TABLE':

        for table in regions:
            ####
            tab = Box()
            tab.set_coords(table)
            tab_coord =  tab.get_box()
            
            #r_box.append(tab_coord)
            #####

            for t_cell in table['rect']:
                t_cell['x'] += table['x']
                t_cell['y'] += table['y']
                r_cell = Box()
                r_cell.set_class(clss)
                r_cell.set_coords(t_cell)
                r_box.append(r_cell.get_box())
            

    # if clss == 'LINE':
    #     for line in regions:
    #             l_reg = Box()
    #             l_reg.set_class(clss)
    #             l_reg.set_coords(line)
    #             r_box.append(l_reg.get_box())
    return r_box


def mask_tables(page_imge,check=False):

    try:
        table_image = cv2.imread(page_imge, 0)
        page_img    = cv2.imread(page_imge)

        table_image = clean_image(table_image)
        page_img    = clean_image(page_img)

        image_width, image_height = table_image.shape[1], table_image.shape[0]
        if check:
            cv2.imwrite('bg_org.png', table_image)
    except Exception as e:
        log_error("Service TableExtractor Error in loading background html image", app_context.application_context,
                  e)
        return None, None

    # To do recognize and mask images berfor finding tables
    #table_image = mask_image(table_image, img_df, image_width, image_height, app_context.application_context,
    #                         margin=0, fill=255)
    #check = True
    if check:
        cv2.imwrite('bg_org_masked.png', table_image)
    try:
        tables = TableRepositories(table_image).response['response']['tables']
    except  Exception as e:
        log_error("Service TableExtractor Error in finding tables", app_context.application_context, e)
        return None, None
    try:
        rects = RectRepositories(table_image)
        lines, _ = rects.get_tables_and_lines()
    except  Exception as e:
        log_error("Service TableExtractor Error in finding lines", app_context.application_context, e)
        return None, None

    #line_regions = get_regions(lines, 'LINE')
    tables_regions = get_regions(tables , 'TABLE' )

    masked_image = mask_image(page_img, tables, image_width, image_height, app_context.application_context, margin=0,
                              fill=255)
    ### add line regions
    #return masked_image, line_regions + tables_regions
    return masked_image, tables_regions
