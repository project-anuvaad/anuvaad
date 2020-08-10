from flask_restful import Resource
from flask.json import jsonify
from flask import request
from src.utilities.utils import FileOperation
from src.utilities.model_response import CustomResponse
from src.utilities.model_response import CheckingResponse
from src.services.service import BlockMerging
import config
import logging
import time

# sentence block merging
file_ops = FileOperation()
DOWNLOAD_FOLDER =file_ops.file_download(config.download_folder)
log = logging.getLogger('file')

# rest request for block merging workflow service
class BlockMergerWF(Resource):
    
    # reading json request and reurnung final response
    def post(self):
        log.info("BlockMerger service started")
        log.info("BlockMerger completed!!!")
        return jsonify({"status":"SUCCESS"})


# rest request for block merging individual service
class BlockMerger(Resource):

    # reading json request and reurnung final response
    def post(self):
        log.info("Individual operation of block merging service strated.")
        json_data = request.get_json(force=True)
        block_merger = BlockMerging()
        output = block_merger.merge_blocks(json_data)
        log.info("response successfully generated.")
        return jsonify(output)
