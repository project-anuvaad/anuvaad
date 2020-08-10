from flask import Blueprint
from flask_restful import Api
from src.resources.block_merger import BlockMerger

# end-point for independent service
BLOCK_MERGER_BLUEPRINT = Blueprint("block_merger", __name__)
api = Api(BLOCK_MERGER_BLUEPRINT)
api.add_resource(BlockMerger, "/merge-blocks")
