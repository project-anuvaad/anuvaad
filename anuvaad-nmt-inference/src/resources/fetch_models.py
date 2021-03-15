from flask_restful import Resource
from flask import request
from models import CustomResponse, Status,CreateModel
from flask import  request, jsonify
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
import config
import json

class FetchModelsResource(Resource):
    def get(self):
        log_info("FetchModelsResource api called",MODULE_CONTEXT)
        try:
            with open(config.FETCH_MODEL_CONFG) as f:
                confs = json.load(f)
                models = confs['data']
                out = CustomResponse(Status.SUCCESS.value, models)
            return out.getres() 
        except Exception as e:
            log_exception("Error in FetchModelsResource: {}".format(e),MODULE_CONTEXT,e)
            status = Status.SYSTEM_ERR.value
            status['why'] = str(e)
            out = CustomResponse(status, None)                  
            return out.getres()
    
class FetchModelsResource_v2(Resource):
    def get(self):
        log_info("FetchModelsResource_v2 api called",MODULE_CONTEXT)
        try:
            fetch_model = CreateModel.objects()
            i = fetch_model.to_json()
            json_data = json.loads(i)
            out = CustomResponse(Status.SUCCESS.value, json_data)
            return out.getresjson(),200
        except Exception as e:
            log_exception("Error in FetchModelsResource_v2: {}".format(e),MODULE_CONTEXT,e)
            status = Status.SYSTEM_ERR.value
            status['why'] = str(e)
            out = CustomResponse(status, None)                  
            return out.getresjson(),500

class FetchSingleModelResource(Resource):
    def get(self,id):
        log_info("FetchSingleModelResource api called",MODULE_CONTEXT)
        try:
            if request.method == 'GET':
                data = CreateModel.objects(uuid=id)
                if data.count()>0:
                    i = CreateModel.objects(uuid=id).to_json()
                    json_data = json.loads(i)
                    out = CustomResponse(Status.SUCCESS.value, json_data)
                    return out.getresjson(),200
                else:
                    out = CustomResponse(Status.No_File_DB.value, None)
                    return out.getresjson(),401
        except Exception as e:
            log_exception("Error in FetchSingleModelResource: {}".format(e),MODULE_CONTEXT,e)
            status = Status.SYSTEM_ERR.value
            status['why'] = str(e)
            out = CustomResponse(status, None)                  
            return out.getresjson(),500
         
class CreateModelResource(Resource):
    def post(self):
        log_info("CreateModelResource api called",MODULE_CONTEXT)
        try:
            if request.method=="POST":
                body = request.json
                if not bool(body):
                    out = CustomResponse(Status.INCOMPLETE_API_REQUEST.value, None)
                    return out.getresjson(),401  
                else:
                    data = CreateModel(**body).save()
                    i = data.to_json()
                    json_data = json.loads(i)
                    out = CustomResponse(Status.SUCCESS.value, json_data)
                    return out.getresjson(),200
        except Exception as e:
            log_exception("Error in CreateModelResource: {}".format(e),MODULE_CONTEXT,e)
            status = Status.SYSTEM_ERR.value
            status['why'] = str(e)
            out = CustomResponse(status, None)                  
            return out.getresjson(),500

class UpdateModelsResource(Resource):
    def post(self,id):
        log_info("UpdateModelsResource api called",MODULE_CONTEXT)
        try:
            body = request.json
            if request.method=='POST':
                check = CreateModel.objects(uuid=id)
                if not bool(body):
                    out = CustomResponse(Status.INCOMPLETE_API_REQUEST.value, None)
                    return out.getresjson(),401 
                elif check.count()>0:
                    update_model = CreateModel.objects(uuid=id).update(**body)
                    i = CreateModel.objects(uuid=id).to_json()
                    json_data = json.loads(i)
                    out = CustomResponse(Status.SUCCESS.value, json_data)
                    return out.getresjson(),200
                else:
                    out = CustomResponse(Status.No_File_DB.value, None)
                    return out.getresjson(),401
        except Exception as e:
            log_exception("Error in UpdateModelsResource: {}".format(e),MODULE_CONTEXT,e)
            status = Status.SYSTEM_ERR.value
            status['why'] = str(e)
            out = CustomResponse(status, None)                  
            return out.getresjson(),500

class DeleteModelResource(Resource):
    def post(self,id):
        log_info("DeleteModelResource api called",MODULE_CONTEXT)
        try:
            if request.method == 'POST':
                data = CreateModel.objects(uuid=id)
                if data.count()>0:
                    i = CreateModel.objects(uuid=id).delete()
                    out = CustomResponse(Status.SUCCESS.value, i)
                    return out.getres()
                else:
                    out = CustomResponse(Status.No_File_DB.value, None)
                    return out.getres()
        except Exception as e:
            log_exception("Error in DeleteModelResource: {}".format(ex),MODULE_CONTEXT,e)
            status = Status.SYSTEM_ERR.value
            status['why'] = str(e)
            out = CustomResponse(status, None)                  
            return out.getresjson(),500