from flask import Blueprint
from flask_restful import Api
from resources.pdf2html_resource import Pdf2HtmlConversion

PDF2HTML_BLUEPRINT = Blueprint("Pdf to HTML", __name__)
api = Api(PDF2HTML_BLUEPRINT)
api.add_resource(Pdf2HtmlConversion, "/PDF-to-HTML")