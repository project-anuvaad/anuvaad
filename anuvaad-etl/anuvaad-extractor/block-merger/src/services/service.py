import logging
import pandas as pd

log = logging.getLogger('file')

class BlockMerging(object):
    def __init__(self):
        pass       

    # after successful block merging returning data
    def drop_text_regards_attrib(self,attr,drop_lis):
        
        if attr in drop_lis:
            return True
        else:
            return False
        
    def get_children_text(self, block, drop_lis):
    
        if block['children'] == None:
            return block['text']
        else:
            text = ""
            block_children  =  pd.read_json(block['children'])
            block_children  =  block_children.reset_index(drop=True)
            block_children  =  block_children.where(block_children.notnull(), None)
            block_children  =  block_children.sort_values('text_top')

            for sub_block_index in range(len(block_children)):
                
                sub_df  = block_children.iloc[sub_block_index]
                sub_df  = sub_df.where(sub_df.notnull(), None)

                if sub_df['children'] == None:
                    text = text+" " + sub_df['text']
                    continue
                else:
                    sub2_block_children   =  pd.read_json(sub_df['children'])
                    sub2_block_children   =  sub2_block_children.reset_index(drop=True)
                    sub2_block_children   =  sub2_block_children.sort_values('text_left')

                    for sub2_block_index in range(len(sub2_block_children)):
                        if 'attrib' in sub2_block_children.columns:
                            if self.drop_text_regards_attrib(sub2_block_children['attrib'][sub2_block_index],drop_lis):
                                continue
                            else:
                                text = text+" " + sub2_block_children['text'][sub2_block_index]
                        else:
                            text = text+" " + sub2_block_children['text'][sub2_block_index]
                            
            return text

    def get_block(self,data,drop_lis):
        
        for block_index in range(len(data)):
            df   =  data.iloc[block_index]
            df   =  df.where(df.notnull(), None)
            text =  self.get_children_text(df, drop_lis)
            data.iloc[block_index]['text'] = str(text)

        return data

    def merge_blocks(self,in_data,drop_lis):
        log.info("Block Merging started ===>")
        in_data = in_data.reset_index(drop=True)
        out_data = self.get_block(in_data,drop_lis)
        log.info("Block Merging completed")

        return out_data

