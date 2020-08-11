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
log = logging.getLogger('file')

# rest request for block merging workflow service
class BlockMergerWF(Resource):
    
    # reading json request and reurnung final response
    def post(self):
        log.info("BlockMerger service started")
        task_id = str("BM-" + str(time.time()).replace('.', ''))
        task_starttime = str(time.time()).replace('.', '')
        json_data = request.get_json(force=True)
        block_merger = BlockMerging()
        check_response = CheckingResponse(json_data, task_id, task_starttime, block_merger)
        workflow_response = check_response.main_response_wf(rest_request=True)
        log.info("BlockMerger completed!!!")
        return jsonify(workflow_response)


# rest request for block merging individual service
class BlockMerger(Resource):

    # reading json request and reurnung final response
    def post(self):
        log.info("Individual operation of block merging service strated.")
        json_data = request.get_json(force=True)
        block_merger = BlockMerging()
        task_id, task_starttime = "", ""
        check_response = CheckingResponse(json_data, task_id, task_starttime, block_merger)
        individual_response = check_response.main_response_files_only()
        log.info("response successfully generated.")
        return jsonify(individual_response)
