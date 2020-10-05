from flask_restful import fields, marshal_with, reqparse, Resource
from repositories import SentenceRepositories, FileContentRepositories
from models import CustomResponse, Status
import ast

class FileContentSaveResource(Resource):
    def post(self):
        parser = reqparse.RequestParser(bundle_errors=True)
        parser.add_argument('file_locale', location='json', type=str, help='file_locale cannot be empty', required=True)
        parser.add_argument('record_id', location='json', type=str, help='record_id cannot be empty', required=True)
        parser.add_argument('pages', location='json', type=str, help='pages cannot be empty', required=True)
        parser.add_argument('userid', location='headers', type=str, help='userid cannot be empty', required=True)

        args    = parser.parse_args()
        try:
            pages = ast.literal_eval(args['pages'])
        except expression as identifier:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400

        if FileContentRepositories.store(args['userid'], args['file_locale'], args['record_id'], pages) == False:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400
        res = CustomResponse(Status.SUCCESS.value, None)
        return res.getres()

class FileContentGetResource(Resource):
    def get(self):

        parser = reqparse.RequestParser()
        parser.add_argument('start_page', type=int, location='args', help='start_page can be 0, set start_page & end_page as 0 to get entire document', required=True)
        parser.add_argument('end_page',  type=int, location='args', help='end_page can be 0, set start_page & end_page as 0 to get entire document', required=True)
        parser.add_argument('ad-userid', location='headers', type=str, help='userid cannot be empty', required=True)
        parser.add_argument('job_id', type=str, location='args', help='Job Id is required', required=False)
        parser.add_argument('record_id', type=str, location='args', help='record_id is required', required=True)

        args    = parser.parse_args()
        result  = FileContentRepositories.get(args['ad-userid'], args['record_id'], args['start_page'], args['end_page'])

        if result == False:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400
        res = CustomResponse(Status.SUCCESS.value, result, result['total'])
        return res.getres()
        
class FileContentUpdateResource(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('blocks', location='json', type=str, help='blocks cannot be empty', required=True)
        parser.add_argument('ad-userid', location='headers', type=str, help='userid cannot be empty', required=True)

        args    = parser.parse_args()
        try:
            blocks = ast.literal_eval(args['blocks'])
        except expression as identifier:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400
        
        result  = FileContentRepositories.update(args['ad-userid'], None, blocks)

        if result == False:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400
        res = CustomResponse(Status.SUCCESS.value, result, None)
        return res.getres()