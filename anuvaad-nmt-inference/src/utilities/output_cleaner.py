'''
Aims to modify/clean the translated sentence(output) to match the gramatical standards
Falls under non-nlp processing
'''
from anuvaad_auditor.loghandler import log_info, log_exception
from utilities import MODULE_CONTEXT

def cleaner(src,tgt,id):
    if id == 56:
        return purnaviram_applier(src,tgt)
    else:
        return tgt


def purnaviram_applier(src,tgt):
    '''
    For english to hindi translation
    '''
    try:
        if tgt is None or len(tgt.split()) == 0:
            return tgt
        if len(src.split()) < 5:
            return tgt
        if src.endswith('.') and tgt.endswith('।'):
            return tgt
        elif src.endswith('.') and tgt[-1] != '।':
            if tgt.endswith('.'):
                log_info("Replacing '.' with purnaviram",MODULE_CONTEXT)
                tgt = tgt[:-1] + str("।")
            else:
                log_info("Adding the missing purnaviram",MODULE_CONTEXT)
                tgt = tgt + str("।")
            return tgt
        else:
            return tgt    

    except Exception as e:
        log_exception("Error in purnaviram applier, returning original tgt: {}".format(e),MODULE_CONTEXT,e)
        return tgt

def fullstop_applier(src,tgt):
    '''
    For non-hindi translation pair
    '''
    try:
        if len(src.split()) < 5:
            return tgt
        if src.endswith('.') and tgt.endswith('.'):
            return tgt
        elif src.endswith('.') and tgt[-1] != '.':
            log_info("Adding the missing fullstop",MODULE_CONTEXT)
            tgt = tgt + str(".")
            return tgt
        else:
            return tgt    

    except Exception as e:
        log_exception("Error in fullstop_applier, returning original tgt: {}".format(e),MODULE_CONTEXT,e)
        return tgt
