from flask_restful import fields, marshal_with, reqparse, Resource
#from flask_jwt_extended import (jwt_required,create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)
import werkzeug
from flask import send_file
import os
import logging
import uuid
import magic
from src.services.main import DocumentStructure

#ALLOWED_FILE_TYPES  = AppConfig.get_supported_upload_file_types()
parser              = reqparse.RequestParser(bundle_errors=True)
parser.add_argument('pdf_file_id', location='json', required=False)


class DocumentStructureResource(Resource):
    #@jwt_required
    def post(self):
        args              = parser.parse_args()
        print(args)
        response          = DocumentStructure(args ['pdf_file_id'] )

        return {
            'status': {
                'code' : 200,
                'message' : 'api successful'
            },
            'response': response
        }