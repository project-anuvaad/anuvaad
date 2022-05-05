from flask import Blueprint
from flask_restful import Api
from resources.html2json_resource import Html2JsonConversion
from resources.html2json_resource import Html2JsonConversionWF

# end-point for independent service
HTML2JSON_BLUEPRINT = Blueprint("HTML to Json", __name__)
api = Api(HTML2JSON_BLUEPRINT)
api.add_resource(Html2JsonConversion, "/html-to-json")

# end-point for workflow service
HTML2JSON_BLUEPRINT_WF = Blueprint("HTML to Json WF", __name__)
api = Api(HTML2JSON_BLUEPRINT_WF)
api.add_resource(Html2JsonConversionWF, "/html-to-json-wf")