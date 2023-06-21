import base64
import time

import bcrypt
import pyotp
import pyqrcode

from config import MFA_HOTP_COUNTER, MFA_ISSUER, MFA_TOTP_INTERVAL
from .email_notification import send_email, generate_email_notification
from .userutils import UserUtils 
from anuvaad_auditor.loghandler import log_info, log_exception
from anuvaad_auditor.errorhandler import post_error
from utilities import MODULE_CONTEXT
from db import get_db
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email.mime.application import MIMEApplication
from config import MFA_MONGO_COLLECTION, USR_TOKEN_MONGO_COLLECTION, MFA_SUPPORTED_TYPES, MFA_EXPIRATION_TIME

# Mapper for MFA Types
MFA_TYPE_MAPPER={
        "TOTP": {
            'verifier':"verify_mfa_totp",
            'post_login':"generate_post_login_totp",
            'post_register': 'generate_post_register_totp',
        },
        "HOTP": {
            'verifier':"verify_mfa_hotp",
            'post_login':"generate_post_login_hotp",
            'post_register': 'generate_post_register_hotp',
        }
    }

# pre-check for supported MFA types
mfa_type_map_check = all(mfa_type in MFA_TYPE_MAPPER.keys() for mfa_type in MFA_SUPPORTED_TYPES)
if not mfa_type_map_check:
    raise ValueError("All MFA_SUPPORTED_TYPES are not mapped in MFA_TYPE_MAPPER")


class MFAUtils:
    @staticmethod
    def generate_mfa_hash(username):
        """generate hash for MFA using bcrypt."""
        # converting str to byte before hashing
        username = bytes(username, "utf-8")
        timestamp = bytes(str(time.time()), "utf-8")
        byte_str = username+timestamp
        # generate salt for hashing
        salt = bcrypt.gensalt()
        # hash bytes with salt and perform b32 encode
        gen_hash = bcrypt.hashpw(byte_str, salt)
        gen_hash = base64.b32encode(gen_hash)
        return gen_hash

    @staticmethod
    def generate_mfa_qrcode(username, mfa_hash):
        """get QR code (as base64 and setupkey) for MFA"""
        # generate TOTP based on hash
        totp_obj = pyotp.totp.TOTP(mfa_hash, interval=MFA_TOTP_INTERVAL)
        auth_url = totp_obj.provisioning_uri(
            name=username, issuer_name=MFA_ISSUER)
        # create a QR obj for the auth_url
        qr = pyqrcode.create(auth_url)
        return {
            "mfa_qr_base64": qr.png_as_base64_str(scale=4),
            "mfa_setup_key": auth_url
        }

    @staticmethod
    def verify_mfa_totp(auth_hash, auth_otp, **_):
        """verify MFA TOTP"""
        totp_obj = pyotp.totp.TOTP(auth_hash, interval=MFA_TOTP_INTERVAL)
        return totp_obj.verify(auth_otp)

    @staticmethod
    def verify_mfa_hotp(auth_hash,session_id, auth_otp, **_):
        """verify MFA HOTP"""
        hash_val = auth_hash + session_id.encode("utf-8")
        hash_val = base64.b32encode(hash_val)
        hotp_obj = pyotp.HOTP(hash_val)
        return hotp_obj.verify(auth_otp, MFA_HOTP_COUNTER) 
    
    @staticmethod
    def generate_post_login_totp(**_):
        """post login TOTP (only message no functionality)"""
        message = 'Please enter the OTP generated from the authenticator app'
        return message 
    
    @staticmethod
    def generate_post_login_hotp(username, session_id,mfa_hash,email,**_):
        """post login TOTP (message with email functionality)"""
        try:
            # generate otp
            hash_val = mfa_hash + session_id.encode("utf-8")
            hash_val = base64.b32encode(hash_val)
            hotp_obj = pyotp.HOTP(hash_val)
            auth_otp = str(hotp_obj.at(MFA_HOTP_COUNTER))

            # generate & send email
            message = generate_email_notification(email)
            username_nomail = MFAUtils.get_username_from_email(username) 
            message["Subject"] = f"OTP for Anuvaad Login"
            filename = "./templates/standard_otp_template.html"
            html_ = open(filename).read()
            html_ = html_.replace("{{username}}", username_nomail)
            html_ = html_.replace("{{otp_expiry}}", str(int(MFA_EXPIRATION_TIME/60)))
            html_ = html_.replace("{{otp_code}}", auth_otp)
            html_ = MIMEText(html_, "html")
            message.add_alternative(html_, subtype="html")
            send_email(message)
            log_info(
                "Generated email notification for HOTP mail",
                MODULE_CONTEXT,
            )
            message = f'OTP sent for {username=} to email={MFAUtils.mask_email(email)}'
            return message 
        except Exception as e:
            log_exception(
                "Exception while generating email notification for HOTP mail: "
                + str(e),
                MODULE_CONTEXT,
                e,
            )
            return post_error(
                "Exception while generating email notification for HOTP mail",
                "Exception occurred:{}".format(str(e)),
                None,
            )
        
    @staticmethod
    def fetch_mfa_data(username):
        ''' fetch mfa data from db'''
        try:
            collections = get_db()[MFA_MONGO_COLLECTION]
            # fetching the user details from db
            log_info(f"{username=} find start", MODULE_CONTEXT)
            record = collections.find({"userName": username})
            log_info(f"{username=} find end", MODULE_CONTEXT)
            mfa_type = None
            for i in record:
                mfa_type = i['type']
                mfa_hash = i['hash']
            if mfa_type == None:
                return {'mfa_register': 'required'}
            return {
                "mfa_type":mfa_type,
                "mfa_hash":mfa_hash,
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
    
    @staticmethod
    def fetch_session_data(username):
        ''' fetch session_id from db'''
        try:
            collections = get_db()[USR_TOKEN_MONGO_COLLECTION]
            # fetching the user details from db
            log_info(f"{username=} find start", MODULE_CONTEXT)
            record = collections.find({"user": username,'active':True})
            log_info(f"{username=} find end", MODULE_CONTEXT)
            for i in record:
                return {
                'session_id':i['session_id'],
                'start_time':i['start_time'],
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
    
    @staticmethod
    def generate_post_login_output(username,useHOTP=False):
        '''execute post_login functionality'''
        try:
            log_info(f"MFA Post Login Functionality for {username=} start", MODULE_CONTEXT)
            mfa_data = MFAUtils.fetch_mfa_data(username)
            email = UserUtils.fetch_email(username)
            if 'mfa_register' in mfa_data:
                log_info(f"MFA Registration Pending for {username=}", MODULE_CONTEXT)
                return None, 'Please perform MFA registration'
            mfa_data['session_id'] = MFAUtils.fetch_session_data(username)['session_id']
            org_mfa_type = None
            if useHOTP:
                org_mfa_type = mfa_data['mfa_type']
                mfa_data['mfa_type'] = "HOTP"
                log_info(f"Manually Selecting HOTP for {username=}", MODULE_CONTEXT)
            post_login_func = MFA_TYPE_MAPPER[mfa_data['mfa_type']]['post_login']
            post_login_func = getattr(MFAUtils,post_login_func)
            message = post_login_func(username=username,email=email,**mfa_data)
            log_info(f"MFA Post Login Functionality for {username=} end", MODULE_CONTEXT)
            if useHOTP:
                mfa_data['mfa_type'] = org_mfa_type 
            return mfa_data['mfa_type'], message
        except Exception as e:
            log_exception("Database connection exception ", MODULE_CONTEXT, e)
            return None, post_error(
                "Database connection exception",
                "An error occurred while connecting to the database",
                None,
            )
    
    @staticmethod
    def generate_post_register_totp(username, mfa_hash, email):
        '''execute post_register functionality for TOTP'''
        try:
            qr_data = MFAUtils.generate_mfa_qrcode(username, mfa_hash)

            # generate & send email
            message = generate_email_notification(email)
            username_nomail = MFAUtils.get_username_from_email(username) 
            message["Subject"] = f"QR code for Anuvaad Login"
            filename = "./templates/register_totp_template.html"
            html_ = open(filename).read()
            html_ = html_.replace("{{username}}", username_nomail)
            # html_ = html_.replace("{{qr_setup_key}}", qr_data['mfa_setup_key'])
            html_ = MIMEText(html_, "html")
            message.add_alternative(html_, subtype="html")
            img_data = MIMEImage(base64.decodebytes(qr_data['mfa_qr_base64'].encode()))
            img_data.add_header("Content-ID", "<mfa_qr>")
            message.add_attachment(img_data)
            send_email(message)
            log_info(
                "Generated email notificatio for TOTP MFA data",
                MODULE_CONTEXT,
            )
            message = f'OTP data sent for {username=} to email={MFAUtils.mask_email(email)}'
            return message 
        except Exception as e:
            log_exception(
                "Exception while generating email notification for TOTP MFA data"
                + str(e),
                MODULE_CONTEXT,
                e,
            )
            return post_error(
                "Exception while generating email notification for TOTP MFA data",
                "Exception occurred:{}".format(str(e)),
                None,
            )
    
    @staticmethod
    def generate_post_register_hotp(username, email, **_):
        '''execute post_register functionality for HOTP (only message)'''
        message = f'Now for every login, OTP email will sent to email={MFAUtils.mask_email(email)} for {username=}'
        return message 
    
    @staticmethod
    def mask_email(email):
        ''' mask email with *(asterick) only retaining first and last 2 chars of username'''
        name,domain = email.split('@')
        masked_email = name[:2] + "*"*(len(name)-4) + name[-2:]
        masked_email += "@" + domain 
        return masked_email
    
    @staticmethod
    def get_username_from_email(email):
        ''' return username for the email'''
        return email.split('@')[0]
    

