from flask import Blueprint
from flask_restful import Api
from resources.html2json_resource import Html2JsonConversion

HTML2JSON_BLUEPRINT = Blueprint("HTML to Json", __name__)
api = Api(HTML2JSON_BLUEPRINT)
api.add_resource(Html2JsonConversion, "/html-to-json")