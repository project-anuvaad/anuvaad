import logging

log = logging.getLogger('file')

class BlockMerging(object):
    def __init__(self):
        pass       

    # after successful block merging returning data
    def merge_blocks(self,data):
        log.info("Block Merging started")
        log.info("Block Merging completed")
        return data

