from flask import Blueprint
from flask_restful import Api
from src.resources.module import Bolck_Segmenter
from src.resources.module import Block_Segmenter_WF

# end-point for independent service
Bolck_Segmenter_BLUEPRINT = Blueprint("block_segmenter", __name__)
api = Api(Bolck_Segmenter_BLUEPRINT)
api.add_resource(Bolck_Segmenter, "/v0/block-segmenter/process")

# end-point for workflow service
Bolck_Segmenter_BLUEPRINT_WF = Blueprint("block_segmenter workflow", __name__)
api_wf = Api(Bolck_Segmenter_BLUEPRINT_WF)
api_wf.add_resource(Block_Segmenter_WF, "/v0/block-segmenter/process_wf")