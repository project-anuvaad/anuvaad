import config
from models import BlockModel
import datetime
import uuid
from utilities import AppContext
from anuvaad_auditor.loghandler import log_info, log_exception
import time

class FileContentRepositories:
    def __init__(self):
        self.blockModel     = BlockModel()

    def create_block_info(self, block, record_id, page_info, data_type, user_id, src_lang, tgt_lang):
        new_block                   = {}
        new_block['created_on']     = datetime.datetime.utcnow()
        new_block['record_id']      = record_id
        new_block['page_no']        = page_info['page_no']
        new_block['data_type']      = data_type
        new_block['job_id']         = record_id.split('|')[0]
        new_block['created_by']     = user_id
        new_block['src_lang']       = src_lang
        new_block['tgt_lang']       = tgt_lang

        '''
        ' generating block_identifier to uniquely identify individual block
        '''
        new_block['block_identifier']   = str(uuid.uuid4())
        block['block_identifier']       = new_block['block_identifier']

        new_block['data']               = block
        new_block['data']['page_info']  = page_info

        if 'tokenized_sentences' in block:
            for elem in block['tokenized_sentences']:
                if 'tgt' in elem:
                    elem['s0_tgt']    = elem['tgt'] 
                elem['s0_src']    = elem['src']
                if 'input_subwords' in elem:
                    del elem['input_subwords']
                if 'output_subwords' in elem:
                    del elem['output_subwords']
                if 'pred_score' in elem:
                    del elem['pred_score']
        return new_block

    def update_block_info(self, block, update_s0, modifiedSentences=None):
        new_block                   = {}
        new_block['data']           = block
        # log_info("update_block_info payload {}".format(json.dumps(block)), AppContext.getContext())
        if 'tokenized_sentences' in list(block.keys()):
            for elem in block['tokenized_sentences']:
                #case in which only the targeted setences are modified
                if update_s0 and modifiedSentences != None and len(modifiedSentences) != 0:  
                    if 's_id' in elem and elem['s_id'] in modifiedSentences:
                        if 'tgt' in elem:
                            elem['s0_tgt']    = elem['tgt']
                        elem['s0_src']    = elem['src']

                if update_s0 and (modifiedSentences == None or len(modifiedSentences) == 0) :
                    if 'tgt' in elem:
                        elem['s0_tgt']    = elem['tgt']
                    elem['s0_src']    = elem['src']

                if 'input_subwords' in elem:
                    del elem['input_subwords']
                if 'output_subwords' in elem:
                    del elem['output_subwords']
                if 'pred_score' in elem:
                    del elem['pred_score']
                # case in which entire block is updated/ updating source file 
                


        log_info("updating new block for block_identifier {}".format(block['block_identifier']), AppContext.getContext())
        return new_block

    def store(self, user_id, file_locale, record_id, pages, src_lang, tgt_lang):
        blocks = []
        for page in pages:
            log_info(page,AppContext.getContext())
            page_info                   = {}
            page_info['page_no']        = page['page_no']
            page_info['page_width']     = page['page_width']
            page_info['page_height']    = page['page_height']

            try:
                if 'images' in page and page['images'] != None:
                    for image in page['images']:
                        blocks.append(self.create_block_info(image, record_id, page_info, 'images', user_id, src_lang, tgt_lang))
            except Exception as e:
                AppContext.addRecordID(record_id)
                log_exception('images key not present, thats strange:{}'.format(str(e)), AppContext.getContext(), e)
            
            try:
                if  'lines' in page and page['lines'] != None:
                    for line in page['lines']:
                        blocks.append(self.create_block_info(line, record_id, page_info, 'lines', user_id, src_lang, tgt_lang))
            except Exception as e:
                AppContext.addRecordID(record_id)
                log_info('lines key is not present, ignorning further:{}'.format(str(e)), AppContext.getContext())
                pass
            
            try:
                if 'text_blocks' in page and page['text_blocks'] != None:
                    for text in page['text_blocks']:
                        blocks.append(self.create_block_info(text, record_id, page_info, 'text_blocks', user_id, src_lang, tgt_lang))
                
            except Exception as e:
                AppContext.addRecordID(record_id)
                log_exception('text_blocks key not present, thats strange:{}'.format(str(e)), AppContext.getContext(), e)
                pass
            
        if self.blockModel.store_bulk_blocks(blocks) == False:
            return False
        return True
        
    def get(self, record_id, start_page=1, end_page=5):
        total_page_count    = self.blockModel.get_document_total_page_count(record_id)

        if start_page == 0 and end_page == 0:
            start_page  = 1
            end_page    = total_page_count
        
        if start_page == 0:
            start_page  = 1
        if end_page == 0:
            end_page   = 5
        if start_page > end_page:
            return False

        data            = {}
        data['pages']   = []
        for i in range(start_page, end_page+1):
            page_blocks = self.blockModel.get_blocks_by_page(record_id, i)

            page    = {}
            for block in page_blocks:
                page[block['_id']] = block['data']
                if len(block['data']) > 0 :
                    page['page_height']     = block['data'][0]['page_info']['page_height']
                    page['page_no']         = block['data'][0]['page_info']['page_no']
                    page['page_width']      = block['data'][0]['page_info']['page_width']

            data['pages'].append(page)

        data['start_page']  = start_page
        data['end_page']    = end_page
        data['total']       = total_page_count
        return data

    def update(self, record_id,user_id, blocks, workflowCode, modifiedSentences=None):
        updated_blocks  = []
        saved_blocks    = []
        update_s0       = False

        '''
            - workflowCode: 
            - WF_S_TR and WF_S_TKTR, changes the sentence structure hence s0 pair needs to be updated
            - DP_WFLOW_S_C, doesn't changes the sentence structure hence no need to update the s0 pair
        '''
        
        if workflowCode is not None and (workflowCode == 'WF_S_TR' or workflowCode == 'WF_S_TKTR'):
            update_s0 = True
        log_info("FileContentUpdateRepo -workflowcode : {} | update_S0 : {}".format(workflowCode,update_s0),AppContext.getContext())
        for block in blocks:
            updated_blocks.append(self.update_block_info(block, update_s0, modifiedSentences))
        
        if len(updated_blocks) > 0:
            for updated_block in updated_blocks:
                AppContext.addRecordID(record_id)
                log_info("FileContentUpdateRepo -updating blocks", AppContext.getContext())
                if self.blockModel.update_block(record_id,user_id, updated_block['data']['block_identifier'], updated_block) == False:
                    return False, saved_blocks
                AppContext.addRecordID(record_id)
                log_info("FileContentUpdateRepo -fetching back updated blocks", AppContext.getContext())
                saved_block_results = self.blockModel.get_block_by_block_identifier(record_id,user_id, updated_block['data']['block_identifier'])
                for saved_block in saved_block_results:
                    saved_blocks.append(saved_block['data'][0])
                log_info("FileContentUpdateRepo -updated blocks : {}".format(str(saved_blocks)),AppContext.getContext())
        return True, saved_blocks

    def store_reference(self,records):
        
        for record in records:
            if record.get("job_id") == None and record.get("file_link") == None:
                return False
            if(self.blockModel.store_s3_link({"job_id":record["job_id"],"file_link":record["file_link"],"timestamp":eval(str(time.time()))})) == False:
                return False
        return True
            
    def get_reference(self,records):
        data=[]
        for record in records:
            result= self.blockModel.get_s3_link(record)
            if not result:
                return False
            data.append(result)
        return data
            
       