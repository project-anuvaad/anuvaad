from flask_restful import Resource
from repositories import ExtensionRepositories
from models import CustomResponse, Status
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
from flask import request
from anuvaad_auditor.errorhandler import post_error
from utilities import UserUtils

exRepo    =   ExtensionRepositories()

class GenerateIdToken(Resource):

    def post(self):
        body = request.get_json()
        if 'id_token' not in body or not body['id_token']:
            return post_error("Data Missing", "id_token not found", None), 400

        id_token = body["id_token"]
        log_info(f"token request received: {id_token}, from web extension", MODULE_CONTEXT) 
        token_parsed = id_token.split(':')
        id_token = UserUtils.decrypt_token(token_parsed[0],token_parsed[1])
        log_info(id_token,MODULE_CONTEXT)
        if id_token is None:
            log_info("Token decryption failed!",MODULE_CONTEXT)
            return post_error("Invalid token","Token decryption failed",None), 400
        request_id = UserUtils.validate_extension_usr_token(id_token)
        if request_id is None:
            log_info("Token received is not in proper format!",MODULE_CONTEXT)
            return post_error("Invalid token","Token expired",None), 400

        log_info(f"Parsed RequestID : {request_id}", MODULE_CONTEXT)  
        try:
            result = exRepo.register_request(request_id)
            if "errorID" in result:
                log_info(f"token request for {request_id} failed | {result}", MODULE_CONTEXT)
                return result, 400   
            else:
                res = CustomResponse(Status.SUCCESS.value, result)
                log_info(f"token request for {request_id} successful", MODULE_CONTEXT)
                return res.getresjson(), 200
        except Exception as e:
            log_exception("Exception while token request for web extension user: " +
                          str(e), MODULE_CONTEXT, e)
            return post_error("Exception occurred", "Exception while token request for web extension user:{}".format(str(e)), None), 400