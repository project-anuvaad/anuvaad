import hashlib
import uuid, os, io
import config
import sys
import concurrent.futures
import numpy as np
from google.cloud import vision
from src.services.segment import horzontal_merging, break_block
from src.utilities.region_operations import merge_text, set_font_info
from src.services.region_unifier import Region_Unifier
import cv2,copy
from src.utilities.model_response import set_bg_image
from src.utilities.request_parse import MapKeys,UpdateKeys
from src.services.overlap_remove import RemoveOverlap,merger_lines_words
from src.services.dynamic_adjustment import coord_adjustment
from src.services.remove_watermark import clean_image
import json
from src.db.connection_manager import get_redis
# from src.utilities.app_context import  app_context
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from joblib import Parallel, delayed
import time

region_unifier = Region_Unifier()
removeoverlap = RemoveOverlap()

redis_db = get_redis()
client = vision.ImageAnnotatorClient()
breaks = vision.enums.TextAnnotation.DetectedBreak.BreakType

def get_text(page_c_lines,file,path,page_dict,page_regions,page_c_words,font_info,file_properties,idx):
    
    #path = config.BASE_DIR+path
    # watermark_img = file_properties.get_watermark_remove_config()
    if config.WATERMARK_REMOVE:
        img = cv2.imread(path)
        # img[175 < img ] = 255
        img = clean_image(img)
        masked_path = path.split('.jpg')[0]+"_watermark-removed.jpg"
        cv2.imwrite(masked_path,img)
    else:
        masked_path = path

    with io.open(masked_path, 'rb') as image_file:
        content = image_file.read()
    image = vision.types.Image(content=content)
    response = client.document_text_detection(image=image)
    page_output,page_words,save_path = get_document_bounds(page_c_lines,file,response.full_text_annotation,page_dict,page_regions,page_c_words,font_info,path,file_properties,idx)
    return page_output,page_words,save_path


def text_extraction(file_properties,image_paths,file):
    page_res = []
    width, height = file_properties.get_pageinfo(0)
    redis_keys = []
    for idx,image_path in enumerate(image_paths):

        if config.FONTS == True:
            font_info = file_properties.get_fontinfo(idx)
        else :
            font_info = None
        page_dict = {"identifier": str(uuid.uuid4()),"resolution": config.EXRACTION_RESOLUTION }
        page_regions =  file_properties.get_regions(idx)
        page_c_words = file_properties.get_words(idx)
        page_c_lines = file_properties.get_lines(idx)
        page_output,page_words,save_path = get_text(page_c_lines,file,image_path,page_dict,page_regions,page_c_words,font_info,file_properties,idx)
        
        #save_path = mask_image_vision(image_path, page_words, idx, file_properties, width, height)
        page_output = set_bg_image(page_output, save_path, idx,file)
        # file_properties.set_regions(idx,page_output)
        # file_properties.delete_regions(idx)
        # if config.FONTS == True:
        #     file_properties.pop_fontinfo(idx)

        img_name = image_path.split("/")[-1].split(".jpg")[0]
        sent_key=hashlib.sha256(img_name.encode('utf_16')).hexdigest()
        save_result= save_sentences_on_hashkey(sent_key,page_output)
        redis_keys.append(sent_key)
#         log_info("texts pushed to redis store", None)
        del page_output

    for i,key in enumerate(redis_keys):
        val=redis_db.get(key)
        val = json.loads(val)
        file_properties.set_regions(i,val)
        file_properties.delete_regions(i)
        if config.FONTS == True:
            file_properties.pop_fontinfo(i)
    if redis_keys != None:
        delete(redis_keys)
#         log_info("keys deleted from redis store", None)
    return file_properties.get_file()

def delete(keys):
        try:
            redis_db.delete(*keys)
            return 1
        except Exception as e:
            # log_exception("Exception in TMXREPO: delete | Cause: " + str(e), None, e)
            return None

def save_sentences_on_hashkey(key,sent):
        try:
            redis_db.set(key, json.dumps(sent))
            return 1
        except Exception as e:
            # log_exception("Exception in storing sentence data on redis store | Cause: " + str(e),None, e)
            return None

def extract_line(paragraph):
    line_coord = []
    line_text  = []
    line = ""
    top_left_x    = sys.maxsize; top_left_y    = sys.maxsize; top_right_x = -1; top_right_y    = sys.maxsize
    bottom_left_x = sys.maxsize; bottom_left_y = -1;      bottom_right_x  = -1; bottom_right_y =-1
    for word in paragraph.words:
        for symbol in word.symbols:
            line += symbol.text
            top_left_x     = min(top_left_x,symbol.bounding_box.vertices[0].x);    top_left_y     = min(top_left_y,symbol.bounding_box.vertices[0].y)
            top_right_x    = max(top_right_x,symbol.bounding_box.vertices[1].x);   top_right_y    = min(top_right_y,symbol.bounding_box.vertices[1].y)
            bottom_left_x  = min(bottom_left_x,symbol.bounding_box.vertices[3].x); bottom_left_y  = max(bottom_left_y,symbol.bounding_box.vertices[3].y)
            bottom_right_x = max(bottom_right_x,symbol.bounding_box.vertices[2].x);bottom_right_y = max(bottom_right_y,symbol.bounding_box.vertices[2].y)
            if symbol.property.detected_break.type == breaks.SPACE:
                line += ' '  
            if symbol.property.detected_break.type == breaks.EOL_SURE_SPACE or symbol.property.detected_break.type == breaks.HYPHEN:
                line += ' '
                lines_coord = []
                line_text.append(line)
                lines_coord.append({'x':top_left_x,'y':top_left_y});lines_coord.append({'x':top_right_x,'y':top_right_y})
                lines_coord.append({'x':bottom_right_x,'y':bottom_right_y});lines_coord.append({'x':bottom_left_x,'y':bottom_left_y})
                line_coord.append(lines_coord)
                line = ''
                top_left_x    = sys.maxsize ;top_left_y   = sys.maxsize; top_right_x = -1;top_right_y    = sys.maxsize
                bottom_left_x = sys.maxsize;bottom_left_y = -1  ; bottom_right_x     = -1;bottom_right_y =-1
            if symbol.property.detected_break.type == breaks.LINE_BREAK:
                lines_coord = []
                lines_coord.append({'x':top_left_x,'y':top_left_y});lines_coord.append({'x':top_right_x,'y':top_right_y})
                lines_coord.append({'x':bottom_right_x,'y':bottom_right_y});lines_coord.append({'x':bottom_left_x,'y':bottom_left_y})
                line_coord.append(lines_coord)
                line_text.append(line)
                line = ''
                top_left_x    = sys.maxsize ;top_left_y   = sys.maxsize; top_right_x = -1;top_right_y    = sys.maxsize
                bottom_left_x = sys.maxsize;bottom_left_y = -1  ; bottom_right_x     = -1;bottom_right_y = -1
    return line_coord, line_text

def add_line(page_dict, line_coord, line_text):
    for coord, text in zip(line_coord, line_text):
        line_region = {"identifier": str(uuid.uuid4()), "boundingBox":{"vertices":[]}}
        line_region["boundingBox"]["vertices"] = coord
        line_region["text"] = text
        page_dict["lines"].append(line_region)
    return page_dict

def get_document_bounds(page_c_lines,file,response,page_dict,page_regions,page_c_words,font_info,path,file_properties,idx):
    page_dict["regions"] = []
    page_dict["lines"]   = []
    page_dict["words"]   = []
    
    
    for i,page in enumerate(response.pages):
        page_dict["vertices"]=  [{"x":0,"y":0},{"x":page.width,"y":0},{"x":page.width,"y":page.height},{"x":0,"y":page.height}]
        for block in page.blocks:
            block_region = {"identifier": str(uuid.uuid4()), "boundingBox":{"vertices":[]}, "class":'PARA',}
            block_vertices = []
            block_vertices.append({"x": block.bounding_box.vertices[0].x, "y": block.bounding_box.vertices[0].y})
            block_vertices.append({"x": block.bounding_box.vertices[1].x, "y": block.bounding_box.vertices[1].y})
            block_vertices.append({"x": block.bounding_box.vertices[2].x, "y": block.bounding_box.vertices[2].y})
            block_vertices.append({"x": block.bounding_box.vertices[3].x, "y": block.bounding_box.vertices[3].y})
            block_region["boundingBox"]["vertices"] = block_vertices
            page_dict["regions"].append(block_region)


            for paragraph in block.paragraphs:
                line_coord, line_text = extract_line(paragraph)
                page_dict = add_line(page_dict, line_coord, line_text)
                #print(paragraph)
                for word in paragraph.words:
                    word_region = {"identifier": str(uuid.uuid4()), "boundingBox":{"vertices":[]}}
                    word_vertices = []
                    word_vertices.append({"x": word.bounding_box.vertices[0].x, "y": word.bounding_box.vertices[0].y})
                    word_vertices.append({"x": word.bounding_box.vertices[1].x, "y": word.bounding_box.vertices[1].y})
                    word_vertices.append({"x": word.bounding_box.vertices[2].x, "y": word.bounding_box.vertices[2].y})
                    word_vertices.append({"x": word.bounding_box.vertices[3].x, "y": word.bounding_box.vertices[3].y})
                    word_region["boundingBox"]["vertices"] = word_vertices
                    
                    word_text = ''.join([
                        symbol.text for symbol in word.symbols
                    ])
                    #print(word_text)
                    word_region["text"] = word_text
                    word_region["conf"] = word.confidence
                    if len(word.symbols[0].property.detected_languages)!=0:
                        word_region["language"] = word.symbols[0].property.detected_languages[0].language_code
                    else:
                        if len(page.property.detected_languages)!=0:
                            word_region["language"] = page.property.detected_languages[0].language_code
                    page_dict["words"].append(word_region)

    page_words   =  page_dict["words"]
    if "craft_line" in file['config']["OCR"].keys() and file['config']["OCR"]["craft_line"]=="True":
        page_lines = page_c_lines
    elif "line_layout" in file['config']["OCR"].keys() and file['config']["OCR"]["line_layout"]=="True":
        page_lines = page_c_lines
    else:
        page_lines   =  page_dict["lines"]
    if len(page_lines)>0:
        page_lines = removeoverlap.remove_overlap(page_lines)
        # page_lines = merger_lines_words(page_lines,page_words)
        # page_lines = removeoverlap.remove_overlap(page_lines)

    

    #add font information to words
    page_words   = set_font_info(page_words,font_info)

    
    v_list,save_path = segment_regions(file,page_words,page_lines,page_regions,page_c_words,path,file_properties,idx)

    return v_list,page_words,save_path

keys = MapKeys()
update_key = UpdateKeys()
def update_coord(line,new_top,line_t,line_b):
    for word_idx, word in enumerate(line['regions']):
        if 'class' not in word.keys():
            word['class'] ='WORD'
        word_t = keys.get_top(word); word_h = keys.get_height(word)
        #if word_h+new_top<=line_b:
        word = update_key.update_y(word,new_top,0); word = update_key.update_y(word,new_top,1)
        word = update_key.update_y(word,new_top+word_h,2); word = update_key.update_y(word,new_top+word_h,3)
        line['regions'][word_idx] = word
    return line

def delete_region(regions,indexes):
    updated_regions = []
    for idx,region in enumerate(regions):
        if idx not in indexes:
            updated_regions.append(regions[idx])
    return updated_regions

def verify__table_structure(regions):
    region_del_index = []
    for region_idx,region in enumerate(regions):
        if 'regions' in region.keys():
            if 'class' in region.keys() and region['class'] == 'TABLE':
                line_del_index = []
                for line_idx,line in enumerate(region['regions']):
                    if 'regions' in line.keys():
                        #for word_idx,word in enumerate(line['regions']):
                        pass
                    else:
                        line_del_index.append(line_idx)

                if len(line_del_index)>0:
                    line_updated = delete_region(region['regions'],line_del_index)
                else:
                    line_updated = region['regions']
                regions[region_idx]['regions'] = copy.deepcopy(line_updated)
        else:
            region_del_index.append(region_idx)
    if len(region_del_index)>0:
        regions = delete_region(regions,region_del_index)
    return regions
    
def coord_alignment(regions,top_flag):
    region_del_index = []
    for region_idx,region in enumerate(regions):
        if 'regions' in region.keys():
            if 'class' in region.keys() and region['class'] in ["PARA","HEADER","FOOTER"]:
                line_del_index = []
                for line_idx,line in enumerate(region['regions']):
                    if 'regions' in line.keys():
                        line_t = keys.get_top(line); line_h = keys.get_height(line); line_b = keys.get_bottom(line)
                        min_t = sys.maxsize
                        for word_idx, word in enumerate(line['regions']):
                            word_t = keys.get_top(word)
                            if word_t<min_t:
                                min_t = word_t
                        new_top =  int((min_t+line_t)/2)
                        if top_flag==True:
                            line = update_coord(copy.deepcopy(line),new_top,line_t,line_b)
                        if "class" not in line.keys():
                            line['class']="LINE"
                        region['regions'][line_idx] = copy.deepcopy(line)
                    else:
                        line_del_index.append(line_idx)
                
                if len(line_del_index)>0:
                    line_updated = delete_region(region['regions'],line_del_index)
                else:
                    line_updated = region['regions']
                regions[region_idx]['regions'] = copy.deepcopy(line_updated)
            elif 'class' not in region.keys():
                region['class']  = "PARA"   
                regions[region_idx] = copy.deepcopy(region)    
        else:
            region_del_index.append(region_idx)
    if len(region_del_index)>0:
        regions = delete_region(regions,region_del_index)
    return regions
            



def segment_regions(file,words, lines,regions,page_c_words,path,file_properties,idx):
    #regions = segment_regions(page_words,page_lines,page_regions)
    width, height = file_properties.get_pageinfo(0)
    v_list, n_text_regions = region_unifier.region_unifier(idx,file,words,lines,regions,page_c_words,path)
    if "mask_image" in file['config']["OCR"].keys() and file['config']["OCR"]["mask_image"]=="False":
        save_path = "None"
    else:
        start_time = time.time()
        image   = cv2.imread(path)
        image = mask_image_craft(image, v_list, idx, file_properties, width, height)
        extension = path.split('.')[-1]
        save_path = path.split('.')[0]+"_bgimages."+extension
        # image[:] = 255
        cv2.imwrite(save_path,image)
        end_time = time.time()
        execution_time = end_time - start_time
        print(f"Mask Image Logic Execution Time: {execution_time:.2f} seconds")
    if "top_correction" in file['config']["OCR"].keys() and file['config']["OCR"]["top_correction"]=="True":
        v_list = coord_alignment(v_list,False)
        v_list = verify__table_structure(v_list)
        return v_list,save_path
    else:
        v_list = coord_alignment(v_list,False)
        v_list = verify__table_structure(v_list)
        
        return v_list,save_path
    #print("v_lis",v_list)
    #v_list += n_text_regions
    
    #print("v_ln_text_regionsis",len(n_text_regions))
    
def end_point_correction(region, y_margin, x_margin, ymax, xmax):
    x = region["boundingBox"]['vertices'][0]['x']
    y = region["boundingBox"]['vertices'][0]['y']
    w = abs(region["boundingBox"]['vertices'][0]['x'] - region["boundingBox"]['vertices'][1]['x'])
    h = abs(region["boundingBox"]['vertices'][0]['y'] - region["boundingBox"]['vertices'][2]['y'])
    ystart = max(0, y + y_margin)
    yend = min(ymax, y + h - y_margin)
    xstart = max(0, x + x_margin)
    xend = min(xmax, x + w - x_margin)
    return True, int(ystart), int(yend), int(xstart), int(xend)

def mask_table_region(image, region, y_margin, x_margin):
    try:
        region_text = region.get('text', '')  # Get the region text or use an empty string as a default value
        image_height, image_width, _ = image.shape
        # Check if the region text matches any of the specified characters or if it's an empty string
        if region_text in {"(", ")", "/"} or not region_text:
            y_margin = 0
            x_margin = -2
        if region.get('text', '') not in ["|", "।"]:
            flag, row_top, row_bottom, row_left, row_right = end_point_correction(region, y_margin, x_margin, image_height, image_width)
            if flag:
                fill = identify_background_color(image[row_top  : row_bottom  , row_left : row_right ])
                image[row_top:row_bottom, row_left:row_right] = fill
        return image
    except KeyError:
        return image
def remove_noise(img, min_area_ratio=0.001):
    try:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        contours, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        
        total_area = img.shape[0] * img.shape[1]
        min_area = min_area_ratio * total_area
        
        for contour in contours:
            cnt_area = cv2.contourArea(contour)
            
            if cnt_area < min_area:
                x, y, w, h = cv2.boundingRect(contour)
                img[y:y + h, x:x + w] = 255
                
        return img
    except:
        return img
    
def identify_background_color(region, method='average'):
    # Check if the region is not empty
    if region is None or region.size == 0:
        return None

    # Convert the region to three channels (RGB) if it is a single-channel image (grayscale)
    if len(region.shape) == 2:
        region = cv2.cvtColor(region, cv2.COLOR_GRAY2BGR)

    if method == 'average':
        # Calculate the average color of the region
        average_color = np.mean(region, axis=(0, 1))
        background_color = tuple(np.round(average_color).astype(int))
    elif method == 'kmeans':
        # Reshape the region to a 2D array of pixels
        pixels = region.reshape((-1, 3))

        # Convert to float32 for k-means clustering
        pixels = np.float32(pixels)

        # Define criteria and apply k-means
        criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
        k = 2  # You can adjust the number of clusters as per your requirement
        _, labels, centers = cv2.kmeans(pixels, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)

        # Get the most frequent color as the background color
        counts = np.bincount(labels.flatten())
        background_color = tuple(np.round(centers[np.argmax(counts)]).astype(int))
    else:
        raise ValueError("Invalid method. Choose 'average' or 'kmeans'.")

    return background_color

def mask_image_craft(image, page_regions, page_index, file_properties, image_width, image_height, margin=0, fill=255):
    try:
        def process_region(region):
            # Process each region in a separate function
            y_margin, x_margin = 0, 0  # Set your margins here
            flag, row_top, row_bottom, row_left, row_right = end_point_correction(region, y_margin, x_margin, image_height, image_width)
            
            if flag:
                region_image = image[row_top:row_bottom, row_left:row_right]
                fill = identify_background_color(region_image, method='kmeans')
                region_image[:] = fill
                
        with concurrent.futures.ThreadPoolExecutor() as executor:
            # Process regions in parallel
            executor.map(process_region, page_regions)
        
        image = remove_noise(image)
        return image
    except Exception as e:
        print('Service Tesseract Error in masking out image {}'.format(e))
        return image

def mask_image_vision(path, page_regions,page_index,file_properties,image_width,image_height,margin= 0 ,fill=255):
    try:
        image   = cv2.imread(path)
        
        for region in page_regions:
            row_top, row_bottom,row_left,row_right = end_point_correction(region, 2,image_height,image_width)
            if len(image.shape) == 2 :
                image[row_top - margin : row_bottom + margin , row_left - margin: row_right + margin] = fill
            if len(image.shape) == 3 :
                image[row_top - margin: row_bottom + margin, row_left - margin: row_right + margin,:] = fill
            
        if '.jpg' in path:
            save_path = path.split('.jpg')[0]+"_bgimages_"+'.jpg'
        elif '.png' in path:
            save_path = path.split('.png')[0]+"_bgimages_"+'.png'
        else:
            save_path = path.split('.')[0]+"_bgimages_"+'.jpg'

        cv2.imwrite(save_path,image)
        return save_path
    except Exception as e :
        print('Service Tesseract Error in masking out image {}'.format(e))
        return None
