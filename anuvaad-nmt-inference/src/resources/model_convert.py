from flask_restful import fields, marshal_with, reqparse, Resource
from flask import request
from repositories import SentenceRepositories, FileContentRepositories
from models import CustomResponse, Status
import ast
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception

class ModelConvertResource(Resource):
    def post(self):
        inputs = request.get_json(force=True)
        if len(inputs)>0:
        log_info("Making interactive-model-convert API call",MODULE_CONTEXT)
        out = interactive_translation.model_conversion(inputs)
        return jsonify(out)
    else:
        log_info("null inputs in request in interactive-translation API",MODULE_CONTEXT)
        return jsonify({'status':statusCode["INVALID_API_REQUEST"]})
    
    ####
        log_info("ModelConvertResource record_id {} for user {}".format(args['record_id'], args['userid']), MODULE_CONTEXT)

        try:
            pages = ast.literal_eval(args['pages'])
        except expression as identifier:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400

        if FileContentRepositories.store(args['userid'], args['file_locale'], args['record_id'], pages, args['src_lang'], args['tgt_lang']) == False:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400
        res = CustomResponse(Status.SUCCESS.value, None)
        return res.getres()
    