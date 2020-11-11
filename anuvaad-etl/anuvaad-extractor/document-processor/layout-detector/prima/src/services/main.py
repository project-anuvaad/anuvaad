from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug
import src.utilities.app_context as app_context
from src.services.get_underline import get_underline
from src.services.get_tables import get_text_table_line_df, get_text_from_table_cells
from compose import compose
import config
from src.utilities.primalaynet.infer import predict_primanet


    
def extract_table_line_regions(image_path):

    region,mask_image        = get_text_table_line_df(image_path)
    
    return region,mask_image


def get_layout(input) :
    pdf_data, flags = input

    #pdf_data['h_dfs']  = children_functions.get_layout_proposals(pdf_data,flags)
    for page_index, page_path in enumerate(pdf_data['pdf_image_paths']):
        
        table_line_region, mask_image = extract_table_line_regions(page_path)
        regions = predict_primanet(mask_image, pdf_data['in_dfs'][page_index])
    #if (pdf_data['lang'] != 'en') or (flags['doc_class'] != 'class_1'):
    #    pdf_data['h_dfs'] = tesseract_ocr(pdf_data,flags)
    #del pdf_data['in_dfs']
    return [pdf_data,flags]



def get_response():
    return None




def layout_detection(app_context,base_dir=config.BASE_DIR):
    log_debug('layout detection starting processing {}'.format(app_context.application_context), app_context.application_context)
    try:
        layout_detector_compose = compose(extract_table_line_regions,get_layout)
        response                = layout_detector_compose(app_context,base_dir)
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