from flask import Blueprint
from flask_restful import Api
from src.resources.block_merger import BlockMerger
from src.resources.block_merger import BlockMergerWF

# end-point for independent service
BLOCK_MERGER_BLUEPRINT = Blueprint("block_merger", __name__)
api = Api(BLOCK_MERGER_BLUEPRINT)
api.add_resource(BlockMerger, "/v0/merge-blocks")

# end-point for workflow service
BLOCK_MERGER_BLUEPRINT_WF = Blueprint("block_merger workflow", __name__)
api_wf = Api(BLOCK_MERGER_BLUEPRINT_WF)
api_wf.add_resource(BlockMergerWF, "/v0/merge-blocks-wf")