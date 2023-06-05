from utilities import MODULE_CONTEXT
from db import get_db
from utilities import MFAUtils, MFA_TYPE_MAPPER, UserUtils
from anuvaad_auditor.loghandler import log_info, log_exception
from anuvaad_auditor.errorhandler import post_error
from config import MFA_MONGO_COLLECTION, USR_TOKEN_MONGO_COLLECTION
import time
from .user_auth import UserAuthenticationModel

userAuthModel = UserAuthenticationModel()


class MFAModel(object):
    def register_mfa(self, username, mfa_type, email):
        try:
            collections = get_db()[MFA_MONGO_COLLECTION]
            log_info(f"mfa_hash generation for {username=} start", MODULE_CONTEXT)
            mfa_hash = MFAUtils.generate_mfa_hash(username)
            log_info(f"mfa_hash generation for {username=} end", MODULE_CONTEXT)
            
            # register MFA to db
            record = {
                "hash": mfa_hash,
                "userName": username,
                "email": email,
                "time": str(time.time()),
                "type": mfa_type
            }
            collections.insert(record)
            log_info(f"mfa_hash registered to db for {username=}", MODULE_CONTEXT)
            
            # post register functions of MFA type
            post_register_func = MFA_TYPE_MAPPER[mfa_type]['post_register']
            post_register_func = getattr(MFAUtils, post_register_func)
            message = post_register_func(**{'username': username, "mfa_hash": mfa_hash, "email": email})
            
            log_info(f"MFA generation ended for {username=}", MODULE_CONTEXT)
            return {"message": message, 'mfa_type': mfa_type}
        except Exception as e:
            log_exception(
                "exception while validating username and password" + str(e),
                MODULE_CONTEXT,
                e,
            )
            return post_error(
                "Database exception", "Exception occurred:{}".format(
                    str(e)), None
            )

    def verify_mfa(self, username, auth_otp, useHOTP=False):
        try:
            collections = get_db()[MFA_MONGO_COLLECTION]
            log_info(f"MFA verification for {username=} start", MODULE_CONTEXT)
            
            # fetching the user details from db
            record = collections.find({"userName": username})
            if record.count() == 0:
                log_info(f"MFA not found for {username=}", MODULE_CONTEXT)
                return post_error(
                    "MFA does not exists.", f"MFA is not registered for {username=}", None
                )
            
            # fetch mfa data
            log_info(f"fetching MFA data for {username=}", MODULE_CONTEXT)
            mfa_data = MFAUtils.fetch_mfa_data(username)
            session_id = MFAUtils.fetch_session_id(username)
            auth_data = {
                "auth_hash": mfa_data['mfa_hash'],
                "session_id": session_id,
                "auth_otp": auth_otp
            }
            # if use basic MFA (HOTP)
            if useHOTP:
                mfa_data['mfa_type'] = 'HOTP'
            
            # post verification functionality
            verifier_func = MFA_TYPE_MAPPER[mfa_data['mfa_type']]['verifier']
            verifier_func = getattr(MFAUtils, verifier_func)
            auth_status = verifier_func(**auth_data)
            # auth_status = True 
            
            log_info(f"MFA verification for {username=} end", MODULE_CONTEXT)
            if not auth_status:
                return post_error(
                    "Invalid OTP", "OTP is not correct", None
                )
            auth_data = self.update_session_as_inuse(username)
            return auth_data
        except Exception as e:
            log_exception(
                "exception while validating username and password" + str(e),
                MODULE_CONTEXT,
                e,
            )
            return post_error(
                "Database exception", "Exception occurred:{}".format(
                    str(e)), None
            )

    def reset_mfa(self, username):
        try:
            log_info(f"MFA Reset for {username=} start", MODULE_CONTEXT)
            collections = get_db()[MFA_MONGO_COLLECTION]
            record_dict = {"userName": username}
            record = collections.find(record_dict)
            if record.count() == 0:
                data = {'status': True, 'message': 'MFA is not set yet.'}
            else:
                collections.delete_one(record_dict)
                data = {'status': True, 'message': 'MFA Reset Successfull'}
            log_info(f"MFA Reset for {username=} end", MODULE_CONTEXT)
            return {
                "userName": username,
                **data
            }
        except Exception as e:
            log_exception(
                "exception while validating username/email" +
                str(e), MODULE_CONTEXT, e
            )
            return post_error(
                "Database exception", "Exception occurred:{}".format(
                    str(e)), None
            )

    def generate_new_login(self, username, useHOTP=False):
        try:
            log_info(f"MFA Registration check for {username=} start", MODULE_CONTEXT)
            mfa_reg_status = self.check_mfa_registration(username)
            log_info(f"MFA Registration check for {username=} end", MODULE_CONTEXT)
            log_info(f"MFA Deactivate existing-token for {username=} start", MODULE_CONTEXT)
            deactive_status = self.deactivate_old_token(username)
            if deactive_status is not None:
                raise ValueError('error while deactivating old tokens')
            log_info(f"MFA Deactivate existing-token for {username=} end", MODULE_CONTEXT)
            log_info(f"MFA New Login Generation for {username=} start", MODULE_CONTEXT)
            session_id = UserUtils.generate_token({"user_name":username,"password":""}, USR_TOKEN_MONGO_COLLECTION,session=True)
            # session_id  = UserUtils.generate_token({"user_name":username,"password":""}, USR_TOKEN_MONGO_COLLECTION,session=True)
            session_id, token  = UserUtils.generate_token({"user_name":username,"password":""}, USR_TOKEN_MONGO_COLLECTION,session=True) # testing only
            log_info(f"MFA New Login Generation for {username=} end", MODULE_CONTEXT)
            result = {"session_id":session_id, 'mfa_required': True}
            result['token'] = token.decode('utf-8') # testing only
            result['mfa_registration'] = mfa_reg_status
            result['mfa_message'] = MFAUtils.generate_post_login_output(username,useHOTP)
            return result
        except Exception as e:
            log_exception("Database connection exception ", MODULE_CONTEXT, e)
            return post_error(
                "Database connection exception",
                "An error occurred while connecting to the database",
                None,
            )

    def verify_session(self, username, session_id):
        try:
            collections = get_db()[USR_TOKEN_MONGO_COLLECTION]
            record = collections.find(
                {"user": username, "session_id": session_id})
            return False if record.count() == 0 else True
        except Exception as e:
            log_exception(
                "exception while checking MFA session" +
                str(e), MODULE_CONTEXT, e
            )
            return post_error(
                "Database exception", "Exception occurred:{}".format(
                    str(e)), None
            )

    def update_session_as_inuse(self, username):
        try:
            collections = get_db()[USR_TOKEN_MONGO_COLLECTION]
            # fetching the user details from db
            log_info(f"{username=} find start", MODULE_CONTEXT)
            record = collections.find({"user": username,"active":True})
            log_info(f"{username=} find end", MODULE_CONTEXT)
            # set mfa_status as True so this session wont be sent again to user
            for i in record:
                # session_id = i['session_id']
                auth_token = i['token']
                collections.update(
                    i,
                    {"$set": {"mfa_status": True}}
                )
            return {
                'user': username,
                'auth-token': auth_token,
            }
        except Exception as e:
            log_exception(
                "exception while validating username and password" + str(e),
                MODULE_CONTEXT,
                e,
            )
            return post_error(
                "Database exception", "Exception occurred:{}".format(
                    str(e)), None
            )

    def check_mfa_registration(self, username):
        try:
            collections = get_db()[MFA_MONGO_COLLECTION]
            record = collections.find({"userName": username})
            return False if record.count() == 0 else True
        except Exception as e:
            log_exception(
                "exception while checking MFA status" +
                str(e), MODULE_CONTEXT, e
            )
            return post_error(
                "Database exception", "Exception occurred:{}".format(
                    str(e)), None
            )

    def check_mfa_active(self, username,session_id):
        try:
            collections = get_db()[USR_TOKEN_MONGO_COLLECTION]
            record = collections.find({"user": username,"session_id":session_id})
            for i in record:
                return i['mfa_status']
        except Exception as e:
            log_exception(
                "exception while checking MFA status" +
                str(e), MODULE_CONTEXT, e
            )
            return post_error(
                "Database exception", "Exception occurred:{}".format(
                    str(e)), None
            )

    def deactivate_old_token(self, username):
        try:
            collections = get_db()[USR_TOKEN_MONGO_COLLECTION]
            collections.update_many(
                {"user": username,"mfa_status":True, 'active':True},
                {"$set": {'active':False}},
            )
        except Exception as e:
            log_exception(
                "exception while checking MFA status" +
                str(e), MODULE_CONTEXT, e
            )
            return post_error(
                "Database exception", "Exception occurred:{}".format(
                    str(e)), None
            )
