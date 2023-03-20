from utilities import MODULE_CONTEXT
from db import get_db
from utilities import UserUtils, OrgUtils
from anuvaad_auditor.loghandler import log_info, log_exception
from anuvaad_auditor.errorhandler import post_error
import bcrypt
import jwt
import datetime
from utilities import UserUtils
import time
import config
from config import USR_TOKEN_MONGO_COLLECTION, USR_MONGO_COLLECTION, USR_TEMP_TOKEN_MONGO_COLLECTION

admin_role_key      =   config.ADMIN_ROLE_KEY
super_admin_role_key = config.SUPER_ADMIN_ROLE_KEY

class UserAuthenticationModel(object):

    def user_login(self,user_name, password):
        """User Login

        fetching token from db for previously logged in user,
        validating the token,
        generating new token in case of new user or expired token.
        """

        try:
            #searching for token against the user_name
            token_available = UserUtils.get_token(user_name)

            if token_available["status"] == False:
                log_info("Generating new token for {}".format(user_name), MODULE_CONTEXT)
                #issuing new token
                new_token   =   UserUtils.generate_token({"user_name":user_name, "password":password},USR_TOKEN_MONGO_COLLECTION)
                #dict value is returned if generate_token returned error
                if isinstance(new_token,dict):
                    log_info("Failed to generate new token for {}".format(user_name), MODULE_CONTEXT)
                    return new_token
                else:
                    return_data = {
                        "userName": user_name,
                        "token": new_token.decode("UTF-8")}
                    return return_data

            elif token_available["status"] == True:
                log_info("Returning back existing token for {}".format(user_name), MODULE_CONTEXT)
                token = token_available["data"]
                return_data = {
                    "userName": user_name,
                    "token": token}
                return return_data
        except Exception as e:
            log_exception("Database connection exception ",  MODULE_CONTEXT, e)
            return post_error("Database  exception", "An error occurred while processing on the database:{}".format(str(e)), None)


    def user_logout(self,user_name):
        """User Logout
        
        updating active status to False on user token collection.
        """

        try:
            #connecting to mongo instance/collection
            collections = get_db()[USR_TOKEN_MONGO_COLLECTION]
            #fetching user data
            record = collections.find({"user": user_name, "active": True})
            if record.count() == 0:
                return False
            if record.count() != 0:
                for user in record:
                    #updating status = False for user token collection
                    collections.update(user, {"$set": {"active": False, "end_time": eval(
                        str(time.time()).replace('.', '')[0:13])}})
                    log_info("Updated database record on user log out for {}".format(user_name), MODULE_CONTEXT)
                return True
        except Exception as e:
            log_exception("Database connection exception ",  MODULE_CONTEXT, e)
            return post_error("Database connection exception", "An error occurred while connecting to the database:{}".format(str(e)), None)


    def token_search(self,token,temp):
        """Token search for user details"""

        try:
            log_info("searching for the user, using token", MODULE_CONTEXT)
            result = UserUtils.get_user_from_token(token,temp)
            return result

        except Exception as e:
            log_exception("Database connection exception ",  MODULE_CONTEXT, e)
            return post_error("Database connection exception", "An error occurred while connecting to the database:{}".format(str(e)), None)

  
    def forgot_password(self,user_name):
        """Generaing forgot password notification"""

        #generating random id
        rand_id=UserUtils.generate_user_id()
        #connecting to mongo instance/collection
        collections = get_db()[USR_TEMP_TOKEN_MONGO_COLLECTION]
        #inserting new id generated onto temporary token collection
        collections.insert({"user": user_name, "token": rand_id, "start_time": datetime.datetime.utcnow()})
        #generating email notification
        result = UserUtils.generate_email_reset_password(user_name,rand_id)
        if result is not None:
            return result
        return True
    

    def reset_password(self,user_id,user_name,password):
        """Resetting password
        
        an active user can reset their own password,
        admin can reset password of any active users.
        """
        
        #generating password hash
        hashed = UserUtils.hash_password(password).decode("utf-8")
        try:
            #connecting to mongo instance/collection
            collections = get_db()[USR_MONGO_COLLECTION]
            #searching for valid record matching given user_id
            record = collections.find({"userID": user_id})
            if record.count() != 0:
                log_info("Record found matching the userID {}".format(user_id), MODULE_CONTEXT)
                for user in record:
                    #fetching the user roles
                    roles=[ rol['roleCode'] for rol in user["roles"] ] 
                    #converting roles to upper keys
                    role_keys=[x.upper() for x in roles]
                    #fetching user name
                    username=user["userName"]
                #verifying the requested person, both admin and user can reset password   
                if (admin_role_key in role_keys) or (username == user_name) or (super_admin_role_key in role_keys):
                    log_info("Reset password request is checked against role permission and username", MODULE_CONTEXT)
                    results = collections.update({"userName":user_name,"is_active":True}, {"$set": {"password": hashed}})
                    if 'writeError' in list(results.keys()):
                        return post_error("Database error", "writeError whie updating record", None)
                    return True
            else:
                log_info("No record found matching the userID {}".format(user_id), MODULE_CONTEXT)
                return post_error("Data Not valid","Invalid Credential",None)              
        except Exception as e:
            log_exception("Database  exception ",  MODULE_CONTEXT, e)
            return post_error("Database exception", "Exception:{}".format(str(e)), None)         

  
    def verify_user(self,user_email,user_id):
        """User verification and activation."""

        try:
            #connecting to mongo instance/collection
            collections = get_db()[USR_MONGO_COLLECTION]
            #checking for pre-verified records on the same username 
            primary_record= collections.find({"userName": user_email,"is_verified": True})
            if primary_record.count()!=0:
                log_info("{} is already a verified user".format(user_email), MODULE_CONTEXT) 
                return post_error("Not allowed","This user already have a verified account",None)
            #fetching user record matching userName and userID
            record = collections.find({"userName": user_email,"userID":user_id})
            if record.count()==0:
                log_info("No database records found for activation of {}".format(user_email), MODULE_CONTEXT)
                return post_error("Data Not valid","No records matching the given parameters ",None)
            if record.count() ==1:
                for user in record:
                    results = collections.update(user, {"$set": {"is_verified": True,"is_active":True,"activated_time":eval(str(time.time()))}})
                    if 'writeError' in list(results.keys()):
                            return post_error("db error", "writeError whie updating record", None)
                    log_info("Record updated for {}, activation & verification statuses are set to True".format(user_email), MODULE_CONTEXT)
            else:
                return post_error("Data Not valid","Somehow there exist more than one record matching the given parameters ",None)             
        except Exception as e:
            log_exception("db  exception ",  MODULE_CONTEXT, e)
            return post_error("Database exception", "Exception:{}".format(str(e)), None)


    def activate_deactivate_user(self,user_email,status,rem_user,verify_user):
        """"Resetting activation status of verified users"""

        try:
            #connecting to mongo instance/collection
            collections = get_db()[USR_MONGO_COLLECTION]
            #searching for a verified account for given username
            record = collections.find({"userName": user_email,"is_verified":True})
            if record.count()==0:
                if verify_user !=None:
                    record1 = collections.find({"userName": user_email,"is_active":False})
                    if record1.count() == 1:
                        results = collections.update({"userName": {"$exists":True,"$in":[user_email]}}, {"$set": {"is_verified": True}})
                        log_info("{} the user is verified".format(user_email), MODULE_CONTEXT)
                log_info("{} is not a verified user".format(user_email), MODULE_CONTEXT)
                return post_error("Data Not valid","Not a verified user",None)
            if record.count() ==1:
                for user in record:
                    #validating the org where user belongs to
                    validity=OrgUtils.validate_org(user["orgID"])
                    if validity is not None:
                        log_info("{} belongs to an inactive org {}, hence operation failed".format(user_email,user["orgID"]), MODULE_CONTEXT)
                        return validity
                    
                    if rem_user != None:
                        results = collections.delete_one({"userID":rem_user}) # remove user from the system only superadmin 
                    else:
                        results = collections.update(user, {"$set": {"is_active": status}}) #updating active status on database

                        if 'writeError' in list(results.keys()):
                            log_info("Status updation on database failed due to writeError", MODULE_CONTEXT)
                            return post_error("db error", "writeError whie updating record", None)
                    log_info("Status updation on database successful", MODULE_CONTEXT)
            else:
                return post_error("Data Not valid","Somehow there exist more than one record matching the given parameters ",None)               
        except Exception as e:
            log_exception("Database  exception ",  MODULE_CONTEXT, e)
            return post_error("Database exception", "Exception:{}".format(str(e)), None)
           
           
