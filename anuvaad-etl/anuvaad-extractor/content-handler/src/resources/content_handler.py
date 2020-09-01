from flask_restful import fields, marshal_with, reqparse, Resource
from flask import request
from models.response import CustomResponse
from models.status import Status
import werkzeug
from flask import send_file
import os
import config
import logging
import uuid
from datetime import datetime
from models.file_content import FileContent
import json

parser = reqparse.RequestParser(bundle_errors=True)

class ContentHandler(Resource):

    def post(self):
        body = request.get_json()
        results = body['result']
        process_identifier = body['process_identifier']
        obj_to_be_saved = []
        for result in results:
            page_data = {}
            page_data['page_no'] = result['page_no']
            page_data['page_width'] = result['page_width']
            page_data['page_height'] = result['page_height']
            if result['lines'] is not None:
                for data in result['lines']:
                    obj_to_be_saved = self.make_obj(process_identifier, page_data, data, config.TYPE_LINES, obj_to_be_saved)
            if result['tables'] is not None:
                for data in result['tables']:
                    obj_to_be_saved = self.make_obj(process_identifier, page_data, data, config.TYPE_TABLES, obj_to_be_saved)
            if result['images'] is not None:
                for data in result['images']:
                    obj_to_be_saved = self.make_obj(process_identifier, page_data, data, config.TYPE_IMAGES, obj_to_be_saved)
            if result['text_blocks'] is not None:
                for data in result['text_blocks']:
                    obj_to_be_saved = self.make_obj(process_identifier, page_data, data, config.TYPE_TEXT, obj_to_be_saved)
        file_content_instances = [FileContent(**data) for data in obj_to_be_saved]
        FileContent.objects.insert(file_content_instances)
        res = CustomResponse(Status.SUCCESS.value, '.pdf')
        return res.getres()


    def make_obj(self,process_identifier, page_data, data, data_type, obj_to_be_saved):
        data['page_info'] = page_data
        data['type'] = data_type
        data['created_on'] = datetime.now()
        data['process_identifier'] = process_identifier
        obj_to_be_saved.append(data)
        return obj_to_be_saved
        

