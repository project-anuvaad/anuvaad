import config
import copy
import time
import multiprocessing
import cv2
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
        if "LINES" in cell.keys() or cell['class'] is "CELL_TEXT":
            if cell['class'] is "CELL_TEXT":
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
                        words  = get_tess_text(image_crop,lang,mode_height,left,top,"LINE",c_x,c_y,lang_detected)
                        cell_words.extend(words)
            page_regions[rgn_idx]['regions'][cell_idx]['regions'] = cell_words
        else:
            # pass
            page_regions[rgn_idx]['regions'][cell_idx]['regions'] = cell
    return page_regions


def check_horizontal_merging(words,cls_name,mode_height,vertices,line):
    line_height = abs(vertices[0]['y']-vertices[3]['y'])
    if config.HORIZONTAL_MERGING and line_height>mode_height and cls_name not in ['CELL','CELL_TEXT']:
        h_lines =  horzontal_merging(words)
        if len(h_lines)>0:
            line_list    = collate_regions(copy.deepcopy(h_lines), copy.deepcopy(words),child_class='WORD',add_font=False)
        else:
            line_list = copy.deepcopy(words)
        return line_list
    else:
        line['regions'] = copy.deepcopy(words)
        return [line]

def multi_processing_tesseract(page_regions, image_path, lang, width, height):
    try:
        img = cv2.imread(image_path)
        mode_height = get_mode_height(page_regions)
        lang_detected = page_lang_detection(image_path,lang)
        #lang_detected = config.LANG_MAPPING[lang][0]

        if len(page_regions) > 0:
            total_lines = 0
            for rgn_idx, region in enumerate(page_regions):
                if region != None and 'regions' in region.keys():
                    if region['class'] == "TABLE":
                        page_regions = table_ocr(
                            page_regions, region, lang, img, mode_height, rgn_idx, lang_detected)
                        
                    else:
                        updated_lines = []
                        for line_idx, line in enumerate(region['regions']):
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
                                image_crop = crop_region(adjusted_box,img)
                                if image_crop is not None and image_crop.shape[1] >3 and image_crop.shape[0] > 3:
                                    words  = get_tess_text(image_crop,lang,mode_height,left,top,line['class'],c_x,c_y,lang_detected)
                                    h_lines = check_horizontal_merging(words,line['class'],mode_height,vertices,line)
                                    updated_lines.extend(h_lines)
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
