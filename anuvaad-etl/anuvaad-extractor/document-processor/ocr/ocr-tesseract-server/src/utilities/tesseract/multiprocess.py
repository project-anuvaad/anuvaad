import config
import multiprocessing,cv2,copy
from multiprocessing import Queue
from src.utilities.tesseract.helper import tess_eval,add_lines_to_tess_queue
from src.utilities.tesseract.utils import  frequent_height,scale_coords
from src.utilities.tesseract.dynamic_adjustment import coord_adjustment
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
import src.utilities.app_context as app_context

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
            log_exception("Error in tesseract ocr",  app_context.application_context, e)
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

    img = cv2.imread(image_path)
    mode_height = get_mode_height(page_regions)
    
    start_tess_eval()
    if len(page_regions)>0:
        total_lines=0
        for rgn_idx, region in enumerate(page_regions):
            if region!=None and len(region)>0 and 'regions' in region.keys():
                for line_idx,line in enumerate(region['regions']):
                    total_lines+=1
                    line=[line]
                    if config.IS_DYNAMIC:
                        line = coord_adjustment(image_path,line)
                    
                    add_lines_to_tess_queue(line,tessract_queue,lang,img,mode_height,rgn_idx,line_idx)
        print("tesseract queue size {}".format(tessract_queue.qsize()))
        print("file_writer_queue queue size {}".format(file_writer_queue.qsize()))
        while file_writer_queue.qsize()<total_lines:
            print("processing ------")
            pass
        print("get queue words started ------")
        page_words = get_queue_words()
        page_regions = collate_words(page_regions,page_words)
        print("after tesseract queue size {}".format(tessract_queue.qsize()))
        print("after file_writer_queue queue size {}".format(file_writer_queue.qsize()))
        
        return page_regions
    else:
        return page_regions

