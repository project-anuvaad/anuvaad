from flask import Blueprint
from flask_restful import Api

from src.resources.ner_annotation_resource import NERresources

NER_BLUEPRINT = Blueprint("ner_annotaion_api", __name__)
api = Api(NER_BLUEPRINT)
api.add_resource(NERresources, "/ner_annotation")
