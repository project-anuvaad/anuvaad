from flask import Blueprint
from flask_restful import Api

from resources.para_sen import TransformFile, DownloadFile

# end-point for transform docx/pptx file
TRNSFRM_BLUEPRINT_wf = Blueprint("transform_file_wf", __name__)
api_wf = Api(TRNSFRM_BLUEPRINT_wf)
api_wf.add_resource(TransformFile, "/v0/transform-wf")

# end-point for download translated file
DWLN_BLUEPRINT_wf = Blueprint("download_file_wf", __name__)
api_wf_wn = Api(DWLN_BLUEPRINT_wf)
api_wf_wn.add_resource(DownloadFile, "/v0/download-wf")
