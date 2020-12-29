import config
from anuvaad_auditor.loghandler import log_error
import src.utilities.app_context as app_context
from src.utilities.region_operations import get_ngram, are_hlines,merge_children
from src.services.left_right_on_block import left_right_margin





def horzontal_merging(children):
    bi_gram = get_ngram(children, 2)
    lines = [[bi_gram[0][0]]]
    for pair in bi_gram:
        connected = are_hlines(pair[0], pair[1])
        if connected:
            lines[-1].append(pair[1])
        else:
            lines.append([pair[1]])
    merged_lines =[]
    for siblings in lines:
        merged_lines.append(merge_children(siblings))
    return merged_lines




def break_block(v_block):
    try:
        block_configs = config.BLOCK_CONFIGS
        if  v_block['children'] != None and  len(v_block['children'] ) < 2 :
            return v_block['children']
        else:
            return left_right_margin(v_block, block_configs)
    except Exception as e :
        log_error('Error in breaking blocks', app_context.application_context, e)
        return None








