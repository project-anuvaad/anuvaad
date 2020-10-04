from flask_restful import fields, marshal_with, reqparse, Resource
from repositories import SentenceRepositories, FileContentRepositories
from models import CustomResponse, Status
import ast

class FileContentPOSTResource(Resource):
    def post(self, user_id):
        parser = reqparse.RequestParser(bundle_errors=True)
        parser.add_argument('file_locale', location='json', type=str, help='file_locale cannot be empty', required=True)
        parser.add_argument('record_id', location='json', type=str, help='record_id cannot be empty', required=True)
        parser.add_argument('pages', location='json', type=str, help='pages cannot be empty', required=True)

        args    = parser.parse_args()
        try:
            pages = ast.literal_eval(args['pages'])
        except expression as identifier:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value,None)
            return res.getresjson(), 400

        if FileContentRepositories.store(user_id, args['file_locale'], args['record_id'], pages) == False:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value,None)
            return res.getresjson(), 400
        res = CustomResponse(Status.SUCCESS.value, None)
        return res.getres()

class FileContentGETResource(Resource):
    def get(self, user_id, record_id):

        parser = reqparse.RequestParser()
        parser.add_argument('start_page', type=int, help='start_page can be 0, set start_page & end_page as 0 to get entire document', required=True)
        parser.add_argument('end_page',  type=int, help='end_page can be 0, set start_page & end_page as 0 to get entire document', required=True)

        args    = parser.parse_args()
        result  = FileContentRepositories.get(user_id, record_id, args['start_page'], args['end_page'])

        if result == False:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400
        res = CustomResponse(Status.SUCCESS.value, result, result['total'])
        return res.getres()
        