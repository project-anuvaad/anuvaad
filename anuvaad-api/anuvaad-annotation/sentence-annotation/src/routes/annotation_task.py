from flask import Blueprint
from flask_restful import Api

from src.resources import AnnotationTaskCreateResource, AnnotationTaskUserTaskSearchResource, AnnotationTaskTaskIdSearchResource, AnnotationTaskSaveAnnotationResource, AnnotationTaskTaskTypeSearchResource

ANNOTATION_BLUEPRINT = Blueprint("annotation_task", __name__)

Api(ANNOTATION_BLUEPRINT).add_resource(
    AnnotationTaskCreateResource, "/v0/task/create"
)

Api(ANNOTATION_BLUEPRINT).add_resource(
    AnnotationTaskUserTaskSearchResource, "/v0/user/task/search"
)

Api(ANNOTATION_BLUEPRINT).add_resource(
    AnnotationTaskTaskTypeSearchResource, "/v0/annotation-type/task/search"
)

Api(ANNOTATION_BLUEPRINT).add_resource(
    AnnotationTaskTaskIdSearchResource, "/v0/task/details/search"
)

Api(ANNOTATION_BLUEPRINT).add_resource(
    AnnotationTaskSaveAnnotationResource, "/v0/task/annotation/grading"
)

