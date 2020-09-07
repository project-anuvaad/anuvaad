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
BLOCK_TYPES = config.BLOCK_TYPES

class ContentHandler(Resource):

    def post(self):
        body = request.get_json()
        userid = request.headers.get('userid')
        if 'pages' not in body or 'job_id' not in body or userid is None:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value,None)
            return res.getresjson(), 400
        results = body['pages']
        process_identifier = body['job_id']
        obj_to_be_saved = []
        for result in results:
            page_data = {}
            page_data['page_no'] = result['page_no']
            page_data['page_width'] = result['page_width']
            page_data['page_height'] = result['page_height']
            for block_type in BLOCK_TYPES:
                if result[block_type['key']] is not None:
                    for data in result[block_type['key']]:
                        obj_to_be_saved = self.make_obj(process_identifier, page_data, data, block_type['key'], obj_to_be_saved, userid)
        file_content_instances = [FileContent(**data) for data in obj_to_be_saved]
        FileContent.objects.insert(file_content_instances)
        res = CustomResponse(Status.SUCCESS.value, None)
        return res.getres()
        

    def make_obj(self,process_identifier, page_data, data, data_type, obj_to_be_saved, userid):
        obj = {}
        data['block_id'] = str(uuid.uuid4())+process_identifier
        data['job_id'] = process_identifier
        data['page_info'] = page_data
        obj['page_no'] = page_data['page_no']
        obj['data_type'] = data_type
        obj['created_on'] = datetime.now()
        obj['job_id'] = process_identifier
        obj['created_by'] = userid
        obj['data'] = data
        obj['block_id'] = data['block_id']
        obj_to_be_saved.append(obj)
        return obj_to_be_saved


class UpdateContentHandler(Resource):

    def post(self):
        body = request.get_json()
        userid = request.headers.get('ad-userid')
        if 'blocks' not in body or userid is None:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value,None)
            return res.getresjson(), 400
        blocks = body['blocks']
        obj_to_be_saved = []
        for block in blocks:
            if 'block_id' in block:
                file_content = FileContent.objects(block_id=block['block_id'])
                file_content.update(set__data=block)
        res = CustomResponse(Status.SUCCESS.value, None)
        return res.getres()


class FetchContentHandler(Resource):

    def get(self):
        parse = reqparse.RequestParser()
        parse.add_argument('job_id', type=str, location='args',help='Job Id is required', required=True)
        parse.add_argument('start_page', type=int, location='args',help='', required=False)
        parse.add_argument('end_page', type=int, location='args',help='', required=False)
        args = parse.parse_args()
        process_identifier = args['job_id']
        start_page = args['start_page']
        end_page = args['end_page']
        if start_page is None:
            start_page = 1
        if end_page is None:
            end_page = start_page
        userid = request.headers.get('ad-userid')
        output = {}
        pipeline = {
                '$group':
                    {
                        '_id': '$job_id',
                        'maxQuantity': { '$max': "$page_no" }
                    }
        }
        max_pages = FileContent.objects(job_id=process_identifier,created_by=userid).aggregate(pipeline)
        max_page_number = 1
        for max_page in max_pages:
            max_page_number = max_page['maxQuantity']
            break
        if end_page > max_page_number:
            end_page = max_page_number 
        if start_page > max_page_number:
            start_page = max_page_number
        pipeline_blocks = {
                '$group':
                    {
                        '_id': '$data_type',
                        'data': { '$push': "$data" }
                    }
        }
        output = []
        for i in range(start_page,end_page+1):
            blocks = FileContent.objects(job_id=process_identifier,page_no=i,created_by=userid).aggregate(pipeline_blocks)  
            obj = {}
            index = 0
            for block in blocks:
                if index == 0:
                   obj['page_height'] = block['data'][0]['page_info']['page_height']
                   obj['page_no'] = block['data'][0]['page_info']['page_no']
                   obj['page_width'] = block['data'][0]['page_info']['page_width']
                obj[block['_id']] = block['data']
                index+=1
            output.append(obj)
        res = CustomResponse(Status.SUCCESS.value, output, max_page_number)
        return res.getres()


    
        

