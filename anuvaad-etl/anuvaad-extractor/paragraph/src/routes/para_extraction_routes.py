from flask import Blueprint
from flask_restful import Api
from src.resources.pdf_to_para_resource import PdfParagraph

PARA_BLUEPRINT = Blueprint("paragraph_extraction", __name__)
api = Api(PARA_BLUEPRINT)
api.add_resource(PdfParagraph, "/paragraph-extraction")