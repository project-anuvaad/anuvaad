from flask_restful import Resource
from repositories import UserAuthenticationRepositories
from models import CustomResponse, Status
from utilities import UserUtils
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
from flask import request
from anuvaad_auditor.errorhandler import post_error

authRepo = UserAuthenticationRepositories()

class UserLogin(Resource):

    def post(self):
        body = request.get_json()
        if "userName" not in body or not body["userName"]:
            return post_error("Data Missing","userName not found",None), 400
        if "password" not in body or not body["password"]:
            return post_error("Data Missing","password not found",None), 400
        
        user_name = body["userName"]
        password = body["password"]
        log_info("Request for login from {}".format(user_name),MODULE_CONTEXT)

        validity=UserUtils.validate_user_login_input(user_name, password)
        if validity is not None:
            log_info("Login credentials check failed for {}".format(user_name),MODULE_CONTEXT)
            return validity, 400
        log_info("Login credentials check passed for {}".format(user_name),MODULE_CONTEXT)
        try:
            result = authRepo.user_login(user_name, password)
            if "errorID" in result :
                log_info("Login failed for {}".format(user_name),MODULE_CONTEXT)
                res = CustomResponse(Status.FAILURE_USR_LOGIN.value, None)
                return res.getresjson(), 400
            log_info("Login successful for {}".format(user_name),MODULE_CONTEXT)
            res = CustomResponse(Status.SUCCESS_USR_LOGIN.value, result)
            return res.getresjson(), 200
        except Exception as e:
            log_exception("Exception while  user login: " + str(e), MODULE_CONTEXT, e)
            return post_error("Exception occurred", "Exception while performing user login", None), 400            


class UserLogout(Resource):

    def post(self):
        body = request.get_json()
        if "userName" not in body or not body["userName"]:
            return post_error("Data Missing","userName not found",None), 400
        user_name = body["userName"]

        log_info("Request for logout from {}".format(user_name),MODULE_CONTEXT)
        try:
            result = authRepo.user_logout(user_name)
            if result == False:
                log_info("Logout failed for {}".format(user_name),MODULE_CONTEXT)
                res = CustomResponse(
                    Status.FAILURE_USR_LOGOUT.value, None)
                return res.getresjson(), 400
            else:
                log_info("{} logged out successfully".format(user_name),MODULE_CONTEXT)
                res = CustomResponse(Status.SUCCESS_USR_LOGOUT.value, None)
            return res.getres()
        except Exception as e:
            log_exception("Exception while logout: " + str(e), MODULE_CONTEXT, e)
            return post_error("Exception occurred", "Exception while performing user logout", None), 400
            


class AuthTokenSearch(Resource):

    def post(self):
        body = request.get_json()    
        if "token" not in body or not body["token"]:
            return post_error("Data Missing","token not found",None), 400
        token = body["token"]
        if len(token.split('.')) ==3:
            log_info("Request received for auth-token search",MODULE_CONTEXT)
            #temp = False for auth-token search
            temp = False
            #validating token
            log_info("Validating auth-token search request",MODULE_CONTEXT)
            validity=UserUtils.token_validation(token)
            if validity is not None:
                log_info("Auth-token search failed, token expired",MODULE_CONTEXT)
                return validity, 400
        else:
            log_info("Token search request received for password resetting",MODULE_CONTEXT)
            #temp = True on token search for password reset 
            temp = True

        try:
            result = authRepo.token_search(token,temp)
            if "errorID" in result:
                log_info("Auth-token search request failed",MODULE_CONTEXT)
                return result, 400
            else:
                log_info("Auth-token search request successsful",MODULE_CONTEXT)
                res = CustomResponse(Status.SUCCESS_USR_TOKEN.value, result)
            return res.getres()
        except Exception as e:
            log_exception("Exception while auth-token search: " + str(e), MODULE_CONTEXT, e)
            return post_error("Exception occurred", "Exception while performing user creation", None), 400
            

class ForgotPassword(Resource):
        
    def post(self):
        body = request.get_json()
        if "userName" not in body or not body["userName"]:
            return post_error("Data Missing","userName not found",None), 400
        user_name = body["userName"]

        log_info("Request received for reset password link from {}".format(user_name),MODULE_CONTEXT)
        validity = UserUtils.validate_username(user_name)
        if validity is not None:
            log_info("Username/email validation failed  for generating reset password notification for {}".format(user_name), MODULE_CONTEXT)
            return validity, 400
        log_info("Username/email is validated for generating reset password notification for {}".format(user_name), MODULE_CONTEXT)
        try:
            result = authRepo.forgot_password(user_name)
            if result == True:
                log_info("Successfully generated reset-password link for {}".format(user_name),MODULE_CONTEXT)
                res = CustomResponse(
                        Status.SUCCESS_FORGOT_PWD.value, None)
                return res.getresjson(), 200
            else:
                log_info("Failed to generate reset-password link for {}".format(user_name),MODULE_CONTEXT)
                return result, 400
        except Exception as e:
            log_exception("Exception while forgot password api call: " + str(e), MODULE_CONTEXT, e)
            return post_error("Exception occurred", "Exception while forgot password api call:{}".format(str(e)), None), 400
            

class ResetPassword(Resource):

    def post(self):
        
        body = request.get_json()
        if "userName" not in body or not body["userName"]:
            return post_error("Data Missing","userName not found",None), 400
        if "password" not in body or not body["password"]:
            return post_error("Data Missing","Password not found",None), 400

        user_id=request.headers["x-user-id"]
        user_name = body["userName"]
        password = body["password"]
        
        log_info("Request received for password resetting from {}".format(user_name),MODULE_CONTEXT)
        if not user_id:
            return post_error("userId missing","userId is mandatory",None), 400
        
        validity = UserUtils.validate_username(user_name)
        if validity is not None:
            log_info("Username/email validation failed on reset password for {}".format(user_name), MODULE_CONTEXT)
            return validity, 400
        log_info("Username/email is validated on reset password for {}".format(user_name), MODULE_CONTEXT)
        pwd_validity=UserUtils.validate_password(password)
        if pwd_validity is not None:
            log_info("Password check failed on reset password for {}".format(user_name), MODULE_CONTEXT)
            return pwd_validity, 400
        log_info("Password check passed on resetting password for {}".format(user_name), MODULE_CONTEXT)
            
        try:
            result = authRepo.reset_password(user_id,user_name,password)
            if result == True:
                log_info("Reset password successful for {}".format(user_name), MODULE_CONTEXT)
                res = CustomResponse(
                        Status.SUCCESS_RESET_PWD.value, None)
                return res.getresjson(), 200
            else:
                return result, 400
        except Exception as e:
            log_exception("Exception while forgot password api call: " + str(e), MODULE_CONTEXT, e)
            return post_error("Exception occurred", "Exception while reset password api call:{}".format(str(e)), None), 400


class VerifyUser(Resource):

    def post(self):
        body = request.get_json()
        if "userName" not in body or not body["userName"]:
            return post_error("Data Missing","userName not found",None), 400
        if "userID" not in body or not body["userID"]:
            return post_error("Data Missing","userID not found",None), 400
        user_email = body["userName"]
        user_id = body["userID"]

        log_info("Request received for user verification of {}".format(user_email),MODULE_CONTEXT)
        try:
            result = authRepo.verify_user(user_email,user_id)
            if result is not None:
                log_info("User verification for {} failed".format(user_email),MODULE_CONTEXT)
                return result, 400
            else:
                log_info("User verification for {} successful".format(user_email),MODULE_CONTEXT)
                res = CustomResponse(
                        Status.SUCCESS_ACTIVATE_USR.value, None)
                return res.getresjson(), 200        
        except Exception as e:
            log_exception("Exception while user verification: " + str(e), MODULE_CONTEXT, e)
            return post_error("Exception occurred", "Exception while Activate user api call:{}".format(str(e)), None), 400


class ActivateDeactivateUser(Resource):

    def post(self):
        body = request.get_json()
        if "userName" not in body or not body["userName"]:
            return post_error("Data Missing","userName not found",None), 400
        if "is_active" not in body:
            return post_error("Data Missing","is_active not found",None), 400
        user_email = body["userName"]
        status= body["is_active"]

        if not isinstance(status,bool):
            return post_error("Invalid format", "is_active status should be either true or false", None), 400
        log_info("Request received for updating activation status of {}".format(user_email),MODULE_CONTEXT)
        try:
            result = authRepo.activate_deactivate_user(user_email,status)
            if result is not None:
                log_info("Updation of activation status for {} failed".format(user_email),MODULE_CONTEXT)
                return result, 400
            else:
                log_info("Updation of activation status for {} successful".format(user_email),MODULE_CONTEXT)
                res = CustomResponse(Status.SUCCESS.value, None)
                return res.getresjson(), 200           
        except Exception as e:
            log_exception("Exception while activate/deactivate user api call: " + str(e), MODULE_CONTEXT, e)
            return post_error("Exception occurred", "Exception while deactivate user api call:{}".format(str(e)), None), 400
