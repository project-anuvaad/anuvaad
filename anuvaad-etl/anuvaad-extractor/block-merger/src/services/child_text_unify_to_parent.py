import logging
import pandas as pd
import config
import time
import src.utilities.app_context as app_context
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error

log = logging.getLogger('file')

class ChildTextUnify(object):
    def __init__(self):
        pass       

    # after successful block merging returning data
    def drop_text_regards_attrib(self,attr,drop_lis):
        
        if attr in drop_lis:
            return True
        else:
            return False
        
    def get_children_text_block(self, block, drop_lis):
    
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
                    sub2_block_children   =  sub2_block_children.where(sub2_block_children.notnull(), None)

                    for sub2_block_index in range(len(sub2_block_children)):
                        if 'attrib' in sub2_block_children.columns:
                            if self.drop_text_regards_attrib(sub2_block_children['attrib'][sub2_block_index],drop_lis):
                                continue
                            else:
                                text = text+" " + str(sub2_block_children['text'][sub2_block_index])
                        else:
                            text = text+" " + str(sub2_block_children['text'][sub2_block_index])
                            
            return text

    def get_parent_block(self,data,drop_lis):
        
        for block_index in range(len(data)):
            df   =  data.iloc[block_index]
            df   =  df.where(df.notnull(), None)
            text =  self.get_children_text_block(df, drop_lis)
            data.iloc[block_index]['text'] = str(text)

        return data

    def unify_child_text_blocks(self, p_dfs):
        
        start_time = time.time()
        merge_dfs  = []
        drop_lis   = config.DROP_TEXT
        pages      = len(p_dfs)
        try :
            for page_index in range(pages):
                p_df = p_dfs[page_index]
                p_df = p_df.reset_index(drop=True)
                merge_df = self.get_parent_block(p_df,drop_lis)
                merge_dfs.append(merge_df)
        except  Exception as e :
            log_error('Error in merging child text to partent text', app_context.application_context, e)
            return None
        
        end_time            = time.time()
        extraction_time     = end_time - start_time
        log_info('  Merging child text to partent text completed in {}'.format(extraction_time), app_context.application_context)
        return merge_dfs

