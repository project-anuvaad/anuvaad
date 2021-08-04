import config
import multiprocessing,cv2,copy
from multiprocessing import Queue
from src.utilities.tesseract.helper import tess_eval,add_lines_to_tess_queue
from src.utilities.tesseract.utils import  frequent_height,scale_coords,crop_region,get_tess_text
from src.utilities.tesseract.dynamic_adjustment import coord_adjustment
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
import src.utilities.app_context as app_context
from src.utilities.tesseract.utils import page_lang_detection

tessract_queue = Queue()
file_writer_queue = Queue()


def start_tess_eval(workers= config.BATCH_SIZE):
    process = []
    for w in range(workers):
        process.append(multiprocessing.Process(target=tesseract_eval))
        process[-1].start()
        

def tesseract_eval():
    while True:
        try:
            line_data  = tessract_queue.get(block=True)
            if len(line_data)>0:
                line_stats,rgn_idx,line_idx= tess_eval(line_data)
                file_writer_queue.put([line_stats,rgn_idx,line_idx])
            else:
                file_writer_queue.put([])
            
        except Exception as e:
            file_writer_queue.put([])
            log_exception("Error in tesseract multiprocesing ",  app_context.application_context, e)

start_tess_eval()

def get_queue_words():
    page_words=[]
    while file_writer_queue.qsize()>0:
        line_info  = file_writer_queue.get()
        if len(line_info)>0:
            page_words.append(line_info)
    return page_words

def collate_words(page_regions,page_words):    
    for word_idx,word_info in enumerate(page_words):
        word,rgn_idx,line_idx = word_info
        page_regions[rgn_idx]['regions'][line_idx]['regions'] = copy.deepcopy(word)
    return page_regions

def get_mode_height(page_regions):
    page_lines=[]
    if len(page_regions)>0:
        for rgn_idx, region in enumerate(page_regions):
            if region!=None and len(region)>0 and 'regions' in region.keys():
                for line_idx,line in enumerate(region['regions']):
                    page_lines.append(line)
    
    mode_height = frequent_height(page_lines)
    return mode_height

def multi_processing_tesseract(page_regions,image_path,lang,width,height):
    try:
        img = cv2.imread(image_path)
        mode_height = get_mode_height(page_regions)
        lang_detected = page_lang_detection(image_path,lang)
        
        if len(page_regions)>0:
            total_lines=0
            for rgn_idx, region in enumerate(page_regions):
                if region!=None and len(region)>0 and 'regions' in region.keys():
                    for line_idx,line in enumerate(region['regions']):
                        tmp_line=[line]
                        
                        if config.IS_DYNAMIC and 'class' in line.keys() and line['class'] !="CELL":
                            tmp_line = coord_adjustment(image_path,tmp_line)
                        if len(line)>0:
                            total_lines+=1
                        if config.MULTIPROCESS:
                            add_lines_to_tess_queue(tmp_line,tessract_queue,lang,img,mode_height,rgn_idx,line_idx)
                        if config.MULTIPROCESS==False and len(tmp_line)>0:
                            vertices = tmp_line[0]['boundingBox']['vertices']
                            left = vertices[0]['x'];  top = vertices[0]['y']
                            image_crop,c_x,c_y = crop_region(tmp_line[0],img,line['class'])
                            if image_crop is not None and image_crop.shape[1] >3 and image_crop.shape[0] > 3:
                                words  = get_tess_text(image_crop,lang,mode_height,left,top,line['class'],c_x,c_y,lang_detected)
                                page_regions[rgn_idx]['regions'][line_idx]['regions'] = words

            if config.MULTIPROCESS:
                while file_writer_queue.qsize()<total_lines:
                    pass
                page_words = get_queue_words()
                page_regions = collate_words(page_regions,page_words)
            
            return page_regions
        else:
            return page_regions
    except Exception as e:
        log_exception("Error in tesseract ocr",  app_context.application_context, e)
        return page_regions

