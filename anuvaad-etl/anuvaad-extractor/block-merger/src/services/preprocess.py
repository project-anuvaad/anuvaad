import pandas as pd
#import config
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
from config import PREPROCESS_CONFIGS as preprocess_config,HEADER_FOOTER_BY_PRIMA
import src.utilities.app_context as app_context
from src.utilities.primalaynet.header_footer import PRIMA


import time
from anuvaad_auditor.errorhandler import post_error_wf

def cut_page(page_df ,height ,cut_at ,direction):

    # uncomment for prima header footer detection
    # cut_mark = height * cut_at
    cut_mark = [ht * cut_at for ht in height]
    cut_mark = cut_mark[0]
    if direction == 'above':
        sub_df = page_df[page_df['text_top'] <= cut_mark ]

    else :
        sub_df = page_df[page_df['text_top'] >= cut_mark ]

    return sub_df


def add_box_coordinates(sub_df):
    df = sub_df.copy(deep=True)
    df['text_right']  = sub_df['text_left'] + sub_df['text_width']
    df['text_bottom'] = sub_df['text_top'] + sub_df['text_height']
    return df

def bb_intersection_over_union(rowA, rowB):
    boxA = [rowA['text_left'] ,rowA['text_top'], rowA['text_right'], rowA['text_bottom']]
    boxB = [rowB['text_left'], rowB['text_top'], rowB['text_right'], rowB['text_bottom']]

    # determine the (x, y)-coordinates of the intersection rectangle
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])
    # compute the area of intersection rectangle
    interArea = max(0, xB - xA + 1) * max(0, yB - yA + 1)
    # compute the area of both the prediction and ground-truth
    # rectangles
    boxAArea = (boxA[2] - boxA[0] + 1) * (boxA[3] - boxA[1] + 1)
    boxBArea = (boxB[2] - boxB[0] + 1) * (boxB[3] - boxB[1] + 1)
    # compute the intersection over union by taking the intersection
    # area and dividing it by the sum of prediction + ground-truth
    # areas - the interesection area
    iou = interArea / float(boxAArea + boxBArea - interArea)
    # return the intersection over union value
    return iou


def find_header(xml_dfs,page_height, preprocess_config):
    pdf_levle = []

    try :
        page_df = xml_dfs[0]
    except Exception as e :
        post_error_wf("INVALID_XML_ERROR", "invalid xml_df passed for preprocessing ", app_context.application_context ,e)
        return None
        

    sub_df = cut_page(page_df, page_height, cut_at=preprocess_config['header_cut'], direction='above')
    sub_df = add_box_coordinates(sub_df)
    margin = preprocess_config['margin']


    for page2_df in xml_dfs:
        s_df = cut_page(page2_df, page_height, cut_at=preprocess_config['header_cut'], direction='above')
        s_df = add_box_coordinates(s_df)

        page_level = []
        for index1, row1 in sub_df.iterrows():
            iou = 0
            sub_s_df = s_df[
                (s_df['text_top'] > row1['text_top'] - margin) & (s_df['text_bottom'] < row1['text_bottom'] + margin)]
            if len(sub_df) > 0:
                for index2, row2 in sub_s_df.iterrows():
                    iou += bb_intersection_over_union(row1, row2)

            page_level.append(iou)
        pdf_levle.append(page_level)

    iou_df = pd.DataFrame(pdf_levle, columns=sub_df['text'].values)
    check_repeation = iou_df.sum() / len(iou_df)
    regions_to_remove = sub_df[list(check_repeation > preprocess_config['repeat_threshold'])]

    return regions_to_remove


def find_footer(xml_dfs, page_height,preprocess_config,):
    pdf_level = []

    try :
        page_df = xml_dfs[0]
    except Exception as e :
        post_error_wf(400, "invalid xml_df passed for preprocessing ", app_context.application_context ,e)
        return None

    sub_df = cut_page(page_df, page_height, cut_at=preprocess_config['footer_cut'], direction='below')
    sub_df = add_box_coordinates(sub_df)
    margin = preprocess_config['margin']
    for page2_df in xml_dfs:
        s_df = cut_page(page2_df, page_height, cut_at=preprocess_config['footer_cut'], direction='below')
        s_df = add_box_coordinates(s_df)

        page_level = []
        for index1, row1 in sub_df.iterrows():
            iou = 0
            sub_s_df = s_df[(s_df['text_top'] > row1['text_top'] - margin) & (s_df['text_bottom'] < row1['text_bottom'] + margin)]
            if len(sub_df) > 0 :
                for index2, row2 in sub_s_df.iterrows():
                    iou += bb_intersection_over_union(row1, row2)

            page_level.append(iou)
        pdf_level.append(page_level)

    iou_df = pd.DataFrame(pdf_level, columns=sub_df['text'].values)
    check_repeation = iou_df.sum() / len(iou_df)
    regions_to_remove = sub_df[list(check_repeation > preprocess_config['repeat_threshold'])]

    return regions_to_remove


def add_attrib(df, region_to_change, width_ratio,height_ratio,attrib, margin=3):
    left_key = 'text_left'
    top_key = 'text_top'
    width_key = 'text_width'
    height_key = 'text_height'
    if len(region_to_change) > 0:
        for index, row in region_to_change.iterrows():
            #print(row)
            area = [row['text_top'] - margin, row['text_left'] - margin, row['text_top'] + row['text_height'] + margin,
                    row['text_left'] + row['text_width'] + margin]
            #print(area)
            #print((page_df['text_top'] >= area[0]) & (page_df['text_left'] >= area[1]) & (
            #            page_df['text_top'] + page_df['text_height'] <= area[2]) & (
            #                  page_df['text_left'] + page_df['text_width'] <= area[3]))

            # intersection = (page_df['text_top'] >= area[0]) & (page_df['text_left'] >= area[1]) & (
            #             page_df['text_top'] + page_df['text_height'] <= area[2]) & (
            #                               page_df['text_left'] + page_df['text_width'] <= area[3])
            #

            intersection = ((df[left_key] + df[width_key] * 0.5) >= area[1] * width_ratio ) \
                     & ((df[top_key] + df[height_key] * 0.5) >= area[0]*height_ratio ) \
                     & ((df[top_key] + df[height_key] * 0.5) <= (area[2])*height_ratio ) \
                     & ((df[left_key] + df[width_key] * 0.5) <= (area[3]* width_ratio ) )

            if intersection.sum() >0:
                if HEADER_FOOTER_BY_PRIMA:
                    df['attrib'].loc[intersection] = row['class']
                else:
                    df['attrib'].loc[intersection]  = attrib
            else:
                region_to_change['attrib'] = attrib
                # Merge the DataFrames based on the 'region' and 'country' columns
                merged_df = df.merge(region_to_change, on=['text_top','text_left'], how='left')

                # # Update the 'attrib' column in 'df' where the records of 'region_to_change' exist
                df['attrib'] = merged_df['attrib_y'].fillna(merged_df['attrib_x'])
            #
            # page_df['attrib'].loc[(page_df['text_top'] >= area[0]) & (page_df['text_left'] >= area[1]) & (
            #             page_df['text_top'] + page_df['text_height'] <= area[2]) & (
            #                               page_df['text_left'] + page_df['text_width'] <= area[3])] = attrib

    return df


def prepocess_pdf_regions(pdf_data,flags, config =preprocess_config ):
    xml_dfs = pdf_data['in_dfs']
    #if flags['doc_class'] == 'class_1':
    page_height=  pdf_data['page_height']
    #else:
    #    page_height =  pdf_data['pdf_image_height']
    #header_region = None
    #footer_region =None
    try :
        if not HEADER_FOOTER_BY_PRIMA :
            start_time = time.time()
            header_region = find_header(xml_dfs,page_height,config)
            footer_region = find_footer(xml_dfs,page_height,config)
            end_time = time.time() - start_time
            log_info('Header Footer detection completed successfully  in time {} '.format(end_time), app_context.application_context)
            log_info('Footers found {} '.format(len(footer_region)), app_context.application_context)
            log_info('Headers found {}'.format(len(header_region)),app_context.application_context)
            pdf_data['header_region'], pdf_data['footer_region'] = header_region, footer_region

        else:
            pdf_data['header_region'], pdf_data['footer_region'] = pd.DataFrame(), pd.DataFrame()
        return pdf_data
    except Exception as e:
        log_error('Error in finding header/footer ' + e ,app_context.application_context ,e)
        pdf_data['header_region'], pdf_data['footer_region'] = pd.DataFrame(),pd.DataFrame()
        return pdf_data


def tag_heaader_footer_attrib(header_region , footer_region ,page_df,width_ratio,height_ratio,magrin=5):
    page_df  = add_attrib(page_df, header_region,width_ratio,height_ratio ,attrib='HEADER',margin=magrin)
    page_df = add_attrib(page_df, footer_region,width_ratio,height_ratio,attrib='FOOTER', margin=magrin)
    return page_df



def image_boundry_correction(width, height ,df):

    #try :

    df['text_top'].loc[df['text_top'] <0 ]  = 0
    df['text_left'].loc[df['text_left'] < 0 ] = 0
    #df['text_width'] = abs(df['text_width'])
    #df['text_height'] = abs(df['text_height'])

    df['text_height'].loc[ (df['text_height'] + df['text_top'] ) > height ]  =  (height -1 - (df['text_top'].loc[ (df['text_height'] + df['text_top']  )  > height ]))
    df['text_width'].loc[(df['text_width'] + df['text_left']) > width] = (width  -1 - (df['text_left'].loc[(df['text_width'] + df['text_left']) > width]))

    return  df
    # except :
    #     return  df

# Remove tables and lines from bg image

def mask_image(image,df, image_width,image_height,input_json,margin= 0 ,fill=255):
    if len(df) > 0:
        df = image_boundry_correction(image_width,image_height,df)
        for index, row in df.iterrows():
            try :
                row_bottom = int(row['text_top']+10 + row['text_height'])
                row_right = int(row['text_left']+10 + row['text_width'])
                row_left   = row['text_left']-10
                row_top    = row['text_top']-10

                # Some times the image height/width  can be negative
                if row_right < row['text_left'] :
                    row_left = row_right
                    row_right = row['text_left']

                if row_top > row_bottom :
                    row_top = row_bottom
                    row_bottom = row['text_top']


                if len(image.shape) == 2 :
                    image[row_top - margin : row_bottom + margin , row_left - margin: row_right + margin] = fill
                if len(image.shape) == 3 :
                    image[row_top - margin: row_bottom + margin, row_left - margin: row_right + margin,:] = fill

            except Exception as e :
                log_error("Service TableExtractor Error in masking bg image" +str(e), input_json, e)
                return image
    return image

