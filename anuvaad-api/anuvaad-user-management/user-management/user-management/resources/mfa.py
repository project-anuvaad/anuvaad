from flask_restful import Resource
from repositories import MFARepositories
from models import CustomResponse, Status
from utilities import MFAUtils, UserUtils, MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
from flask import request, jsonify
from anuvaad_auditor.errorhandler import post_error
import config

mfaRepo    =   MFARepositories()

class RegisterMFA(Resource):
    def post(self):
        body = request.get_json()
        if 'userName' not in body or not body['userName']:
            return post_error("Data Missing", "userName not found", None), 400
        if 'mfaType' not in body or not body['mfaType']:
            return post_error("Data Missing", "mfaType not found", None), 400
        if 'session_id' not in body or not body['session_id']:
            return post_error("Data Missing", "session_id not found", None), 400
        
        username, mfa_type, session_id = body['userName'], body['mfaType'], body['session_id']
        log_info(f"MFA Registration request received for {username=}", MODULE_CONTEXT)  

        # check for user validity
        log_info("MFA Registration (user-check) started", MODULE_CONTEXT)
        mfa_validity = UserUtils.validate_username(username,get_email=True)
        log_info("MFA Registration (user-check) ended", MODULE_CONTEXT)
        if 'email' not in mfa_validity.keys():
            return post_error(mfa_validity['code'], mfa_validity['message'],""), 400
        
        # check for session_id validity
        log_info("MFA Registration (session_id_validity) started", MODULE_CONTEXT)
        session_validity = mfaRepo.check_mfa_active(username,session_id)
        log_info("MFA Registration (session_id_validity) ended", MODULE_CONTEXT)
        if session_validity in [None,True]:
            log_info(f"Invalid session_id for {username=}", MODULE_CONTEXT)
            return post_error("Invalid session_id", "session_id is invalid. please relogin", None), 400 
        
        # check if mfa exists
        log_info("MFA Registration (availability-check) started", MODULE_CONTEXT)
        mfa_status = mfaRepo.check_mfa_registration(username)
        log_info("MFA Registration (availability-check) ended", MODULE_CONTEXT)
        if mfa_status:
            msg = f"MFA is alreay exits for {username=} , if forgotten. please reset it"
            log_info(msg, MODULE_CONTEXT)
            return post_error("MFA exists!", msg, None), 400
        
        # check for valid mfa type
        mfa_type = mfa_type.strip().upper()
        if mfa_type not in config.MFA_SUPPORTED_TYPES:
            log_info(f"invalid mfa_type provided | {mfa_type=}", MODULE_CONTEXT)  
            return post_error("Invalid MFA type", "Given MFA type is not supported.", None), 400

        # new mfa registration
        log_info("MFA Registration (new creation) started", MODULE_CONTEXT)
        result = mfaRepo.register_mfa(username,mfa_type,mfa_validity["email"])
        log_info("MFA Registration (new creation) ended", MODULE_CONTEXT)
        
        # custom response
        log_info("MFA Registration Successfull.", MODULE_CONTEXT)
        res = CustomResponse(Status.SUCCESS_MFA_REGISTER.value, result)
        return res.getresjson(), 200

class VerifyMFA(Resource):
    def post(self):
        body = request.get_json()
        if 'userName' not in body or not body['userName']:
            return post_error("Data Missing", "userName not found", None), 400
        if 'authOTP' not in body or not body['authOTP']:
            return post_error("Data Missing", "authOTP not found", None), 400
        if 'session_id' not in body or not body['session_id']:
            return post_error("Data Missing", "session_id not found", None), 400
        username, auth_otp, session_id = body["userName"], body["authOTP"], body["session_id"]
        useHOTP = False
        if 'useHOTP' in body and body['useHOTP']:
            useHOTP = True
        log_info(f"MFA Verification request received for {username=}", MODULE_CONTEXT)  
        # check if mfa exists
        log_info("MFA Registration (availability-check) started", MODULE_CONTEXT)
        mfa_status = mfaRepo.check_mfa_registration(username)
        log_info("MFA Registration (availability-check) ended", MODULE_CONTEXT)
        if not mfa_status:
            msg = f"MFA is not registerd for {username=} , please register first."
            log_info(msg, MODULE_CONTEXT)
            return post_error("MFA does not exists!", msg, None), 400
        
        # check if session is active
        active_sts = mfaRepo.check_mfa_active(username,session_id)
        if active_sts in [None,True]:
            log_info(f"MFA is already verified for {username=}", MODULE_CONTEXT)
            return post_error("MFA already verified", "MFA is verified.please relogin again", None), 400 
        
        # verify the otp using mfa_type 
        result = mfaRepo.verify_mfa(username,auth_otp, useHOTP)
        if 'errorID' in result.keys():
            log_info(f"MFA verification error for {username=} | msg: {result['message']}", MODULE_CONTEXT)
            return result, 400 
        
        res = CustomResponse(Status.SUCCESS_MFA_VERIFY.value, result)
        log_info(f"MFA Verification Successfull for {username=}", MODULE_CONTEXT)  
        return res.getresjson(), 200

class ResetMFA(Resource):
    def post(self):
        body = request.get_json()
        if "userName" not in body or not body["userName"]:
            return post_error("Data Missing","userName not found",None), 400
        
        username = body["userName"]
        log_info(f"MFA Reset Request start for {username=}",MODULE_CONTEXT)
        
        # validate user_id with username 
        userid = request.headers.get('x-user-id')
        log_info(f"MFA Reset Request x-user-id is {userid}",MODULE_CONTEXT)
        result = mfaRepo.validate_userid_with_username(userid,username)
        if not result:
            log_info(f"MFA Reset Request UserID invalid",MODULE_CONTEXT)
            return post_error("Invalid userId", "UserId and UserName did not match", None), 400 
        
        # reset mfa
        result = mfaRepo.reset_mfa(username)
        if "errorID" in result :
            return result, 400
        
        log_info(f"MFA Reset Request end for {username=}",MODULE_CONTEXT)
        res = CustomResponse(Status.SUCCESS_MFA_RESET.value, result)
        return res.getresjson(), 200