from utilities import MODULE_CONTEXT
from db import get_db, get_active_users_redis
from utilities import UserUtils, OrgUtils
from anuvaad_auditor.loghandler import log_info, log_exception
from anuvaad_auditor.errorhandler import post_error
from config import USR_MONGO_COLLECTION,ONE_ROLE_PER_ORG_LIST, MAIL_SETTINGS, VERIFY_USERS
import time
import uuid
import smtplib
from email.mime.text import MIMEText
admin_email = MAIL_SETTINGS['USER_VERIFICATION_ADMIN_EMAIL']


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
            if role_info["roleCode"] in ONE_ROLE_PER_ORG_LIST:
                check = collections.find_one({"orgID":users_data['orgID'],"roles.roleCode":role_info["roleCode"]})
                if check == None:
                    results = collections.insert(records)
                    log_info("Count of users created : {}".format(len(results)), MODULE_CONTEXT)
                else:
                    return post_error("Database exception", f"already an {role_info['roleCode']} present for the given org", None)
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
                if user.get("userName")    !=  None:
                    users_data["userName"] =   user["userName"]
                
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
                out = collections.find({"is_verified":{"$in":[True,False]}},exclude)
                record_count=out.count()
            elif not user_ids and not user_names and  role_codes and  org_codes :
                log_info("Fetching verified users from specific org and rolecodes", MODULE_CONTEXT)
                out = collections.find(
                {'$and': [
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

    def validate_usr_for_doc_translate(self, email):
        collections = get_db()[USR_MONGO_COLLECTION]
        result_usr = collections.find_one({"email": email})
        if result_usr:
            return result_usr
        return None

    def add_user_to_collection(self, name, email, orgID,token_and_epoch_gen, avgDocTranslate):#,timestamp, token):
        collections = get_db()[VERIFY_USERS]
        insert_user = collections.insert_one({"email":email, "userName":email,"name" : name, "orgID":orgID,"token": token_and_epoch_gen[0],"timeStamp":token_and_epoch_gen[1] ,"documentsPerDay":avgDocTranslate})#, "timeStamp":timestamp,"token":token})
        inserted = insert_user.inserted_id
        if inserted:
            return "SUCCESS"
        return None
    
    def generate_token_for_user_response_page(self):
        #epoch_time = int(time.time())
        return (str(uuid.uuid4().int)[:10], int(time.time()))

    def send_mail(self, message):
        email = MIMEText(message)
        smtp_server = smtplib.SMTP('smtp.gmail.com', 587)
        smtp_server.starttls()
        smtp_server.login(MAIL_SETTINGS['MAIL_SENDER'], MAIL_SETTINGS['MAIL_PASSWORD'])
        kk = smtp_server.sendmail(MAIL_SETTINGS['MAIL_SENDER'], MAIL_SETTINGS['USER_VERIFICATION_ADMIN_EMAIL'], email.as_string())
        smtp_server.quit()
        return "SUCCESS"

    def val_onb_user(self,token, email):
        collections = get_db()[VERIFY_USERS]
        founder = collections.find_one({"email":email,"token":token})
        if isinstance(founder, dict):
            return founder
        return None

    def remove_user_data(self,token, email):
        collections = get_db()[VERIFY_USERS]
        removed_ = collections.delete_one({"token":token, "email":email})
        return removed_




    def send__usr_verified_mail(self,userEmail, message):
        email = MIMEText(message)
        smtp_server = smtplib.SMTP('smtp.gmail.com', 587)
        smtp_server.starttls()
        smtp_server.login(MAIL_SETTINGS['MAIL_SENDER'], MAIL_SETTINGS['MAIL_PASSWORD'])
        smtp_server.sendmail(MAIL_SETTINGS['MAIL_SENDER'], userEmail, email.as_string())
        smtp_server.quit()
        return "SUCCESS"

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
            if role_info["roleCode"] in ONE_ROLE_PER_ORG_LIST:
                check = collections.find_one({"orgID":users_data['orgID'],"roles.roleCode":role_info["roleCode"]})
                if check == None:
                    results = collections.insert(records)
                    log_info("Count of users created : {}".format(len(results)), MODULE_CONTEXT)
                else:
                    return post_error("Database exception", f"already an {role_info['roleCode']} present for the given org", None)
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
    
    def change_email(self, username, new_email):
        try:
            collections = get_db()[USR_MONGO_COLLECTION]
            result = collections.find({'userName':username})
            for i in result:
                if i.get('email_updated',False):
                    log_info("Email is already updated", MODULE_CONTEXT)
                    return post_error("Email Already Updated", "Email is updated already", None)
            collections.update(
                {'userName':username},
                {"$set": {"email_updated": True, "email":new_email}}
            )
            return {
                'email': new_email,
                'message': "email has been changed successfully."
            }
        except Exception as e:
            log_exception("db connection exception " +
                          str(e),  MODULE_CONTEXT, e)
            return post_error("Database  exception", "An error occurred while processing on the db :{}".format(str(e)), None)
    
    def get_active_users(self):
        count = None  # "NaN"
        try:
            r_db = get_active_users_redis()
            count = len(r_db.keys())
        except Exception as e:
            log_exception(f"skipping with count=NaN as issue during get_active_users func : {str(e)}",  MODULE_CONTEXT, e)
        return {'count':count}
