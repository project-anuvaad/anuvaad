from flask_restful import Resource
from repositories import UserManagementRepositories
from models import CustomResponse, Status
from utilities import UserUtils, MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
from flask import request, jsonify
from anuvaad_auditor.errorhandler import post_error
import config

userRepo    =   UserManagementRepositories()

class CreateUsers(Resource):

    def post(self):
        body = request.get_json()
        if 'users' not in body or not body['users']:
            return post_error("Data Missing", "users not found", None), 400

        users = body['users']
        log_info("Creation request received for {} user/s".format(len(users)), MODULE_CONTEXT)  
        log_info("User/s validation started", MODULE_CONTEXT)
        for i,user in enumerate(users):
            validity = UserUtils.validate_user_input_creation(user)
            if validity is not None:
                log_info("User validation failed for user{}".format(i+1), MODULE_CONTEXT)
                return validity, 400
        log_info("Users are validated", MODULE_CONTEXT)

        try:
            result = userRepo.create_users(users)
            if result is not None:
                log_info("User creation failed | {}".format(str(result)), MODULE_CONTEXT)
                return result, 400   
            else:
                res = CustomResponse(Status.SUCCESS_USR_CREATION.value, None)
                log_info("User creation successful", MODULE_CONTEXT)
                return res.getresjson(), 200
        except Exception as e:
            log_exception("Exception while creating user records: " +
                          str(e), MODULE_CONTEXT, e)
            return post_error("Exception occurred", "Exception while performing user creation:{}".format(str(e)), None), 400


class UpdateUsers(Resource):

    def post(self):
        body = request.get_json()
        if 'users' not in body or not body['users']:
            return post_error("Data Missing", "users not found", None), 400

        users = body['users']
        log_info("Updation request received for {} user/s".format(len(users)), MODULE_CONTEXT)
        log_info("User/s validation started", MODULE_CONTEXT)
        for i,user in enumerate(users):
            validity = UserUtils.validate_user_input_updation(user)
            if validity is not None:
                log_info("User validation failed for user{}".format(i+1), MODULE_CONTEXT)
                return validity, 400
        log_info("Users are validated", MODULE_CONTEXT)

        try:
            result = userRepo.update_users(users)
            if result== True:
                log_info("User/s updation successful", MODULE_CONTEXT)
                res = CustomResponse(Status.SUCCESS_USR_UPDATION.value, None)
                return res.getresjson(), 200
            else:
                log_info("User updation failed | {}".format(str(result)), MODULE_CONTEXT)
                return result, 400

        except Exception as e:
            log_exception("Exception while updating user records: " +
                          str(e), MODULE_CONTEXT, e)
            return post_error("Exception occurred", "Exception while performing user updation:{}".format(str(e)), None), 400


class SearchUsers(Resource):

    def post(self):
        user_ids = []
        user_names = []
        role_codes = []
        org_codes = []
        offset = None
        limit_value = None
        skip_pagination=None

        body = request.get_json()
        if "userIDs" in body:
            user_ids    =   body['userIDs']
        if "userNames" in body:
            user_names  =   body['userNames']
        if "roleCodes" in body:
            role_codes  =   body['roleCodes']
        if "orgCodes" in body:
            org_codes   =   body['orgCodes']
        if "offset" in body:
            offset      =   body['offset']
        if "limit" in body:
            limit_value =   body['limit']      
        if "skip_pagination" in body:
            skip_pagination=body['skip_pagination']
        
        log_info("User/s search request received | {}".format(str(body)), MODULE_CONTEXT)
        
        if not user_ids and not user_names and not role_codes and not org_codes and not offset and not limit_value:
            offset      =   config.OFFSET_VALUE
            limit_value =   config.LIMIT_VALUE
        try:
            result = userRepo.search_users(user_ids, user_names, role_codes,org_codes,offset,limit_value,skip_pagination)
            log_info("User/s search successful", MODULE_CONTEXT)
            if result == None:
                log_info("No users matching the search criterias", MODULE_CONTEXT)
                res = CustomResponse(Status.EMPTY_USR_SEARCH.value, None)
                return res.getresjson(), 200
            res = CustomResponse(Status.SUCCESS_USR_SEARCH.value, result[0],result[1])
            return res.getresjson(), 200
        except Exception as e:
            log_exception("Exception while searching user records: " +
                          str(e), MODULE_CONTEXT, e)
            return post_error("Exception occurred", "Exception while performing user search:{}".format(str(e)), None), 400


class OnboardUsers(Resource):

    def post(self):
        body = request.get_json()
        if 'users' not in body or not body['users']:
            return post_error("Data Missing", "users not found", None), 400
        users = body['users']
        log_info("Request received for onboarding {} user/s".format(len(users)), MODULE_CONTEXT)
        log_info("User/s validation started", MODULE_CONTEXT)
        for i,user in enumerate(users):
            validity = UserUtils.validate_user_input_creation(user)
            if validity is not None:
                log_info("User validation failed for user{}".format(i+1), MODULE_CONTEXT)
                return validity, 400
            log_info("Users are validated", MODULE_CONTEXT)
        try:
            result = userRepo.onboard_users(users)
            if result is not None:
                log_info("User/s onboarding failed | {}".format(str(result)), MODULE_CONTEXT)
                return result, 400              
            else:
                log_info("User/s onboarding successful", MODULE_CONTEXT)
                res = CustomResponse(Status.SUCCESS_USR_ONBOARD.value, None)
                return res.getresjson(), 200
        except Exception as e:
            log_exception("Exception while creating user records for users on-boarding: " + str(e), MODULE_CONTEXT, e)
            return post_error("Exception occurred", "Exception while performing users on-boarding::{}".format(str(e)), None), 400


class SearchRoles(Resource):

    def get(self):
        try:
            log_info("Request for role search received", MODULE_CONTEXT)
            result = userRepo.get_roles()
            if "errorID" in result:
                log_info("Role search failed", MODULE_CONTEXT)
                return result, 400
            else:
                log_info("Role search successful", MODULE_CONTEXT)
                res = CustomResponse(Status.SUCCESS_ROLE_SEARCH.value, result)
                return res.getresjson(), 200
        except Exception as e:
            log_exception("Exception while searching user records: " +
                          str(e), MODULE_CONTEXT, e)
            return post_error("Exception occurred", "Exception while performing user search::{}".format(str(e)), None), 400


class Health(Resource):
    def get(self):
        response = {"code": "200", "status": "ACTIVE"}
        return jsonify(response)
    

class UpdateEmail(Resource):
    def post(self):
        try:
            body = request.get_json()
            if 'new_email' not in body or not body['new_email']:
                return post_error("Data Missing", "new_email not found", None), 400
            if 'userName' not in body or not body['userName']:
                return post_error("Data Missing", "userName not found", None), 400
            if 'password' not in body or not body['password']:
                return post_error("Data Missing", "password not found", None), 400

            log_info("Request for change of email received", MODULE_CONTEXT)
            new_email, username, password = body['new_email'], body['userName'], body['password']
            
            # check for username, password
            result = UserUtils.validate_user_login_input(username, password)
            if result is not None:
                log_info("credentials check failed for {}".format(username),MODULE_CONTEXT)
                return result, 400
            
            # validate if email is correct
            validity = UserUtils.validate_email(new_email)
            if not validity:
                log_info("new_email is not valid email",MODULE_CONTEXT)
                return post_error("Invalid Email", "provided email is an invalid email"), 400
            
            # change email
            result = userRepo.change_email(username,new_email)
            if 'errorID' in result.keys():
                return result, 400
            log_info("Request for email status successfull", MODULE_CONTEXT)
            res = CustomResponse(Status.SUCCESS_CHANGE_EMAIL.value, result)
            return res.getresjson(), 200
        except Exception as e:
            log_exception("Exception while getting status for email_change: " +
                          str(e), MODULE_CONTEXT, e)
            return post_error("Exception occurred", "Exception while getting email_change status::{}".format(str(e)), None), 400


