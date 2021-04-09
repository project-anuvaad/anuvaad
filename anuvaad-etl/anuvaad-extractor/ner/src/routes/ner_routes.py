from flask import Blueprint
from flask_restful import Api
from src.resources.ner_annotation_resource import NERresourcesWF
from src.resources.ner_annotation_resource import NERresources

# end-point for independent service
NER_BLUEPRINT = Blueprint("ner_annotaion_api", __name__)
api = Api(NER_BLUEPRINT)
api.add_resource(NERresources, "/ner-annotation")

# end-point for workflow service
NER_BLUEPRINT_WF = Blueprint("ner_annotaion_api wf", __name__)
api = Api(NER_BLUEPRINT_WF)
api.add_resource(NERresourcesWF, "/ner-annotation-wf")