from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
import src.utilities.app_context as app_context
import config,time
import json
from src.utilities.request_parse import get_files, File,get_json
from src.services.segment import horzontal_merging, break_block
from src.utilities.region_operations import merge_text
from src.utilities.bold_detect import detect as font_properties
from src.services.region_unifier import Region_Unifier

region_unifier = Region_Unifier()

def segment_regions(words, lines,regions):

    v_list, n_text_regions = region_unifier.region_unifier(words,lines,regions)
    p_list = []
    for v_block in v_list:
        if  v_block['children'] != None and  len(v_block['children']) > 1 :
            #p_list+= break_block(v_block)
            p_list +=[v_block]
        else :
            p_list +=  [v_block]
    p_list += n_text_regions
    return p_list



def get_segmented_regions(app_context,base_dir) :
    try:
        files       = get_files(app_context.application_context)
        output      = []
        for index,file in enumerate(files):
            file   = get_json(base_dir, file['file']['name'])
            file_properties = File(file)
            pages = file_properties.get_pages()
            page_counts = len(pages)
            start_time = time.time()
            for page_index in range(page_counts):
                print('processing for page   :  ', page_index)
                # page_lines   =  file_properties.get_lines(page_index)
                # page_regions =  file_properties.get_regions(page_index)
                # page_words   =  file_properties.get_words(page_index)
                font_meta    = font_properties(file_properties.get_page(page_index))
                #font_meta  = []
                #page_regions =  region_unifier.region_unifier(page_lines,page_regions)
                #file_properties.set_regions(page_index, segment_regions(page_words,page_lines,page_regions))
                file_properties.set_font_properties(page_index,font_meta)

            output.append(file_properties.get_file())
            output[index]['status']= {'message':"block-segmenter successful"}
            end_time            = time.time()
            extraction_time     = (end_time - start_time)/page_counts
            log_info('block segmentation per page completed in {}'.format(extraction_time), app_context.application_context)
        app_context.application_context["outputs"] =output
        log_info("successfully completed block segmentation", None)
    except Exception as e:
        log_exception("Error occured during block segmentation ",  app_context.application_context, e)
        return None

    return app_context.application_context


def BlockSegmenter(app_context,base_dir= config.BASE_DIR):

    log_debug('block segmentation process starting {}'.format(app_context.application_context),
              app_context.application_context)
    try:

        response = get_segmented_regions(app_context,base_dir)
        
        if response!=None:
            return {
                    'code': 200,
                    'message': 'request completed',
                    'rsp': response
                    }
        else:
            return {
                'code': 400,
                'message': 'Error occured during block segmentation',
                'rsp': None
                }
    except Exception as e:
        log_exception("Error occured during block segmentation ", app_context.application_context, e)
        return {
            'code': 400,
            'message': 'Error occured during layout detection ',
            'rsp': None
        }
