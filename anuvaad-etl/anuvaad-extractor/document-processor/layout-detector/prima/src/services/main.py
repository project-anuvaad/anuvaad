from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
import src.utilities.app_context as app_context
from src.services.get_table_cells import mask_tables
import config,time
import json
import torch,torchvision
from src.utilities.primalaynet.infer import PRIMA,cell_layout

from src.utilities.request_parse import get_files, File,get_json
from src.utilities.model_response import get_coord


primalaynet = PRIMA()

def extract_table_line_regions(image_path):
    region,mask_image        = mask_tables(image_path)
    return region,mask_image


def get_layout(app_context) :
    try:
        files       = get_files(app_context.application_context)
        #files   = get_json(app_context.application_context)
        #files       = get_files(json_data)        
        file_images = []
        output      = []
        for index,file_new in enumerate(files):
            file   = get_json(file_new['file']['name'])[0]
            file_properties = File(file)
            page_paths      = file_properties.get_pages()
            start_time = time.time()
            for idx,page_path in enumerate(page_paths):
                page_lines  = file_properties.get_lines(idx)
                page_words  = file_properties.get_words(idx)
                line_coords = get_coord(page_lines)
                #page_path   = '/'.join(page_path.split('/')[-4:])
                page_path   =  'upload/' + page_path.split('upload/')[-1]

                #masked_image, table_and_lines = extract_table_line_regions(page_path)
                #cell_regions = cell_layout(table_and_lines,page_path)
                if torch.cuda.is_available():
                    torch.cuda.device(0)
                    print("*******cuda available")
                    torch.cuda.empty_cache()
                time.sleep(1)
                regions     = primalaynet.predict_primanet(page_path, line_coords)
                #regions += cell_regions
                file['pages'][idx]["regions"]=regions
            file['file'] = file_new['file']
            file['config'] = file_new['config']
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


def LayoutDetection(app_context,base_dir = config.BASE_DIR):
    
    log_debug('layout detection process starting {}'.format(app_context.application_context), app_context.application_context)
    try:
        
        response   = get_layout(app_context)
        
        if response!=None:
            return {
                    'code': 200,
                    'message': 'request completed',
                    'rsp': response
                    }
        else:
            return {
                'code': 400,
                'message': 'Error occured during layout detection',
                'rsp': None
                }
    except Exception as e:
        log_exception("Error occured during layout detection ",  app_context.application_context, e)
        return {
            'code': 400,
            'message': 'Error occured during layout detection ',
            'rsp': None
            }
