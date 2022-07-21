from utilities import MODULE_CONTEXT
from db import get_db
from utilities import UserUtils, OrgUtils
from anuvaad_auditor.loghandler import log_info, log_exception
from anuvaad_auditor.errorhandler import post_error
from config import USR_MONGO_COLLECTION
import time

class UserManagementModel(object):

    def create_users(self,users):
        """Inserting user records to the databse"""

        records = []
        for user in users:
            users_data = {}
            hashed = UserUtils.hash_password(user["password"])
            user_id = UserUtils.generate_user_id()
            user_roles = []
            for role in user["roles"]:
                role_info = {}
                role_info["roleCode"] = role["roleCode"].upper()
                if "roleDesc" in role:
                    role_info["roleDesc"] = role["roleDesc"]
                user_roles.append(role_info)
            users_data['userID'] = user_id
            users_data['name'] = user["name"]
            users_data['userName'] = user["userName"]
            users_data['password'] = hashed.decode("utf-8")
            users_data['email'] = user["email"]
            users_data['roles'] = user_roles     
            users_data['is_verified'] =False
            users_data['is_active'] =False
            users_data['registered_time'] =eval(str(time.time()))
            users_data['activated_time'] =0

            if "phoneNo" in user:
                users_data['phoneNo'] = user["phoneNo"]
            if "orgID" in user:
                users_data['orgID'] = str(user["orgID"]).upper()
            records.append(users_data)

        if not records:
            return post_error("Data Null", "Data recieved for user creation is empty", None)
        try:
            #connecting to mongo instance/collection
            collections = get_db()[USR_MONGO_COLLECTION]
            #inserting user records on db
            if "ADMIN" == role_info["roleCode"]:
                admin_check = collections.find_one({"orgID":users_data['orgID'],"roles.roleCode":"ADMIN"})
                print("ADMIN_CHECK",admin_check)
                if admin_check == None:
                    results = collections.insert(records)
                    log_info("Count of users created : {}".format(len(results)), MODULE_CONTEXT)
                else:
                    return post_error("Database exception", "already an ADMIN present for the given org", None)
            else :
                results = collections.insert(records)
                log_info("Count of users created : {}".format(len(results)), MODULE_CONTEXT)
            # results = collections.insert(records)
            # log_info("Count of users created : {}".format(len(results)), MODULE_CONTEXT)
            if len(records) != len(results):
                return post_error("Database exception", "Some of the users were not created due to databse error", None)
            #email notification for registered users
            user_notified=UserUtils.generate_email_user_creation(records)
            if user_notified is not None:
                return user_notified
        except Exception as e:
            log_exception("db connection exception " +
                          str(e),  MODULE_CONTEXT, e)
            return post_error("Database  exception", "An error occurred while processing on the db :{}".format(str(e)), None)


    def update_users_by_uid(self,users):
        """Updating user records in the database"""

        try:
            for i,user in enumerate(users):
                user_id = user["userID"]
                users_data = {}

                if user.get("name") !=  None:
                    users_data["name"]  =   user["name"]
                if user.get("email")    !=  None:
                    users_data["email"] =   user["email"]
                if user.get("phoneNo")  !=  None:
                    users_data["phoneNo"]   =   user["phoneNo"]
                if user.get("orgID")    !=  None:
                    users_data["orgID"] =   str(user["orgID"]).upper()
                if user.get("models")   !=  None:
                    users_data["models"]    =   user["models"]
                if user.get("roles_new")    !=  None:
                    users_data["roles"] =   user["roles_new"]
                
                #connecting to mongo instance/collection
                collections = get_db()[USR_MONGO_COLLECTION]
                #updating user record
                results = collections.update({"userID": user_id}, {'$set': users_data})
                if 'writeError' in list(results.keys()):
                    log_info("User{} updation failed due to {}".format((i+1),str(results)), MODULE_CONTEXT)
                    return post_error("db error", "some of the records where not updated", None)
                log_info("User{} updated".format(i+1), MODULE_CONTEXT)
        except Exception as e:
            log_exception("Database connection exception ",  MODULE_CONTEXT, e)
            return post_error("Database connection exception", "An error occurred while connecting to the database:{}".format(str(e)), None)


    def get_user_by_keys(self,user_ids, user_names, role_codes,org_codes,offset,limit_value,skip_pagination):
        """Searching for user records in the databse"""

        #keys to exclude from search result
        exclude = {"password": False,"_id":False}
        try:
            #connecting to mongo instance/collection
            collections = get_db()[USR_MONGO_COLLECTION]
            #fetching all verified users from db when skip_pgination = True
            if skip_pagination==True:
                log_info("Fetching all verified users from database", MODULE_CONTEXT)
                out = collections.find({"is_verified":True},exclude)
                record_count=out.count()
            #fetching users with pagination(skip & limit) when skip_pagination != True
            elif not user_ids and not user_names and not role_codes and not org_codes :
                log_info("Fetching verified users from database with pagination property", MODULE_CONTEXT)
                out = collections.find({"is_verified":True},exclude).sort([("_id",-1)]).skip(offset).limit(limit_value)
                record_count=collections.find({"is_verified":True}).count()
            else:
                log_info("Fetching verified users from database matching user properties", MODULE_CONTEXT)
                out = collections.find(
                {'$or': [
                    {'userID': {'$in': user_ids},'is_verified': True},
                    {'userName': {'$in': user_names},'is_verified': True},
                    {'roles.roleCode': {'$in': role_codes},'is_verified': True},
                    {'orgID': {'$in': org_codes},'is_verified': True}
                ]}, exclude)
                record_count=out.count()          
            result = []
            for record in out:
                result.append(record)
            if not result:
                return None
            return result,record_count

        except Exception as e:
            log_exception("db connection exception ",  MODULE_CONTEXT, e)
            return post_error("Database connection exception", "An error occurred while connecting to the database:{}".format(str(e)), None)

    def onboard_users(self,users):
        records = []
        for user in users:
            users_data = {}
            hashed = UserUtils.hash_password(user["password"])
            user_id = UserUtils.generate_user_id()
            user_roles = []
            for role in user["roles"]:
                role_info = {}
                role_info["roleCode"] = role["roleCode"].upper()
                if "roleDesc" in role:
                    role_info["roleDesc"] = role["roleDesc"]
                user_roles.append(role_info)
            users_data['userID'] = user_id
            users_data['name'] = user["name"]
            users_data['userName'] = user["userName"]
            users_data['password'] = hashed.decode("utf-8")
            users_data['email'] = user["email"]
            if "phoneNo" in user:
                users_data['phoneNo'] = user["phoneNo"]
            users_data['roles'] = user_roles
            users_data['is_verified'] =True
            users_data['is_active'] =True
            users_data['registered_time'] =eval(str(time.time()))
            users_data['activated_time'] =eval(str(time.time()))
            if "orgID" in user.keys():
                users_data['orgID'] = str(user["orgID"]).upper()          
            if "models" in user:
                users_data['models']= user["models"]
            records.append(users_data)

        if not records:
            return post_error("Data Null", "Data recieved for insert operation is null", None)
        try:
            #connecting to mongo instance/collection
            collections = get_db()[USR_MONGO_COLLECTION]
            #inserting records on database
            if "ADMIN" == role_info["roleCode"]:
                admin_check = collections.find_one({"orgID":users_data['orgID'],"roles.roleCode":"ADMIN"})
                print("ADMIN_CHECK",admin_check)
                if admin_check == None:
                    results = collections.insert(records)
                    log_info("Count of users created : {}".format(len(results)), MODULE_CONTEXT)
                else:
                    return post_error("Database exception", "already an ADMIN present for the given org", None)
            else :
                results = collections.insert(records)
                log_info("Count of users created : {}".format(len(results)), MODULE_CONTEXT)
            # results = collections.insert(records)
            if len(records) != len(results):
                return post_error("Database error", "some of the records were not inserted into db", None)
            log_info("Count of users onboared : {}".format(len(results)), MODULE_CONTEXT)
        except Exception as e:
            log_exception("db connection exception " +
                          str(e),  MODULE_CONTEXT, e)
            return post_error("Database  exception", "An error occurred while processing on the db :{}".format(str(e)), None)


    def get_roles_from_role_sheet(self):
        role_description=UserUtils.read_role_codes()[1]
        if role_description:
            return role_description
