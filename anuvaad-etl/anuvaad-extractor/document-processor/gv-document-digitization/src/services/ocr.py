import uuid, os, io
import config
import sys
from google.cloud import vision
import cv2
from src.utilities.model_response import set_bg_image
import src.utilities.app_context as app_context
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_info
from src.utilities.tilt_alignment import Orientation
import config




client = vision.ImageAnnotatorClient()
breaks = vision.enums.TextAnnotation.DetectedBreak.BreakType

def get_text(path,page_dict,font_info):
    #path = "/home/naresh/anuvaad/anuvaad-etl/anuvaad-extractor/document-processor/ocr/gv-document-digitization/"+path
    
    try :


        if config.CLEAN_BACKGROUND :
            img = cv2.imread(path)
            img[175 < img ] = 255
            masked_path = path.split('.jpg')[0]+"_watermarks.jpg"
            cv2.imwrite(masked_path,img)
        else:
            masked_path = path

        with io.open(masked_path, 'rb') as image_file:
            content = image_file.read()
        image = vision.types.Image(content=content)
        response = client.document_text_detection(image=image)
        page_dict,page_lines = get_document_bounds(response.full_text_annotation,page_dict,font_info)
        return page_dict,page_lines

    except Exception as e:
        log_exception("Error occured during text_extraction  {}".format(e) ,  app_context.application_context, e)
        return None, None



def text_extraction(file_properties,image_paths,file):
    try:
        page_res = []

        for idx,image_path in enumerate(image_paths):
            width, height = file_properties.get_pageinfo(idx, image_paths[idx])
            font_info = file_properties.get_fontinfo()
            page_dict = {"identifier": str(uuid.uuid4()),"resolution": config.EXRACTION_RESOLUTION ,"path":image_path,"boundingBox":{"vertices":[]}}
            page_dict["boundingBox"]["vertices"]=  [{"x":0,"y":0},{"x":width,"y":0},{"x":width,"y":height},{"x":0,"y":height}]
            page_dict['page_no'] = int(idx)
            if config.ALIGN:
                page_output = Orientation(image_path,get_text).re_orient(page_dict,font_info)
            else:
                page_output,_ = get_text(image_path,page_dict,font_info)

            if config.mask_img == True:
                save_path = mask_image(image_path, page_output, idx, file_properties, width, height)
                page_output = set_bg_image(page_output, save_path, idx)
            page_res.append(page_output)
            
        file['pages'] = page_res
        return file
    except Exception as e:
        log_exception("Error occured during google vision text_extraction",  app_context.application_context, e)
        return None

def extract_line(paragraph):
    line_coord = []
    line_text  = []
    words_lis  = []
    line_words = []
    line = ""
    top_left_x    = sys.maxsize; top_left_y    = sys.maxsize; top_right_x = -1; top_right_y    = sys.maxsize
    bottom_left_x = sys.maxsize; bottom_left_y = -1;      bottom_right_x  = -1; bottom_right_y =-1
    w_flag=False
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
                w_flag= True
                line_text.append(line)
                lines_coord.append({'x':top_left_x,'y':top_left_y});lines_coord.append({'x':top_right_x,'y':top_right_y})
                lines_coord.append({'x':bottom_right_x,'y':bottom_right_y});lines_coord.append({'x':bottom_left_x,'y':bottom_left_y})
                line_coord.append(lines_coord)
                line = ''
                top_left_x    = sys.maxsize ;top_left_y   = sys.maxsize; top_right_x = -1;top_right_y    = sys.maxsize
                bottom_left_x = sys.maxsize;bottom_left_y = -1  ; bottom_right_x     = -1;bottom_right_y =-1
            if symbol.property.detected_break.type == breaks.LINE_BREAK:
                lines_coord = []
                w_flag= True
                lines_coord.append({'x':top_left_x,'y':top_left_y});lines_coord.append({'x':top_right_x,'y':top_right_y})
                lines_coord.append({'x':bottom_right_x,'y':bottom_right_y});lines_coord.append({'x':bottom_left_x,'y':bottom_left_y})
                line_coord.append(lines_coord)
                line_text.append(line)
                line = ''
                top_left_x    = sys.maxsize ;top_left_y   = sys.maxsize; top_right_x = -1;top_right_y    = sys.maxsize
                bottom_left_x = sys.maxsize;bottom_left_y = -1  ; bottom_right_x     = -1;bottom_right_y = -1
        if w_flag==False:
            line_words.append(word)
        else:
            w_flag=False
            line_words.append(word)
            words_lis.append(line_words)
            line_words = []

    return line_coord, line_text,words_lis

def add_line(line_coord, line_text,words_lis,page,font_info):
    lines = []
    wors  = []
    for coord, text,words in zip(line_coord, line_text,words_lis):
        line_region = {"identifier": str(uuid.uuid4()), "boundingBox":{"vertices":[]}}
        line_region["boundingBox"]["vertices"] = coord
        #line_region["text"] = text
        line_region["class"] = 'LINE'
        word_region = get_words(words,page,font_info)
        line_region["regions"] = word_region
        wors.extend(word_region)
        #print(word_region)

        lines.append(line_region)
    return lines,wors
def get_symbol(words,page):
    symbols = []
    for symbol in words.symbols:
        symbol_region = {"identifier": str(uuid.uuid4()), "boundingBox":{"vertices":[]}}
        symbol_vertices = []
        symbol_vertices.append({"x": symbol.bounding_box.vertices[0].x, "y": symbol.bounding_box.vertices[0].y})
        symbol_vertices.append({"x": symbol.bounding_box.vertices[1].x, "y": symbol.bounding_box.vertices[1].y})
        symbol_vertices.append({"x": symbol.bounding_box.vertices[2].x, "y": symbol.bounding_box.vertices[2].y})
        symbol_vertices.append({"x": symbol.bounding_box.vertices[3].x, "y": symbol.bounding_box.vertices[3].y})
        symbol_region["boundingBox"]["vertices"] = symbol_vertices
        text = symbol.text
        confidence = symbol.confidence
        symbol_region["text"] = text
        symbol_region["confidence"] = confidence
        symbol_region["class"] = 'SYMBOL'
        
        if len(symbol.property.detected_languages)!=0:
            symbol_region["language"] = symbol.property.detected_languages[0].language_code
        else:
            if len(page.property.detected_languages)!=0:
                symbol_region["language"] = page.property.detected_languages[0].language_code
        symbols.append(symbol_region)
    return symbols

def avg_word_sep(words_lis):
        total_words = len(words_lis)
        height      = 0
        for word in words_lis:
            height = height + abs(word.bounding_box.vertices[0].y-word.bounding_box.vertices[2].y)

        return  int(height/total_words) 

def get_words(words_lis,page,font_info):
    word_regions = []
    avg_height   = avg_word_sep(words_lis)
    #print(words_lis)
    for word in words_lis:
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
        word_region["text"]  = word_text
        word_region["class"] = 'WORD'
        font_info['size']    = abs(word.bounding_box.vertices[0].y-word.bounding_box.vertices[2].y)
        font_info['avg_size']= avg_height
        word_region["font"]  = font_info
        word_region["confidence"] = word.confidence
        if len(word.symbols[0].property.detected_languages)!=0:
            word_region["language"] = word.symbols[0].property.detected_languages[0].language_code
        else:
            if len(page.property.detected_languages)!=0:
                word_region["language"] = page.property.detected_languages[0].language_code
        symbols = get_symbol(word,page)
        word_region['regions'] = symbols
        word_regions.append(word_region)
    return word_regions
    


def get_document_bounds(response,page_dict,font_info):
    regions  =[]
    gv_lines = []
    for i,page in enumerate(response.pages):
        for block in page.blocks:
            block_region = {"identifier": str(uuid.uuid4()), "boundingBox":{"vertices":[]}, "class":'PARA'}
            block_vertices = []
            block_vertices.append({"x": block.bounding_box.vertices[0].x, "y": block.bounding_box.vertices[0].y})
            block_vertices.append({"x": block.bounding_box.vertices[1].x, "y": block.bounding_box.vertices[1].y})
            block_vertices.append({"x": block.bounding_box.vertices[2].x, "y": block.bounding_box.vertices[2].y})
            block_vertices.append({"x": block.bounding_box.vertices[3].x, "y": block.bounding_box.vertices[3].y})
            block_region["boundingBox"]["vertices"] = block_vertices
            block_lines = []
            for paragraph in block.paragraphs:
                line_coord, line_text,words_lis = extract_line(paragraph)
                lines,words = add_line(line_coord, line_text,words_lis,page,font_info)
                block_lines.extend(lines)
                gv_lines.extend(words)

            
            block_region['regions'] = block_lines


            regions.append(block_region)
    page_dict['regions'] = regions

    return page_dict,gv_lines


    
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


def mask_image(path, page_dict,page_index,file_properties,image_width,image_height,margin= 0 ,fill=255):
    try:
        image   = cv2.imread(path)
        #image    = cv2.imread("/home/naresh/anuvaad/anuvaad-etl/anuvaad-extractor/document-processor/ocr/gv-document-digitization/"+path)
        page_regions = page_dict['regions']
        for region_idx, page_region in enumerate(page_regions):
            if 'class' in page_region.keys():
                region_class = page_region['class']
                if region_class not in ["IMAGE","SEPARATOR"]:
                    region_lines = page_region['regions']
                    if region_lines!=None:
                        for line_index, line in enumerate(region_lines):
                            region_words = line['regions']
                            if region_words!=None:
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

        #save_path = "/home/naresh/anuvaad/anuvaad-etl/anuvaad-extractor/document-processor/ocr/gv-document-digitization/"+save_path
        cv2.imwrite(save_path,image)
        return save_path
    except Exception as e :
        print('Service google vision document digitization Error in masking out image {}'.format(e))
        return None


