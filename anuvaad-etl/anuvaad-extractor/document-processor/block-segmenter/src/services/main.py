from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
import src.utilities.app_context as app_context
import config,time
import json
from src.utilities.request_parse import get_files, File,get_json
from src.services.segment import horzontal_merging, break_block
from src.utilities.region_operations import collate_regions, get_ngram, are_hlines
from src.services.region_unifier import Region_Unifier

region_unifier = Region_Unifier()
# save_dir = '/home/naresh/judgement_layout_pubnet/'

# def draw_box(resp,filepath,save_dir,color="green", save=False):
#     image  = Image.open("/home/naresh/anuvaad/anuvaad-etl/anuvaad-extractor/document-processor/word-detector/craft/"+filepath)
#     draw   = ImageDraw.Draw(image)
#     for i in resp['rsp']['outputs'][0]['pages'][page_index]['regions']:
#         draw.rectangle(((i['boundingBox']['vertices'][0]['x'], i['boundingBox']['vertices'][0]['y']), (i['boundingBox']['vertices'][2]['x'],i['boundingBox']['vertices'][2]['y'])), outline=color,width=3)
        
    
#     save_filepath = os.path.join(save_dir, "bbox_layout_"+os.path.basename(filepath))
#     if save:
#         image.save(save_filepath)
    
#     return image
#
# def segment_regions(lines,regions):
#
#
#     #v_list = collate_regions(regions,lines)
#     v_list, n_text_regions = region_unifier(lines,regions)
#     #print("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",v_list[0],"fffffffffffffffffffffffffffffffff")
#     p_list = []
#     for v_block in v_list:
#         #print(v_block,'vvvbbbbb')
#         if len(v_block['children']) > 1 :
#             #v_block['children'] = horzontal_merging(v_block['children'])
#             #p_list +=  break_block(v_block)
#             p_list +=[v_block]
#         else :
#             p_list +=  v_block['children']
#     p_list += n_text_regions
#     return p_list


def segment_regions(lines,regions):

    v_list, n_text_regions = region_unifier.region_unifier(lines,regions)
    p_list = []
    for v_block in v_list:
        if len(v_block['children']) > 1 :
            #p_list +=  break_block(v_block)
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
                page_lines   =  file_properties.get_lines(page_index)
                page_regions =  file_properties.get_regions(page_index)
                page_regions =  region_unifier.region_unifier(page_lines,page_regions)
                file_properties.set_regions(page_index, segment_regions(page_lines,page_regions))
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
        return {
            'code': 200,
            'message': 'request completed',
            'rsp': response
        }
    except Exception as e:
        log_exception("Error occured during block segmentation ", app_context.application_context, e)
        return {
            'code': 400,
            'message': 'Error occured during layout detection ',
            'rsp': None
        }
