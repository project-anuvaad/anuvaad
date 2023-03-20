from utilities import MODULE_CONTEXT
import utilities
from db import get_db
from anuvaad_auditor.loghandler import log_info, log_exception
from anuvaad_auditor.errorhandler import post_error
from config import EX_USR_MONGO_COLLECTION, EX_USR_TOKEN_MONGO_COLLECTION
import time
from config import EXTENSION_USR_ROLE_KEY, EXTENSION_ORG

class ExtensionModel:

    def register_request(self,request_id):
        """Inserting records to the database"""
        ex_usr_collections = get_db()[EX_USR_MONGO_COLLECTION]
        ex_usr_tokens = get_db()[EX_USR_TOKEN_MONGO_COLLECTION]

        ex_usr = ex_usr_collections.find({"userID":request_id},{"_id":0})
        if ex_usr.count() > 0:
            log_info(f"{request_id} is laready a registered user, fetching token",MODULE_CONTEXT)
            token = ex_usr_tokens.find({"user" : request_id, "active" : True})
            if token.count() > 0:
                return  {"requestID": request_id,"token": token[0]["token"]} 
            else:
                log_info(f"token expired for {request_id} ; generating new one",MODULE_CONTEXT)
                token = utilities.UserUtils.generate_token({"user_name":request_id},EX_USR_TOKEN_MONGO_COLLECTION)
                return_data = {"requestID": request_id,"token": token.decode("UTF-8")}
                return return_data

        else:
            records = {}
            records["userID"] = request_id
            records["registered_time"] = eval(str(time.time()))
            records["is_active"] = True
            records["roles"] = [{"roleCode" : EXTENSION_USR_ROLE_KEY, "roleDesc": None}]
            records["orgID"] = EXTENSION_ORG
            records["last_activity_at"] = eval(str(time.time()))

        try:
            log_info(f"Creating db entry for {request_id} ",MODULE_CONTEXT)
            #inserting user records on db
            ex_usr_collections.insert([records])
            
            token = utilities.UserUtils.generate_token({"user_name":request_id},EX_USR_TOKEN_MONGO_COLLECTION)
            return_data = {"requestID": request_id,"token": token.decode("UTF-8")}
            return return_data
        except Exception as e:
            log_exception("db connection exception " +
                          str(e),  MODULE_CONTEXT, e)
            return post_error("Database  exception", "An error occurred while processing on the db :{}".format(str(e)), None)