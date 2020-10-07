'''
Aims to modify/clean the translated sentence(output) to match the gramatical standards
Falls under non-nlp processing
'''
from onmt.utils.logging import logger

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
                logger.info("Replacing '.' with purnaviram")
                tgt = tgt[:-1] + str("।")
            else:
                logger.info("Adding the missing purnaviram")
                tgt = tgt + str("।")
            return tgt
        else:
            return tgt    

    except Exception as e:
        logger.error("Error in purnaviram applier, returning original tgt: {}".format(e))
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
            logger.info("Adding the missing fullstop")
            tgt = tgt + str(".")
            return tgt
        else:
            return tgt    

    except Exception as e:
        logger.error("Error in fullstop_applier, returning original tgt: {}".format(e))
        return tgt
