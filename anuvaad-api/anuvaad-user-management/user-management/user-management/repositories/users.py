from models import UserManagementModel
from config import MAIL_SETTINGS, EMAIL_GET_URL_NOTIFICATION
from utilities import UserUtils, MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
import uuid
userModel   =   UserManagementModel()

class UserManagementRepositories:
    
    def create_users(self,users):
        result = userModel.create_users(users)
        if result is not None:
            return result

    def update_users(self,users):
        result = userModel.update_users_by_uid(users)
        if result is not None:
            return result
        else:
            return True

    def search_users(self,user_ids, user_names, role_codes,org_codes,offset,limit_value,skip_pagination):
        result = userModel.get_user_by_keys(
            user_ids, user_names, role_codes,org_codes,offset,limit_value,skip_pagination)
        if result is not None:
            return result

    def validate_user_for_docs(self,email):
        result = userModel.validate_usr_for_doc_translate( email)
        if result :
            return result
        return None

    def add_usr_details(self, name, email, orgID,token_and_epoch_gen, averageDocTranslate):
        result = userModel.add_user_to_collection(name, email, orgID,token_and_epoch_gen, averageDocTranslate)#, timestamp, token)
        if result:
            return "SUCCESS"
        return None

    def token_generation_and_timestamp(self):
        token_and_epoch = userModel.generate_token_for_user_response_page()
        if isinstance(token_and_epoch[0],str):
            return token_and_epoch
        return None
    
    def send_mail_to_admin(self, email, name, orgId, averageDocTranslate, admin_email, token):
        url_to_admin = f'{EMAIL_GET_URL_NOTIFICATION}?token={token}&email={email}'
        admin_message = f'Hi,A user with the following details is requesting to signup within Anuvaad.\n Name: {name},\n Email ID: {email}, \n Org ID: {orgId}, \n Average expected translations per day: {averageDocTranslate}. \n Please approve the same if the user can sign up by clicking the link below: \n {url_to_admin}'
        send = userModel.send_mail(admin_message)
        return None

    def validate_and_onboard_user(self,token, email):
        res = userModel.val_onb_user(token, email)
        if res:
            return res
        return None

    def rmv_validated_user_from_db(self,token, email):
        removed = userModel.remove_user_data(token, email)
        return removed

    def send_mail_to_verified_user(self,userEmail,pwd):
        message = f'Hi, Here is the details of your login credentials.\n Please use the following details to login to ANUVAAD. \n  UserName : {userEmail} \n Password : {pwd}'
        send_verified_mail = userModel.send__usr_verified_mail(userEmail, message)
        return send_verified_mail

    def onboard_users(self,users):
        result = userModel.onboard_users(users)
        if result is not None:
            return result
    
    def prepare_onboarding_user_req(self, validate):
        if "documentsPerDay" in validate.keys() and "_id" in validate.keys():
            del validate["documentsPerDay"]
            del validate["_id"]
        pwd = uuid.uuid4()
        validate["password"] = pwd.hex
        validate["roles"] = [{"roleCode":"TRANSLATOR","roleDesc" : "Has access to translation related resources"}]
        return [validate], validate['password']



    def get_roles(self):
        result = userModel.get_roles_from_role_sheet()
        if result is not None:
            return result
    
    def change_email(self, username, email):
        result = userModel.change_email(username, email)
        if result is not None:
            return result
        
    def get_active_users(self):
        result = userModel.get_active_users()
        if result is not None:
            return result
