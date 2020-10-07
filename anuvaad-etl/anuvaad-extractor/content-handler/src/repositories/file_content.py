import config
from models import BlockModel
import datetime
import uuid
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception

class FileContentRepositories:

    @staticmethod
    def create_block_info(block, record_id, page_no, data_type, user_id, src_lang, tgt_lang):
        new_block                   = {}
        new_block['created_on']     = datetime.datetime.utcnow()
        new_block['record_id']      = record_id
        new_block['page_no']        = page_no
        new_block['data_type']      = data_type
        new_block['job_id']         = record_id.split('|')[0]
        new_block['created_by']     = user_id
        new_block['src_lang']       = src_lang
        new_block['tgt_lang']       = tgt_lang
        new_block['block_identifier']   = str(uuid.uuid4())
        block['block_identifier']       = new_block['block_identifier']
        new_block['data']               = block

        '''
            storing a Step-0/baseline translation
        '''
        if 'tokenized_sentences' in block:
            for elem in block['tokenized_sentences']:
                elem['s0_tgt']    = elem['tgt']
                elem['s0_src']    = elem['src']
                if 'input_subwords' in elem:
                    del elem['input_subwords']
                if 'output_subwords' in elem:
                    del elem['output_subwords']
                if 'pred_score' in elem:
                    del elem['pred_score'] 

        log_info("creating new block for record_id {} for user {}".format(record_id, user_id), MODULE_CONTEXT)
        return new_block

    @staticmethod
    def update_block_info(block, record_id, page_no, data_type, user_id, src_lang, tgt_lang):
        new_block                   = {}
        new_block['created_on']     = datetime.datetime.utcnow()
        new_block['record_id']      = record_id
        new_block['page_no']        = page_no
        new_block['data_type']      = data_type
        new_block['job_id']         = record_id.split('|')[0]
        new_block['created_by']     = user_id
        new_block['src_lang']       = src_lang
        new_block['tgt_lang']       = tgt_lang
        new_block['block_identifier']   = block['block_identifier']
        new_block['data']               = block

        '''
            storing a Step-0/baseline translation
        '''
        if 'tokenized_sentences' in list(block.keys()):
            for elem in block['tokenized_sentences']:
                if 'input_subwords' in elem:
                    del elem['input_subwords']
                if 'output_subwords' in elem:
                    del elem['output_subwords']
                if 'pred_score' in elem:
                    del elem['pred_score'] 

        log_info("updating new block for record_id {} for user {}".format(record_id, user_id), MODULE_CONTEXT)
        return new_block

    @staticmethod
    def store(user_id, file_locale, record_id, pages, src_lang, tgt_lang):
        blocks = []
        for page in pages:
            if 'images' in page:
                for image in page['images']:
                    log_info("appending image block for record_id {} for user {}".format(record_id, user_id), MODULE_CONTEXT)
                    blocks.append(FileContentRepositories.create_block_info(image, record_id, page['page_no'], 'images', user_id, src_lang, tgt_lang))
                continue

            if  'lines' in page:
                for line in page['lines']:
                    log_info("appending lines block for record_id {} for user {}".format(record_id, user_id), MODULE_CONTEXT)
                    blocks.append(FileContentRepositories.create_block_info(line, record_id, page['page_no'], 'lines', user_id, src_lang, tgt_lang))
                continue

            if 'text_blocks' in page:
                for text in page['text_blocks']:
                    log_info("appending text block for record_id {} for user {}".format(record_id, user_id), MODULE_CONTEXT)
                    blocks.append(FileContentRepositories.create_block_info(text, record_id, page['page_no'], 'text_blocks', user_id, src_lang, tgt_lang))
                continue

        BlockModel.store_bulk_blocks(blocks)
        return True
        
    @staticmethod
    def get(user_id, record_id, start_page=1, end_page=5):
        total_page_count    = BlockModel.get_document_total_page_count(user_id, record_id)

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
            page_blocks = BlockModel.get_blocks_by_page(user_id, record_id, i)

            page    = {}
            for block in page_blocks:
                page[block['_id']] = block['data']
                print(block['data'])
                if len(block['data']) > 0 :
                    page['page_height']     = block['data'][0]['page_info']['page_height']
                    page['page_no']         = block['data'][0]['page_info']['page_no']
                    page['page_width']      = block['data'][0]['page_info']['page_width']

            data['pages'].append(page)

        data['start_page']  = start_page
        data['end_page']    = end_page
        data['total']       = total_page_count
        return data

    @staticmethod
    def update(user_id, record_id, blocks):
        updated_blocks  = []

        for block in blocks:
            src_lang = None
            tgt_lang = None

            if src_lang not in list(block.keys()):
                src_lang = 'NA'
            else:
                src_lang = block['src_lang']

            if tgt_lang not in list(block.keys()):
                tgt_lang = 'NA'
            else:
                tgt_lang = block['tgt_lang']

            if 'data_type' in list(block.keys()) and block['data_type'] == 'text_blocks':
                updated_blocks.append(FileContentRepositories.update_block_info(block, block['record_id'], block['page_info']['page_no'], 'text_blocks', user_id, src_lang, tgt_lang))

        if len(updated_blocks) > 0:
            for block in updated_blocks:
                if BlockModel.update_block(user_id, block['record_id'], block) == False:
                    return False
        return True