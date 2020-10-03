import config
from models import BlockModel
import datetime

class FileContentRepositories:

    @staticmethod
    def update_block_info(block, record_id, page_no, data_type, user_id):
        new_block               = {}
        new_block['created_on'] = datetime.datetime.utcnow()
        new_block['record_id']  = record_id
        new_block['page_no']    = page_no
        new_block['data_type']  = data_type
        new_block['job_id']     = record_id.split('|')[0]
        new_block['created_by'] = user_id
        new_block['data']       = block
        new_block['block_identifier']   = block['block_identifier']
        return new_block

    @staticmethod
    def process(user_id, file_locale, record_id, pages):

        blocks = []
        for page in pages:
            if 'images' in list(page.keys()):
                for image in page['images']:
                    blocks.append(FileContentRepositories.update_block_info(image, record_id, page['page_no'], 'images', user_id))

            if  'lines' in list(page.keys()):
                for line in page['lines']:
                    blocks.append(FileContentRepositories.update_block_info(line, record_id, page['page_no'], 'lines', user_id))

            if 'text_blocks' in list(page.keys()):
                for text in page['text_blocks']:
                    blocks.append(FileContentRepositories.update_block_info(text, record_id, page['page_no'], 'text_blocks', user_id))

        BlockModel.store_bulk_blocks(blocks)
        return True
        
        