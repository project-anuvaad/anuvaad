from flask_restful import fields, marshal_with, reqparse, Resource
from src.repositories import ParallelSentenceRepo
from anuvaad_auditor.loghandler import log_info, log_exception
from flask import request
from src.utilities.app_context import LOG_WITHOUT_CONTEXT
from src.models import CustomResponse, Status

parallelSentenceAnnotationRepo  = ParallelSentenceRepo()

class AnnotationTaskCreateResource(Resource):
    def post(self):
        body        = request.get_json()

        if 'annotationType' not in body.keys() or 'sourceLanguage' not in body.keys() or \
            'targetLanguage' not  in body.keys() or 'fileInfo' not in body.keys() or \
                'users' not in body.keys() or 'description' not in body.keys():
            log_info('Missing params in ParallelSentenceTaskCreateResource {}'.format(body), LOG_WITHOUT_CONTEXT)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value,None)
            return res.getresjson(), 400

        try:
            result = parallelSentenceAnnotationRepo.store(body['sourceLanguage'], body['targetLanguage'], \
                body['jobId'], body['annotationType'], body['users'], body['fileInfo'], body['description'])
            if result == False:
                log_info('Missing params in ParallelSentenceTaskCreateResource {}'.format(body), LOG_WITHOUT_CONTEXT)
                res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value,None)
                return res.getresjson(), 400
            else:
                res = CustomResponse(Status.SUCCESS.value, None)
                return res.getres()
        except Exception as e:
            log_exception("Exception at ParallelSentenceTaskCreateResource ", LOG_WITHOUT_CONTEXT, e)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400

class AnnotationTaskUserTaskSearchResource(Resource):
    def post(self):

        user_id = request.headers.get('x-user-id')
        if user_id == None:
            log_info('Missing params in AnnotationTaskUserTaskSearchResource {}'.format(body), LOG_WITHOUT_CONTEXT)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value,None)
            return res.getresjson(), 400
        
        try:
            result = parallelSentenceAnnotationRepo.search_user_task(user_id)
            if result == False:
                res = CustomResponse(Status.SUCCESS.value, None)
                return res.getres()
            else:
                res = CustomResponse(Status.SUCCESS.value, result)
                return res.getres()
        except Exception as e:
            log_exception("Exception at AnnotationTaskUserTaskSearchResource ", LOG_WITHOUT_CONTEXT, e)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400

class AnnotationTaskTaskIdSearchResource(Resource):
    def post(self):
        body        = request.get_json()
        if 'taskIds' not in body.keys():
            log_info('Missing params in AnnotationTaskTaskIdSearchResource {}'.format(body), LOG_WITHOUT_CONTEXT)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400
        
        try:
            result = parallelSentenceAnnotationRepo.search_taskIds_annotations(body['taskIds'])
            if result == False:
                res = CustomResponse(Status.SUCCESS.value, None)
                return res.getres()
            else:
                res = CustomResponse(Status.SUCCESS.value, result)
                return res.getres()
        except Exception as e:
            log_exception("Exception at AnnotationTaskTaskIdSearchResource ", LOG_WITHOUT_CONTEXT, e)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400

class AnnotationTaskTaskTypeSearchResource(Resource):
    def post(self):
        body        = request.get_json()
        if 'annotationType' not in body.keys():
            log_info('Missing params in AnnotationTaskTaskTypeSearchResource {}'.format(body), LOG_WITHOUT_CONTEXT)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400
        
        try:
            result = parallelSentenceAnnotationRepo.search_tasks_annotationType(body['annotationType'])
            if result == False:
                res = CustomResponse(Status.SUCCESS.value, None)
                return res.getres()
            else:
                res = CustomResponse(Status.SUCCESS.value, result)
                return res.getres()
        except Exception as e:
            log_exception("Exception at AnnotationTaskTaskTypeSearchResource ", LOG_WITHOUT_CONTEXT, e)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400

class AnnotationTaskSaveAnnotationResource(Resource):
    def post(self):
        body        = request.get_json()

        if 'annotationId' not in body.keys() or 'score' not in body.keys() or \
            'saved' not  in body.keys():
            log_info('Missing params in AnnotationTaskSaveAnnotationResource {}'.format(body), LOG_WITHOUT_CONTEXT)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value,None)
            return res.getresjson(), 400
        
        try:
            result = parallelSentenceAnnotationRepo.save_annotation(body)
            if result == False:
                res = CustomResponse(Status.SUCCESS.value, None)
                return res.getres()
            else:
                res = CustomResponse(Status.SUCCESS.value, None)
                return res.getres()
        except Exception as e:
            log_exception("Exception at AnnotationTaskSaveAnnotationResource ", LOG_WITHOUT_CONTEXT, e)
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400