import config
import copy
import time
import multiprocessing
import cv2,os
import copy
from multiprocessing import Queue
from src.utilities.tesseract.helper import tess_eval,add_lines_to_tess_queue
from src.utilities.tesseract.utils import  crop_region,get_tess_text,adjust_crop_coord
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
import src.utilities.app_context as app_context
from multiprocessing import Pool

#tessract_queue = Queue()
#file_writer_queue = Queue()


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
                line_text= tess_eval(line_data)
                file_writer_queue.put(line_text)
            else:
                file_writer_queue.put("")

        except Exception as e:
            file_writer_queue.put("")
            log_exception("Error in tesseract multiprocesing ",
                          app_context.application_context, e)


#start_tess_ocr()
def get_queue_lines():
    page_lines = []
    while file_writer_queue.qsize() > 0:
        line_text = file_writer_queue.get()
        if len(line_text) > 0:
            page_lines.append(line_text)
    return page_lines

def multi_processing_tesseract(lines, image, lang):
    try:
        updated_lines_text = []
        for line_idx, tmp_line in enumerate(lines):
            if config.MULTIPROCESS:
                add_lines_to_tess_queue([tmp_line], tessract_queue, lang, image)
            if config.MULTIPROCESS == False and tmp_line is not None and len(tmp_line) > 0:
                vertices = tmp_line['boundingBox']['vertices']
                left = vertices[0]['x'];  top = vertices[0]['y']
                adjusted_box,c_x,c_y = adjust_crop_coord(tmp_line)
                image_crop = crop_region(adjusted_box,image)
                if image_crop is not None and image_crop.shape[1] >3 and image_crop.shape[0] > 3:
                    line_text  = get_tess_text(image_crop,lang,left,top,c_x,c_y)
                    updated_lines_text.append(line_text)

        if config.MULTIPROCESS:
            while file_writer_queue.qsize() < len(lines):
                time.sleep(0.5)
                pass

            updated_lines_text = get_queue_lines()
        return updated_lines_text
    except Exception as e:
        log_exception("Error in tesseract ocr",
                      app_context.application_context, e)
        return lines
