import config
import copy
import time
import multiprocessing
import cv2
import uuid
import shutil
import os
import copy
from multiprocessing import Queue
from src.utilities.tesseract.helper import tess_eval,add_lines_to_tess_queue
from src.utilities.tesseract.utils import  frequent_height,scale_coords,crop_region,get_tess_text,page_lang_detection,adjust_crop_coord
from src.utilities.tesseract.dynamic_adjustment import coord_adjustment
from src.services.horizontal_merging import horzontal_merging
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from src.utilities.region_operations import collate_regions
import src.utilities.app_context as app_context
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
import requests
from collections import Counter
from src.utilities.indic_hw_ocr.new_infer import BaseHTR


tessract_queue = Queue()
file_writer_queue = Queue()


def start_tess_ocr(workers=config.BATCH_SIZE):
    process = []
    for w in range(workers):
        process.append(multiprocessing.Process(target=tesseract_ocr))
        process[-1].start()


def tesseract_ocr():
    while True:
        try:
            line_data = tessract_queue.get(block=True)
            if len(line_data) > 0:
                line_stats, rgn_idx, line_idx = tess_eval(line_data)
                file_writer_queue.put([line_stats, rgn_idx, line_idx])
            else:
                file_writer_queue.put([])

        except Exception as e:
            file_writer_queue.put([])
            log_exception("Error in tesseract multiprocesing ",
                          app_context.application_context, e)


start_tess_ocr()


def get_queue_words():
    page_words = []
    while file_writer_queue.qsize() > 0:
        line_info = file_writer_queue.get()
        if len(line_info) > 0:
            page_words.append(line_info)
    return page_words


def collate_words(page_regions, page_words):
    for word_idx, word_info in enumerate(page_words):
        word, rgn_idx, line_idx = word_info
        page_regions[rgn_idx]['regions'][line_idx]['regions'] = copy.deepcopy(
            word)
    return page_regions


def get_mode_height(page_regions):
    page_lines = []
    if len(page_regions) > 0:
        for rgn_idx, region in enumerate(page_regions):
            if region != None and len(region) > 0 and 'regions' in region.keys():
                for line_idx, line in enumerate(region['regions']):
                    page_lines.append(line)

    mode_height = frequent_height(page_lines)
    return mode_height


def table_ocr(page_regions, region, lang, img, mode_height, rgn_idx, lang_detected):

    for cell_idx, cell in enumerate(copy.deepcopy(region['regions'])):
        page_regions[rgn_idx]['regions'][cell_idx]['regions'] = []
        if "LINES" in cell.keys() or cell['class'] == "CELL_TEXT":
            if cell['class'] == "CELL_TEXT":
                tmp_cell = cell
                cell['LINES'] = [tmp_cell]
            cell_words = []
            for line_idx, line in enumerate(cell['LINES']):
                tmp_line = [line]
                # if len(tmp_line) > 0:
                #     total_lines+=1
                # if config.MULTIPROCESS:
                #    pass
                    #add_lines_to_tess_queue(tmp_line,tessract_queue,lang,img,mode_height,rgn_idx,cell_idx,line['class'],int(region['boundingBox']['vertices'][0]['x']),int(region['boundingBox']['vertices'][1]['x']), lang_detected)
                # if config.MULTIPROCESS==False and line is not None and len(tmp_line)>0:
                if line is not None and len(tmp_line) > 0:
                    # pass
                    vertices = tmp_line[0]['boundingBox']['vertices']
                    left = vertices[0]['x'];  top = vertices[0]['y']
                    adjusted_box,c_x,c_y = adjust_crop_coord(tmp_line[0],"CELL",int(left),int(tmp_line[0]['boundingBox']['vertices'][1]['x']))
                    image_crop = crop_region(adjusted_box,img)
                    if image_crop is not None and image_crop.shape[1] >3 and image_crop.shape[0] > 3:
                        if config.HANDWRITTEN_OCR:
                            processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten")
                            model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-handwritten")
                            pixel_values = processor(image_crop, return_tensors="pt").pixel_values
                            generated_ids = model.generate(pixel_values)
                            words = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]       
                        else:
                            words  = get_tess_text(image_crop,lang,mode_height,left,top,"LINE",c_x,c_y,lang_detected)
                        cell_words.extend(words)
            page_regions[rgn_idx]['regions'][cell_idx]['regions'] = cell_words
        else:
            # pass
            page_regions[rgn_idx]['regions'][cell_idx]['regions'] = cell
    return page_regions


def check_horizontal_merging(words,cls_name,mode_height,vertices,line):
    line_height = abs(vertices[0]['y']-vertices[3]['y'])
    tmp_words = copy.deepcopy(words)
    if config.HORIZONTAL_MERGING and line_height>mode_height*1.2 and cls_name not in ['CELL','CELL_TEXT'] and len(words)>0:
        h_lines =  horzontal_merging(tmp_words)
        if len(h_lines)>1:
            line_list    = collate_regions(copy.deepcopy(h_lines), copy.deepcopy(words),child_class='WORD',add_font=False)
        elif len(h_lines)==1:
            line_list = copy.deepcopy([line])
            line_list[0]['regions']= copy.deepcopy(words)
        else:
            line_list = copy.deepcopy(words)
        return line_list
    elif len(words)==0:
        line['regions'] = copy.deepcopy([line])
        line['regions'][0]['class'] = "WORD"
        return [line]
    else:
        line['regions'] = copy.deepcopy(words)
        return [line]

def multi_processing_tesseract(page_regions, image_path, lang, width, height):
    try:
        img = cv2.imread(image_path)
        mode_height = get_mode_height(page_regions)
        initialize_ocr_models = False  # Flag variable
        if config.HANDWRITTEN_OCR and lang == 'en':
            initialize_ocr_models = True
            lang_detected = config.LANG_MAPPING['en'][0]
            processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten")
            model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-handwritten")
        elif config.HANDWRITTEN_OCR:
            lang_detected = config.LANG_MAPPING[lang][0]
        else:
            lang_detected = page_lang_detection(image_path,lang)
        #lang_detected = config.LANG_MAPPING[lang][0]

        if len(page_regions) > 0:
            total_lines = 0
            first_vertex_y = None
            first_vertex_x = None
            trocr_text = None
            dynamic_first_vertex_x = page_regions[0]['regions'][0]['boundingBox']['vertices'][0]['x']
            for rgn_idx, region in enumerate(page_regions):
                if region != None and 'regions' in region.keys():
                    if region['class'] == "TABLE":
                        page_regions = table_ocr(
                            page_regions, region, lang, img, mode_height, rgn_idx, lang_detected)                      
                    else:
                        updated_lines = []
                        first_vertex_y = None
                        # Add this code to clear the 'crops/' folder before the loop
                        crops_folder = 'crops/'
                        shutil.rmtree(crops_folder, ignore_errors=True)  # Remove the 'crops/' folder and its contents
                        for line_idx, line in enumerate(region['regions']):
                            dynamic_first_vertex_y = line['boundingBox']['vertices'][0]['y']
                            tmp_line = [line]
                            if config.IS_DYNAMIC and 'class' in line.keys():
                                tmp_line = coord_adjustment(
                                    image_path, tmp_line)
                            if len(tmp_line) > 0:
                                total_lines += 1
                            if config.MULTIPROCESS:
                                add_lines_to_tess_queue(tmp_line, tessract_queue, lang, img, mode_height, rgn_idx, line_idx, line['class'], int(
                                    region['boundingBox']['vertices'][0]['x']), int(region['boundingBox']['vertices'][1]['x']), lang_detected)
                            if config.MULTIPROCESS == False and line is not None and len(tmp_line) > 0:
                                vertices = tmp_line[0]['boundingBox']['vertices']
                                left = vertices[0]['x'];  top = vertices[0]['y']
                                adjusted_box,c_x,c_y = adjust_crop_coord(tmp_line[0],line['class'],int(region['boundingBox']['vertices'][0]['x']),int(region['boundingBox']['vertices'][1]['x']))
                                image_crop = crop_region(adjusted_box,img,initialize_ocr_models)
                                
                                if image_crop is not None and image_crop.shape[1] >3 and image_crop.shape[0] > 3:
                                    # Create a new folder
                                    new_folder_path = 'crops'
                                    os.makedirs(new_folder_path, exist_ok=True)
                                    # Save the image in the new folder
                                    # unique_id = str(uuid.uuid4())[:8] 
                                    image_path = os.path.join(new_folder_path, f'{rgn_idx}_{line_idx}.jpg')
                                    cv2.imwrite(image_path, image_crop)
                                    if initialize_ocr_models: 
                                        pixel_values = processor(image_crop, return_tensors="pt").pixel_values
                                        generated_ids = model.generate(pixel_values)
                                        trocr_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
                                    elif config.HANDWRITTEN_OCR:
                                        alphabet = f'{lang_detected}_lexicon.txt'

                                        pretrained = f'./src/utilities/indic_hw_ocr/models/{lang_detected}_indic_pretrained_best_wer.pth'
                                        out_dir = f'./src/utilities/indic_hw_ocr/{lang_detected}'
                                        language = {lang_detected}

                                        test_root = 'crops/'

                                        decoded_preds = BaseHTR.run_handwritten_ocr(test_root, alphabet, pretrained, out_dir, language)
                                        # print(decoded_preds)
                                        
                                    words  = get_tess_text(image_crop,lang,mode_height,left,top,line['class'],c_x,c_y,lang_detected)
                                    h_lines = check_horizontal_merging(words,line['class'],mode_height,vertices,line)
                                    updated_lines.extend(h_lines)

                                    # Split the text variable by space
                                    if config.HANDWRITTEN_OCR:
                                        if trocr_text is None:
                                            split_text = ''.join(decoded_preds)   
                                        else: split_text = trocr_text.split()
                                        
                                        # Replace the values of ['text'] in the JSON data sequentially
                                        index = 0
                                        for idx, entry in enumerate(updated_lines):
                                            # entries = entry.get('regions', [])
                                            # if first_vertex_y is None:
                                            # if idx < len(entries):
                                            # first_vertex_y = dynamic_first_vertex_y
                                            for no, region in enumerate(entry['regions']):
                                                # Check if index is greater than or equal to len(split_text)
                                                if trocr_text is None and index > 0:
                                                    # If so, remove the current region and break out of the loop
                                                    entry['regions'].remove(region)
                                                    break
                                                elif index >= len(split_text):
                                                    entry['regions'].remove(region)
                                                # # Use the words sequentially, and loop back to the beginning if needed
                                                if trocr_text is not None: region['text'] = split_text[index % len(split_text)]
                                                else: region['text'] = split_text
                                                if trocr_text is not None and no == 0:
                                                    region['boundingBox']['vertices'][0]['x'] = dynamic_first_vertex_x
                                                    region['boundingBox']['vertices'][3]['x'] = dynamic_first_vertex_x
                                                # # Skip regions with no boundingBox or with fewer than 2 vertices
                                                # if 'boundingBox' not in region or 'vertices' not in region['boundingBox'] or len(region['boundingBox']['vertices']) < 2:
                                                #     continue
                                                # Your existing code for updating Y-coordinates
                                                index += 1
                                            entry['boundingBox']['vertices'][0]['x'] = dynamic_first_vertex_x
                                            entry['boundingBox']['vertices'][3]['x'] = dynamic_first_vertex_x
                                            updated_lines[idx]['boundingBox']['vertices'][0]['x'] = dynamic_first_vertex_x
                                            updated_lines[idx]['boundingBox']['vertices'][3]['x'] = dynamic_first_vertex_x
                                            # entry['boundingBox']['vertices'][0]['x'] = dynamic_first_vertex_x
                                            # entry['boundingBox']['vertices'][3]['x'] = dynamic_first_vertex_x
                                            # Update the Y-coordinate of all vertices to be the same as the first vertex
                                            for vertex in region['boundingBox']['vertices']:
                                                #Check the difference between already stored and dynamic first_vertex_y
                                                if first_vertex_y is not None and abs(dynamic_first_vertex_y - first_vertex_y) < 50:
                                                    vertex['y'] = first_vertex_y
                                                else:
                                                    # Assign the dynamic value if the difference is greater than or equal to 100
                                                    vertex['y'] = dynamic_first_vertex_y
                                            for vertex in entry['boundingBox']['vertices']:
                                                #Check the difference between already stored and dynamic first_vertex_y
                                                if first_vertex_y is not None and abs(dynamic_first_vertex_y - first_vertex_y) < 50:
                                                    vertex['y'] = first_vertex_y
                                                else:
                                                    # Assign the dynamic value if the difference is greater than or equal to 100
                                                    vertex['y'] = dynamic_first_vertex_y
                                                    # Update the already stored first_vertex_y if the dynamic value is assigned
                                                    first_vertex_y  = dynamic_first_vertex_y
                                                
                                        # Update the already stored first_vertex_y if the dynamic value is assigned
                                        # first_vertex_y  = dynamic_first_vertex_y
                                page_regions[rgn_idx]['regions'] = copy.deepcopy(updated_lines)
                                #page_regions[rgn_idx]['regions'][line_idx]['regions'] = words

            if config.MULTIPROCESS:
                while file_writer_queue.qsize() < total_lines:
                    time.sleep(0.5)
                    
                    pass

                page_words = get_queue_words()
                page_regions = collate_words(page_regions, page_words)

            return page_regions
        else:
            return page_regions
    except Exception as e:
        log_exception("Error in tesseract ocr",
                      app_context.application_context, e)
        return page_regions
