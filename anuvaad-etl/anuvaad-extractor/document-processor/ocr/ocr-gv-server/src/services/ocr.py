import uuid, os, io
import config
import sys
from google.cloud import vision
from src.services.segment import horzontal_merging, break_block
from src.utilities.region_operations import merge_text, set_font_info
from src.services.region_unifier import Region_Unifier
import cv2
from src.utilities.model_response import set_bg_image




region_unifier = Region_Unifier()

client = vision.ImageAnnotatorClient()
breaks = vision.enums.TextAnnotation.DetectedBreak.BreakType

def get_text(path,page_dict,page_regions,page_c_words,font_info):
    
    #path = config.BASE_DIR+path
    img = cv2.imread(path)
    
    #img[175 < img ] = 255
    #masked_path = path.split('.jpg')[0]+"_watermarks.jpg"
    #cv2.imwrite(masked_path,img)
    with io.open(path, 'rb') as image_file:
        content = image_file.read()
    image = vision.types.Image(content=content)
    response = client.document_text_detection(image=image)
    page_output,page_words = get_document_bounds(response.full_text_annotation,page_dict,page_regions,page_c_words,font_info,path)
    return page_output,page_words


def text_extraction(file_properties,image_paths,file):
    page_res = []
    width, height = file_properties.get_pageinfo(0)
    for idx,image_path in enumerate(image_paths):

        
        font_info = file_properties.get_fontinfo(idx)
        page_dict = {"identifier": str(uuid.uuid4()),"resolution": config.EXRACTION_RESOLUTION }
        page_regions =  file_properties.get_regions(idx)
        page_c_words = file_properties.get_words(idx)
        page_output,page_words = get_text(image_path,page_dict,page_regions,page_c_words,font_info)
        save_path = mask_image_craft(image_path, page_output, idx, file_properties, width, height)
        #save_path = mask_image_vision(image_path, page_words, idx, file_properties, width, height)
        page_output = set_bg_image(page_output, save_path, idx,file)
        file_properties.set_regions(idx,page_output)
        file_properties.delete_regions(idx)
        file_properties.pop_fontinfo(idx)


    return file_properties.get_file()

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

def get_document_bounds(response,page_dict,page_regions,page_c_words,font_info,path):
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
                    page_dict["words"].append(word_region)
                    word_text = ''.join([
                        symbol.text for symbol in word.symbols
                    ])
                    print(word_text)
                    word_region["text"] = word_text
                    word_region["conf"] = word.confidence
                    if len(word.symbols[0].property.detected_languages)!=0:
                        word_region["language"] = word.symbols[0].property.detected_languages[0].language_code
                    else:
                        if len(page.property.detected_languages)!=0:
                            word_region["language"] = page.property.detected_languages[0].language_code

    page_lines   =  page_dict["lines"]
    page_words   =  page_dict["words"]

    #add font information to words
    page_words   = set_font_info(page_words,font_info)

    
    v_list = segment_regions(page_words,page_lines,page_regions,page_c_words,path)

    return v_list,page_words



def segment_regions(words, lines,regions,page_c_words,path):
    #regions = segment_regions(page_words,page_lines,page_regions)

    v_list, n_text_regions = region_unifier.region_unifier(words,lines,regions,page_c_words,path)

    #print("v_lis",v_list)
    #v_list += n_text_regions
    
    #print("v_ln_text_regionsis",len(n_text_regions))
    return v_list


    
def end_point_correction(region, margin, ymax,xmax):
    # check if after adding margin the endopints are still inside the image
    x = region["boundingBox"]['vertices'][0]['x']; y = region["boundingBox"]['vertices'][0]['y']
    w = abs(region["boundingBox"]['vertices'][0]['x']-region["boundingBox"]['vertices'][1]['x'])
    h = abs(region["boundingBox"]['vertices'][0]['y']-region["boundingBox"]['vertices'][2]['y'])
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
    return int(ystart), int(yend), int(xstart), int(xend)


def mask_image_craft(path, page_regions,page_index,file_properties,image_width,image_height,margin= 0 ,fill=255):
    try:
        #path = config.BASE_DIR+path
        image   = cv2.imread(path)
        
        for region_idx, page_region in enumerate(page_regions):
            if 'class' in page_region.keys():
                region_class = page_region['class']
                
                if region_class not in ["IMAGE","OTHER","SEPARATOR"]:
                    region_lines = file_properties.get_region_lines(page_index,region_idx,page_region)
                    if region_lines!=None:
                        
                        for line_index, line in enumerate(region_lines):
                            region_words = file_properties.get_region_words(page_index,region_idx,line_index,line)
                            if region_words!=None:
                                #if config.IS_DYNAMIC:
                                #    region_words = coord_adjustment(path, region_words)
                                for region in region_words:
                                    
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