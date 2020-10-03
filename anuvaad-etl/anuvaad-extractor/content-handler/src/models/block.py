from db.connection_manager  import get_db

class BlockModel(object):
    def get_block_by_block_id(self, block_id):
        pass

    def get_blocks_count(self):
        pass

    @staticmethod
    def store_bulk_blocks(blocks):
        collections = get_db()['file_content']
        result      = collections.insert_many(blocks)
        print(result)
