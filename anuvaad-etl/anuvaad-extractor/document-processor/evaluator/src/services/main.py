from src.utilities.request_parse import get_files ,File ,Evalue
from src.utilities.compare_page import compare_regions
from src.utilities.ocr_evaluation import text_evaluation
import src.utilities.app_context as app_context
import config
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_debug







def get_iou(evalue_file) :

    comparison = []
    gt_json, in_json = evalue_file.get_json()
    check_files = len(gt_json) == len(in_json)

    if check_files :
        boxlevel = evalue_file.get_boxlevel()
        for gt_index , gt in enumerate(gt_json):
            gt_file, in_file = File(gt), File(in_json[gt_index])
            gt_pages = gt_file.get_pages()
            in_pages = in_file.get_pages()
            check_pages = len(gt_pages) == len(in_pages)
            if check_pages:
                pages = []
                for page_index, page in enumerate(gt_pages):
                    gt_boxes = gt_file.get_boxes(boxlevel, page_index,'gt')
                    in_boxes = in_file.get_boxes(boxlevel, page_index,'in')
                    compared_regions = compare_regions(gt_boxes, in_boxes)
                    if len(compared_regions)!=0 and 'iou' in compared_regions.keys():
                        compared_ocr_regions = text_evaluation(compared_regions['iou'],boxlevel)
                        compared_regions['iou'] = compared_ocr_regions
                    pages.append(compared_regions)
                evalue_file.set_staus(True)
                #file_comparison = evalue_file.get_evaluation()
                comparison.append({'pages': pages})
            else:
                log_info('Seems like input and ground belong to different files ', app_context)
                comparison = []
    else:
        log_info('Seems like input and ground belong to different job  ', app_context)
        comparison = []

    return comparison




#
# def get_iou(evalue_file) :
#
#     gt_json, in_json = evalue_file.get_json()
#     gt_file, in_file = File(gt_json), File(in_json)
#
#     gt_pages = gt_file.get_pages()
#     in_pages = in_file.get_pages()
#
#     check_pages = len(gt_pages) == len(in_pages)
#
#     if check_pages:
#         boxlevel = evalue_file.get_boxlevel()
#         for page_index, page in enumerate(gt_pages):
#             gt_boxex = gt_file.get_boxes(boxlevel, page_index)
#             in_boxex = in_file.get_boxes(boxlevel, page_index)
#             comparision = compare_regions(gt_boxex, in_boxex)
#             evalue_file.set_page(comparision)
#         evalue_file.set_staus(True)
#         iou_comparison = evalue_file.get_evaluation()
#     else:
#         log_info('Seems like input and ground belong to different files ', app_context)
#         iou_comparison = {}
#     return iou_comparison


def compare_overlapp(app_context):
    output = []
    files = get_files(app_context.application_context)

    for file_index, file in enumerate(files):
        evalue_file = Evalue(file)
        if evalue_file.get_strategy() == 'IOU':
            output = output + get_iou(evalue_file)
        else :
            log_info('currently supports only iou comparison  ', app_context)
            output.append({})
    app_context.application_context['outputs'] = output
    return app_context.application_context



def Evaluation(app_context,base_dir=config.BASE_DIR):

    log_debug('Evaluator starting processing {}'.format(app_context.application_context), app_context.application_context)
    try:
        response = compare_overlapp(app_context)
        return {
                'code': 200,
                'message': 'request completed',
                'rsp': response
                }
    except Exception as e:
        log_exception("Error occured during pdf to blocks conversion" + str(e),  app_context.application_context, e)
        return {
            'code': 400,
            'message': 'Error occured during pdf to blocks conversion',
            'rsp': None
            }
