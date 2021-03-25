from flask import Blueprint
from flask_restful import Api

from src.resources import AnnotationTaskCreateResource

ANNOTATION_BLUEPRINT = Blueprint("annotation_task", __name__)

Api(ANNOTATION_BLUEPRINT).add_resource(
    AnnotationTaskCreateResource, "/v0/task/create"
)

