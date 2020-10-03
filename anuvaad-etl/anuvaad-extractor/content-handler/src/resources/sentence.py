from flask_restful import fields, marshal_with, reqparse, Resource
from repositories import SentenceRepositories


class SentenceResource(Resource):
    def get(self, s_id):
        pass

    def post(self):
        args                = parser.parse_args()