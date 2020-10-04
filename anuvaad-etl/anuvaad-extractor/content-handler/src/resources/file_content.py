from flask_restful import fields, marshal_with, reqparse, Resource
from repositories import SentenceRepositories, FileContentRepositories
from models import CustomResponse, Status
import ast



class FileContentResource(Resource):
    def post(self, user_id):
        parser = reqparse.RequestParser(bundle_errors=True)
        parser.add_argument('file_locale', location='json', type=str, help='file_locale cannot be empty', required=True)
        parser.add_argument('record_id', location='json', type=str, help='record_id cannot be empty', required=True)
        parser.add_argument('pages', location='json', type=str, help='pages cannot be empty', required=True)

        args    = parser.parse_args()
        if FileContentRepositories.store(user_id, args['file_locale'], args['record_id'], ast.literal_eval(args['pages'])) == False:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value,None)
            return res.getresjson(), 400
        res = CustomResponse(Status.SUCCESS.value, None)
        return res.getres()

    def get(self, user_id, record_id):

        parser = reqparse.RequestParser()
        parser.add_argument('offset', type=int, help='offset can be 0, set limit & offset as 0 to get entire document', required=True)
        parser.add_argument('limit',  type=int, help='limit can be 0, set limit & offset as 0 to get entire document ', required=True)

        args    = parser.parse_args()
        if FileContentRepositories.get(user_id, record_id, args['offset'], args['limit']) == False:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value,None)
            return res.getresjson(), 400
        res = CustomResponse(Status.SUCCESS.value, None)
        return res.getres()
        