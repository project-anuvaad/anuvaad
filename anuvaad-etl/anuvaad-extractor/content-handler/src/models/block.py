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

    @staticmethod
    def get_all_blocks(user_id, record_id):
        collections = get_db()['file_content']
        docs        = collections.find({
            'record_id': record_id,
            'created_by': user_id
        })
        return docs

    @staticmethod
    def get_blocks_by_page(user_id, record_id, page_number):
        collections = get_db()['file_content']
        results        = collections.aggregate([
                            { '$match' : { 'page_no': page_number, 'record_id': record_id, 'created_by': user_id } },
                            { '$group': { '_id': '$data_type', 'data': { '$push': "$data" } } }
                            ])
        return results

    @staticmethod
    def get_document_total_page_count(user_id, record_id):
        collections = get_db()['file_content']
        results     = collections.aggregate([
            { '$match' : { 'record_id': record_id, 'created_by': user_id } },
            {
                '$group':
                    {
                        '_id': '$record_id',
                        'page_count': { '$max': "$page_no" }
                    }
            }
        ])

        count = 0
        for result in results:
            count = result['page_count']
            break

        return count
