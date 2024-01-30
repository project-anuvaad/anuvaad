import uuid, os, io, sys, config, cv2, copy
import numpy as np
from src.utilities.region_operations import  set_font_info
from src.services.region_unifier import Region_Unifier
from src.utilities.model_response import set_bg_image
from src.utilities.request_parse import MapKeys,UpdateKeys
from src.utilities.tesseract.dynamic_adjustment import coord_adjustment
from src.services.remove_watermark import clean_image
from src.utilities.tesseract.multiprocess import  multi_processing_tesseract
from anuvaad_auditor.loghandler import log_info
import concurrent.futures
from anuvaad_auditor.loghandler import log_exception

region_unifier = Region_Unifier()
keys = MapKeys()
update_key = UpdateKeys()

def get_text(lang,page_c_lines,file,path,page_regions,page_c_words,font_info,file_properties,idx):
    
    #path = config.BASE_DIR+path
    if config.WATERMARK_REMOVE:
        img = cv2.imread(path)
        # img[175 < img ] = 255
        img = clean_image(img)
        path = path.split('.jpg')[0]+"_watermark-removed.jpg"
        cv2.imwrite(path,img)

    page_output,page_words,save_path = get_document_bounds(lang,path,page_c_lines,file,page_regions,page_c_words,font_info,file_properties,idx)
    return page_output,page_words,save_path

def text_extraction(file_properties,image_paths,file):
    page_res = []
    width, height = file_properties.get_pageinfo(0)
    lang = file_properties.get_language()
    for idx,image_path in enumerate(image_paths):
        font_info = file_properties.get_fontinfo(idx)
        page_id   = str(uuid.uuid4())
        page_dict = {"identifier": page_id,"resolution": config.EXRACTION_RESOLUTION }
        page_regions =  file_properties.get_regions(idx)
        page_c_words = file_properties.get_words(idx)
        page_c_lines = file_properties.get_lines(idx)
        page_output,page_words,save_path = get_text(lang,page_c_lines,file,image_path,page_regions,page_c_words,font_info,file_properties,idx)
        
        #save_path = mask_image_vision(image_path, page_words, idx, file_properties, width, height)
        page_output = set_bg_image(page_output, save_path, idx,file)
        file_properties.set_regions(idx,page_output)
        file_properties.delete_regions(idx)
        file_properties.pop_fontinfo(idx)

    return file_properties.get_file()

def get_document_bounds(lang,path,page_lines,file,page_regions,page_words,font_info,file_properties,idx):
    if len(page_words)>0:
        page_words   = set_font_info(page_words,font_info)
    v_list,save_path = segment_regions(lang,path,file,page_words,page_lines,page_regions,file_properties,idx)

    return v_list,page_words,save_path

def update_coord(line,new_top,line_t,line_b):
    for word_idx, word in enumerate(line['regions']):
        if 'class' not in word.keys():
            word['class'] ='WORD'
        word_t = keys.get_top(word); word_h = keys.get_height(word)
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
    

def segment_regions(lang,path,file,words, lines,regions,file_properties,idx):
    width, height = file_properties.get_pageinfo(0)
    langs = ['gu']
    if lang in langs:
        v_list, n_text_regions = region_unifier.region_unifier(idx,file,words,regions,path)
    else: v_list, n_text_regions = region_unifier.region_unifier(idx,file,lines,regions,path)
    log_info("tesseract ocr started", None)
    #if idx==2:
    v_list = multi_processing_tesseract(v_list,path,lang,width, height)
    log_info("tesseract ocr completed", None)
    image   = cv2.imread(path)
    image = mask_image_craft(image, v_list, idx, file_properties, width, height)
    extension = path.split('.')[-1]
    save_path = path.split('.')[0]+"_bgimages."+extension
    # image[:] = 255
    cv2.imwrite(save_path,image)
   # save_path =None
    if "top_correction" in file['config']["OCR"].keys() and file['config']["OCR"]["top_correction"]=="True":
        v_list = verify__table_structure(v_list)
        return v_list,save_path
    else:
        v_list = verify__table_structure(v_list)
    return v_list,save_path

def end_point_correction(region, y_margin,x_margin, ymax,xmax):
    # check if after adding margin the endopints are still inside the image
    x = region["boundingBox"]['vertices'][0]['x']; y = region["boundingBox"]['vertices'][0]['y']
    w = abs(region["boundingBox"]['vertices'][0]['x']-region["boundingBox"]['vertices'][1]['x'])
    h = abs(region["boundingBox"]['vertices'][0]['y']-region["boundingBox"]['vertices'][2]['y'])
    if abs(h-ymax)<50:
        return False,False,False,False,False
    ystart = y + y_margin
    yend = y + h - y_margin
    xstart = x + x_margin
    xend = x + w - x_margin
    return True,int(ystart), int(yend), int(xstart), int(xend)
    
def mask_table_region(image,region,image_height,image_width,y_margin,x_margin,fill):
    try:
        if ('text' in region.keys() and (region['text'] in ["(", ")", "/"] or len(region['text'])==0)):
            y_margin=0; x_margin=-2
        if 'text' in region.keys() and region['text'] !="|" and region['text'] !="।":
            flag,row_top, row_bottom,row_left,row_right = end_point_correction(region, y_margin,x_margin,image_height,image_width)
            if flag:
                if len(image.shape) == 2 :
                    image[row_top  : row_bottom  , row_left : row_right ] = fill
                if len(image.shape) == 3 :
                    image[row_top : row_bottom , row_left : row_right ,:] = fill
        return image
    except:
        return image
        
def remove_noise(img):
    try:
        res = img.copy()
        kernel = np.ones((10,10), np.uint8)
        img = cv2.erode(img, kernel, iterations=1)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(gray,0,255,cv2.THRESH_BINARY_INV+cv2.THRESH_OTSU)
        contours, hierarchy = cv2.findContours(thresh,cv2.RETR_TREE,cv2.CHAIN_APPROX_NONE)
        for i in contours:
            cnt = cv2.contourArea(i)
            if cnt < 1500:
                x,y,w,h = cv2.boundingRect(i)
                cv2.rectangle(res,(x-1,y-1),(x+w+1,y+h+1),(255,255,255),-1)
        return res
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
            y_margin, x_margin = 8, 8  # Set your margins here
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