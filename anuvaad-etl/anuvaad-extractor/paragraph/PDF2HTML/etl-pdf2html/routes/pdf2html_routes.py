from flask import Blueprint
from flask_restful import Api
from resources.pdf2html_resource import Pdf2HtmlConversion
from resources.pdf2html_resource import Pdf2HtmlConversionWF

# end-point for independent service
PDF2HTML_BLUEPRINT = Blueprint("Pdf to HTML", __name__)
api = Api(PDF2HTML_BLUEPRINT)
api.add_resource(Pdf2HtmlConversion, "/pdf-to-html")

# end-point for workflow service
PDF2HTML_BLUEPRINT_WF = Blueprint("Pdf to HTML WF", __name__)
api = Api(PDF2HTML_BLUEPRINT_WF)
api.add_resource(Pdf2HtmlConversionWF, "/pdf-to-html-wf")