from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
import src.utilities.app_context as app_context
#from src.services.get_underline import get_underline
#from src.services.get_tables import get_text_table_line_df, get_text_from_table_cells
import config,time
import json
from src.utilities.primalaynet.infer import PRIMA
from src.utilities.request_parse import get_files, File,get_json

primalaynet = PRIMA()
def extract_table_line_regions(image_path):

    region,mask_image        = get_text_table_line_df(image_path)
    return region,mask_image

def get_coord(bboxs):
    coord =[]
    if len(bboxs)>0:
        for bbox in bboxs:
            temp_box = []
            temp_box.append(bbox["boundingBox"]['vertices'][0]['x'])
            temp_box.append(bbox["boundingBox"]['vertices'][0]['y'])
            temp_box.append(bbox["boundingBox"]['vertices'][2]['x'])
            temp_box.append(bbox["boundingBox"]['vertices'][2]['y'])
            coord.append(temp_box)
    return coord

def get_layout(app_context) :
    try:
        files       = get_files(app_context.application_context)
        #files   = get_json(app_context.application_context)
        #files       = get_files(json_data)        
        file_images = []
        output      = []
        for index,file in enumerate(files):
            file   = get_json(file['file']['name'])[0]
            file_properties = File(file)
            page_paths      = file_properties.get_pages()
            start_time = time.time()
            for idx,page_path in enumerate(page_paths):
                page_lines  = file_properties.get_lines(idx)
                page_words  = file_properties.get_words(idx)
                line_coords = get_coord(page_lines)
                page_path   = '/'.join(page_path.split('/')[-4:])
                regions     = primalaynet.predict_primanet(page_path, line_coords)
                file['pages'][idx]["regions"]=regions
            output.append(file)
            output[index]['status'] = {}
            output[index]['status']['message']="layout-detector successful"
            end_time            = time.time()
            extraction_time     = (end_time - start_time)/len(page_paths)
            log_info('Layout detection per page completed in {}'.format(extraction_time), app_context.application_context)
        app_context.application_context["outputs"] =output
        log_info("successfully completed layout detection", None)
    except Exception as e:
        log_exception("Error occured during prima layout detection ",  app_context.application_context, e)
        return None

    return app_context.application_context


def LayoutDetection(app_context):
    
    log_debug('layout detection process starting {}'.format(app_context.application_context), app_context.application_context)
    try:
        
        response   = get_layout(app_context)
        return {
                'code': 200,
                'message': 'request completed',
                'rsp': response
                }
    except Exception as e:
        log_exception("Error occured during layout detection ",  app_context.application_context, e)
        return {
            'code': 400,
            'message': 'Error occured during layout detection ',
            'rsp': None
            }
