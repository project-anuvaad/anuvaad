import logging

log = logging.getLogger('file')

class BlockMerging(object):
    def __init__(self):
        pass       

    # after successful block merging returning data
    def get_children(self, block):
        if block['children']==None:
            return block['text']
        else:
            text = ""
            for sub_block in block['children']:
                if sub_block['children']== None:
                    text = text+" " + sub_block['text']
                    continue
                else:
                    for sub_sub_block in  sub_block['children']:
                        text = text+" " + sub_sub_block['text']
            return text

    def get_block(self, data):

        for page_index in range(len(data)):
            page_blocks = data[page_index]['blocks']
            for index,block in enumerate(page_blocks): 
                text = self.get_children(block)
                page_blocks[index]['text']=str(text)
                
            data[page_index]['blocks']  = page_blocks
        return data

    def merge_blocks(self, in_data):
        log.info("Block Merging started ===>")
        out_data = self.get_block(in_data)
        log.info("Block Merging completed")
        return out_data

