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
from src.services.segment import segment_regions



#segent blocks
#ocr



def get_segmented_regions(app_context) :
    try:
        files       = get_files(app_context.application_context)
        #files   = get_json(app_context.application_context)
        #files       = get_files(json_data)
        file_images = []
        output      = []
        for index,file in enumerate(files):
            file   = get_json(file['file']['name'])
            file_properties = File(file)
            pages = file_properties.get_pages()
            page_counts = len(pages)
            start_time = time.time()
            for page_index in range(page_counts):
                page_lines   =  file_properties.get_lines(page_index)
                page_regions =  file_properties.get_regions(page_index)
                file_properties.set_regions(page_index, segment_regions(page_lines,page_regions))

            output.append(file_properties.get_file())
            output[index]['status']= {'message':"block-segmenter successful"}
            end_time            = time.time()
            extraction_time     = (end_time - start_time)/len(page_counts)
            log_info('Layout detection per page completed in {}'.format(extraction_time), app_context.application_context)
        app_context.application_context["outputs"] =output
        log_info("successfully completed layout detection", None)
    except Exception as e:
        log_exception("Error occured during prima layout detection ",  app_context.application_context, e)
        return None

    return app_context.application_context
