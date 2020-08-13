from flask import Blueprint
from flask_restful import Api
from src.resources.documentstructure  import DocumentStructureResource

DOCUMENTSTRUCTURE_BLUEPRINT      = Blueprint("documentstructure", __name__)

Api(DOCUMENTSTRUCTURE_BLUEPRINT).add_resource(DocumentStructureResource, "/digital_pdf")

