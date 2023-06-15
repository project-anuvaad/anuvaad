from repositories import extension
import uuid
import time
import re
import bcrypt
from db import get_db,User_management_db
from anuvaad_auditor.loghandler import log_info, log_exception
from anuvaad_auditor.errorhandler import post_error
import jwt
import secrets
from utilities import MODULE_CONTEXT
from .orgutils import OrgUtils
import config
import json
import datetime
import requests
from flask_mail import Mail, Message
from app import mail
from flask import render_template
from collections import Counter
from config import (
    EX_USR_MONGO_COLLECTION,
    EX_USR_TOKEN_MONGO_COLLECTION,
    USR_MONGO_COLLECTION,
    USR_TEMP_TOKEN_MONGO_COLLECTION,
    USR_TOKEN_MONGO_COLLECTION,
)
from base64 import b64decode
from nacl.secret import SecretBox
from utilities.email_notification import send_email, generate_email_notification
from email.mime.text import MIMEText

SECRET_KEY = secrets.token_bytes()
ex_secret_key = config.SECRET_KEY
role_codes_filepath = config.ROLE_CODES_URL
json_file_dir = config.ROLE_CODES_DIR_PATH
json_file_name = config.ROLE_CODES_FILE_NAME

mail_ui_link = config.BASE_URL
token_life = config.AUTH_TOKEN_EXPIRY_HRS

role_codes = []
role_details = []


db = User_management_db()
db_connection = db.instantiate()

class UserUtils:
    @staticmethod
    def generate_user_id():
        """UUID generation."""

        return uuid.uuid4().hex + str(time.time()).replace(".", "")[:13]

    @staticmethod
    def validate_email(email):
        """Regex validation for emails."""

        regex = "([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)"
        if re.search(regex, email):
            return True
        else:
            return False

    @staticmethod
    def hash_password(password):
        """Password hashing using bcrypt."""

        # converting str to byte before hashing
        password_in_byte = bytes(password, "utf-8")
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password_in_byte, salt)

    @staticmethod
    def validate_password(password):
        """Password rule check

        Minimum x chars long,as defined by 'MIN_LENGTH' on config,
        Must contain upper,lower,number and a special character.
        """

        if len(password) < config.MIN_LENGTH:
            return post_error(
                "Invalid password",
                "password should be minimum 6 characteristics long",
                None,
            )
        regex = "^(?=.*[a-z])(?=." + "*[A-Z])(?=.*\\d)" + "(?=.*[-+_!@#$%^&*., ?]).+$"
        pattern = re.compile(regex)
        if re.search(pattern, password) is None:
            return post_error(
                "Invalid password",
                "password must contain atleast one uppercase,one lowercase, one numeric and one special character",
                None,
            )

    @staticmethod
    def validate_rolecodes(roles):
        """Role Validation

        roles should match roles defined on Anuvaad system,
        pre-defined roles are read from zuul (git) configs.
        """

        global role_codes
        global role_details
        if not role_codes:
            log_info("Reading roles from remote location", MODULE_CONTEXT)
            role_codes, role_details = UserUtils.read_role_codes()
        for role in roles:
            try:
                if role not in role_codes:
                    return False
            except Exception:
                return post_error(
                    "Roles missing",
                    "No roles are read from json,empty json or invalid path",
                    None,
                )

    @staticmethod
    def generate_token(userdetails, collection,session=False):
        """Issuing new token

        defining expiry period for token,
        jwt token generated with payload as user_name and password,
        storing the token in database.
        """
        try:
            # seting time limit for token expiry
            time_limit = datetime.datetime.utcnow() + datetime.timedelta(
                hours=token_life
            )
            # generate session
            session_data = {}
            session_id = str(uuid.uuid4())
            if session:
                session_data["session_id"] = session_id
                session_data["session_count"] = 0
                session_data["mfa_status"] = False
                
                # delete old tokens which werent mfa_verified
                collections = db.get_mongo_instance(db_connection,collection)
                collections.delete_many({
                    "user": userdetails["user_name"],
                    "mfa_status": False
                })
            # creating payload for token
            payload = {
                "user": str(userdetails["user_name"]).split("@")[0],
                "exp": time_limit,
                "session_id": session_id
            }
            # generating token
            token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
            log_info(
                "New token issued for {}".format(userdetails["user_name"]),
                MODULE_CONTEXT,
            )
            # connecting to mongo instance/collection
            # collections = get_db()[collection]
            collections = db.get_mongo_instance(db_connection,collection)
            # storing token in database
            collections.insert(
                {
                    "user": userdetails["user_name"],
                    "token": token.decode("utf-8"),
                    "secret_key": SECRET_KEY,
                    "active": True,
                    "start_time": eval(str(time.time()).replace(".", "")[0:13]),
                    "end_time": 0,
                    **session_data
                }
            )
            log_info(
                "Login details stored on database for {}".format(
                    userdetails["user_name"]
                ),
                MODULE_CONTEXT,
            )
            # return session id if MFA_ENABLED else auth-token
            if session:
                return session_id
            else:
                return token
        except Exception as e:
            log_exception("Database connection exception ", MODULE_CONTEXT, e)
            return post_error(
                "Database connection exception",
                "An error occurred while connecting to the database",
                None,
            )

    @staticmethod
    def token_validation(token):
        """Auth-token Validation for auth-token-search

        matching with existing active tokens on database,
        decoding the token,
        updating user token status on database in case of token expiry.
        """
        try:
            # connecting to mongo instance/collection
            # collections = get_db()[USR_TOKEN_MONGO_COLLECTION]
            collections = db.get_mongo_instance(db_connection,USR_TOKEN_MONGO_COLLECTION)
            # searching for token from database
            result = collections.find(
                {"token": token}, {"_id": 0, "user": 1, "active": 1, "secret_key": 1}
            )
            if result.count() == 0:
                log_info(
                    "Checking in extension users repo, for the token", MODULE_CONTEXT
                )
                # checking for extension users
                # collections = get_db()[EX_USR_TOKEN_MONGO_COLLECTION]
                collections = db.get_mongo_instance(db_connection,EX_USR_TOKEN_MONGO_COLLECTION)
                result = collections.find(
                    {"token": token},
                    {"_id": 0, "user": 1, "active": 1, "secret_key": 1},
                )
                if result.count() == 0:
                    return post_error("Invalid token", "Not a valid token", None)
            for value in result:
                # checking for token status = False
                if value["active"] == False:
                    log_info(
                        "Token on auth-token-search request has expired", MODULE_CONTEXT
                    )
                    return post_error("Invalid token", "Token has expired", None)
                # checking for token status = True
                if value["active"] == True:
                    secret_key = value["secret_key"]
                    # token decoding
                    try:
                        jwt.decode(token, secret_key, algorithm="HS256")
                    except jwt.exceptions.ExpiredSignatureError as e:
                        log_exception(
                            "Auth-token expired, time limit exceeded", MODULE_CONTEXT, e
                        )
                        # updating user token status on collection
                        collections.update(
                            {"token": token}, {"$set": {"active": False}}
                        )
                        return post_error("Invalid token", "Token has expired", None)
                    except Exception as e:
                        log_exception(
                            "Auth-token expired, jwt decoding failed", MODULE_CONTEXT, e
                        )
                        collections.update(
                            {"token": token}, {"$set": {"active": False}}
                        )
                        return post_error("Invalid token", "Not a valid token", None)

        except Exception as e:
            log_exception("Database connection exception ", MODULE_CONTEXT, e)
            return post_error(
                "Database connection exception",
                "An error occurred while connecting to the database",
                None,
            )

    @staticmethod
    def get_user_from_token(token, temp):
        """Fetching user details from token"""

        try:
            # for password resetting
            if temp:
                document = USR_TEMP_TOKEN_MONGO_COLLECTION
            # for auth-token-search
            else:
                document = USR_TOKEN_MONGO_COLLECTION
            # connecting to mongo instance/collection
            # collections = get_db()[document]
            collections = db.get_mongo_instance(db_connection,document)
            # searching for database record matching token, getting user_name
            result = collections.find({"token": token}, {"_id": 0, "user": 1})
            if result.count() == 0:
                # collections = get_db()[EX_USR_TOKEN_MONGO_COLLECTION]
                collections = db.get_mongo_instance(db_connection,EX_USR_TOKEN_MONGO_COLLECTION)
                result = collections.find({"token": token}, {"_id": 0, "user": 1})
                if result.count == 0:
                    return post_error(
                        "Invalid token", "Token received is not matching", None
                    )
                else:
                    log_info(
                        "Fetching user details from extension users repo",
                        MODULE_CONTEXT,
                    )
                    username = result[0]["user"]
                    # ex_usr_collection = get_db()[EX_USR_MONGO_COLLECTION]
                    ex_usr_collection = db.get_mongo_instance(db_connection,EX_USR_MONGO_COLLECTION)
                    ex_usr = ex_usr_collection.find({"userID": username}, {"_id": 0})
                    ex_usr_collection.update_one(
                        {"userID": username},
                        {"$set": {"last_activity_at": eval(str(time.time()))}},
                    )
                    return ex_usr[0]
            else:
                for record in result:
                    username = record["user"]
                # collections_usr = get_db()[USR_MONGO_COLLECTION]
                collections_usr = db.get_mongo_instance(db_connection,USR_MONGO_COLLECTION)
                # searching for database record matching username
                result_usr = collections_usr.find(
                    {"userName": username, "is_verified": True},
                    {"_id": 0, "password": 0},
                )
                for record in result_usr:
                    # checking active status of user
                    if record["is_active"] == False:
                        log_info(
                            "{} is not an active user".format(username), MODULE_CONTEXT
                        )
                        return post_error(
                            "Not active",
                            "This operation is not allowed for an inactive user",
                            None,
                        )
                    return record
        except Exception as e:
            log_exception("db connection exception ", MODULE_CONTEXT, e)
            return post_error(
                "Database connection exception",
                "An error occurred while connecting to the database",
                None,
            )

    @staticmethod
    def get_token(user_name,session=False):
        """Token Retrieval for login

        fetching token for the desired user_name,
        validating the token(user_name matching, expiry check),
        updating the token status on db if the token had expired.
        """
        try:
            # connecting to mongo instance/collection
            collections = db.get_mongo_instance(db_connection,USR_TOKEN_MONGO_COLLECTION)
            # collections = get_db()[USR_TOKEN_MONGO_COLLECTION]
            # searching for token against the user_name
            log_info(f"get token model start {user_name}", MODULE_CONTEXT)
            record = collections.find(
                {"user": user_name, "active": True},
                {"_id": 0, "token": 1, "secret_key": 1},
            )
            if record.count() == 0:
                log_info(
                    "No active token found for:{}".format(user_name), MODULE_CONTEXT
                )
                return {"status": False, "data": None}
            else:
                for value in record:
                    secret_key = value["secret_key"]
                    token = value["token"]
                    try:
                        if session:
                            if value['mfa_status'] is True:
                                raise ValueError('session already used') 
                        # decoding the jwt token using secret-key
                        jwt.decode(token, secret_key, algorithm="HS256")
                        log_info(
                            "Token validated for:{}".format(user_name), MODULE_CONTEXT
                        )
                        return {"status": True, "data": token}
                    # expired-signature error
                    except jwt.exceptions.ExpiredSignatureError as e:
                        log_exception(
                            "Token for {} had expired, exceeded the timeLimit".format(
                                user_name
                            ),
                            MODULE_CONTEXT,
                            e,
                        )
                        # updating token status on token-collection
                        collections.update(
                            {"token": token}, {"$set": {"active": False}}
                        )
                        return {"status": False, "data": None}
                    # falsy token error
                    except Exception as e:
                        log_exception(
                            "Token not valid for {}".format(user_name),
                            MODULE_CONTEXT,
                            e,
                        )
                        return {"status": False, "data": None}
            log_info(f"get token model end {user_name}", MODULE_CONTEXT)
        except Exception as e:
            log_exception("Database connection exception ", MODULE_CONTEXT, e)
            return {"status": "Database connection exception", "data": None}

    @staticmethod
    def validate_user_input_creation(user):
        """Validating user creation inputs.

        -Mandatory key checks
        -UserName/Email Validation
        -Password Validation
        -Model Validation
        -Org Validation
        -Role Validation
        """
        obj_keys = {"name", "userName", "password", "email", "roles"}
        for key in obj_keys:
            if user.get(key) == None:
                log_info("Mandatory key checks failed", MODULE_CONTEXT)
                return post_error(
                    "Data Missing",
                    "name,userName,password,email and roles are mandatory for user creation",
                    None,
                )
        log_info("Mandatory key checks successful", MODULE_CONTEXT)

        if (UserUtils.validate_email(user["email"]) == False) or (
            UserUtils.validate_email(user["userName"]) == False
        ):
            log_info("Email Id/User Name validation failed", MODULE_CONTEXT)
            return post_error(
                "Data not valid", "Email Id/User Name given is not valid", None
            )
        log_info("Email Id/User Name validated", MODULE_CONTEXT)

        password_validity = UserUtils.validate_password(user["password"])
        if password_validity is not None:
            log_info("Password validation failed", MODULE_CONTEXT)
            return password_validity
        log_info("Password validated", MODULE_CONTEXT)

        if user.get("models") != None:
            new_models = user["models"]
            check_dups = UserUtils.check_model_duplicates(new_models)
            if check_dups is not None:
                log_info("Model validation failed", MODULE_CONTEXT)
                return check_dups
            log_info("Models validated", MODULE_CONTEXT)

        if user.get("orgID") != None:
            # converting org codes to upper case
            user["orgID"] = str(user["orgID"]).upper()
            validity = OrgUtils.validate_org(str(user["orgID"]).upper())
            if validity is not None:
                log_info("Org validation failed", MODULE_CONTEXT)
                return validity
            log_info("Org validated", MODULE_CONTEXT)

        try:
            # connecting to mongo instance/collection
            # collections = get_db()[USR_MONGO_COLLECTION]
            collections = db.get_mongo_instance(db_connection,USR_MONGO_COLLECTION)
            # delete old/extra unverified entries for same user
            collections.delete_many(
                {"userName": user["userName"], "is_verified": False}
            )
            # searching username with verification status = True
            user_record = collections.find(
                {"userName": user["userName"]}
            )
            if user_record.count() != 0:
                log_info("User Name is already taken", MODULE_CONTEXT)
                return post_error(
                    "Data not valid",
                    "The username already exists. Please use a different username",
                    None,
                )
            log_info("User Name is not already taken, validated", MODULE_CONTEXT)
        except Exception as e:
            log_exception("Database connection exception ", MODULE_CONTEXT, e)
            return post_error(
                "Database exception",
                "An error occurred while working on the database:{}".format(str(e)),
                None,
            )

        rolecodes = []
        for rol in user["roles"]:
            if rol.get("roleCode") == None:
                return post_error("Data Missing", "roleCode not found", None)
            rolecodes.append(rol["roleCode"])
        if UserUtils.validate_rolecodes(rolecodes) == False:
            log_info("Role validation failed", MODULE_CONTEXT)
            return post_error("Invalid data", "Rolecode given is not valid", None)
        log_info("Role/s validated", MODULE_CONTEXT)

    @staticmethod
    def validate_user_input_updation(user):
        """Validating user updation inputs.

        -Mandatory key checks
        -User Id Validation
        -Email Validation
        -Org Validation
        -Role Validation
        -Model Validation
        """
        global role_details
        if user.get("userID") == None:
            return post_error("Data Missing", "userID not found", None)
        user_id = user["userID"]

        try:
            # connecting to mongo instance/collection
            # collections = get_db()[USR_MONGO_COLLECTION]
            collections = db.get_mongo_instance(db_connection,USR_MONGO_COLLECTION)
            # searching User Id with verification status = True
            record = collections.find({"userID": user_id, "is_verified": True})
            if record.count() == 0:
                log_info("User Id validation failed, no such user", MODULE_CONTEXT)
                return post_error(
                    "Data not valid", "No such verified user with the given Id", None
                )
            for value in record:
                if value["is_active"] == False:
                    log_info("User Id validation failed,inactive user", MODULE_CONTEXT)
                    return post_error(
                        "Not active",
                        "This operation is not allowed for an inactive user",
                        None,
                    )
                if "models" in value:
                    user_models = value["models"]
                else:
                    user_models = []
            log_info("User Id validation successful", MODULE_CONTEXT)
        except Exception as e:
            log_exception("Database connection exception ", MODULE_CONTEXT, e)
            return post_error(
                "Database connection exception",
                "An error occurred while connecting to the database:{}".format(str(e)),
                None,
            )

        if user.get("email") != None:
            email_validity = UserUtils.validate_email(user["email"])
            if email_validity == False:
                log_info("Email Id validation failed", MODULE_CONTEXT)
                return post_error("Data not valid", "Email Id given is not valid", None)
            log_info("Email Id validated", MODULE_CONTEXT)

        if user.get("orgID") != None:
            org_validity = OrgUtils.validate_org(str(user["orgID"]).upper())
            if org_validity is not None:
                log_info("Org validation failed", MODULE_CONTEXT)
                return org_validity
            log_info("Org validated", MODULE_CONTEXT)

        rolecodes = []
        if user.get("roleCode") != None:
            rolecodes.append(str(user["roleCode"]))
            role_validity = UserUtils.validate_rolecodes(rolecodes)
            if role_validity == False:
                log_info("Role validation failed", MODULE_CONTEXT)
                return post_error("Invalid data", "Rolecode given is not valid", None)
            log_info("Role validated", MODULE_CONTEXT)
            user["roles_new"] = []
            roles_to_update = {}
            roles_to_update["roleCode"] = str(user["roleCode"]).upper()
            role_desc = [
                x["description"] for x in role_details if x["code"] == user["roleCode"]
            ]
            roles_to_update["roleDesc"] = role_desc[0]
            user["roles_new"].append(roles_to_update)

        if user.get("models") != None:
            new_models = user["models"]
            check_dups = UserUtils.check_model_duplicates(new_models)
            if check_dups is not None:
                log_info(
                    "Models validation failed, duplicate entries found", MODULE_CONTEXT
                )
                return check_dups
            log_info("Models validatied", MODULE_CONTEXT)
            if user_models:
                updated_models = UserUtils.generate_models_to_update(
                    user_models, new_models
                )
                user["models"] = updated_models

    @staticmethod
    def validate_user_login_input(username, password, get_role=False):
        """User credentials validation

        checking whether the user is verified and active,
        password matching.
        """

        try:
            log_info(f"Initial Login validate start for {username}", MODULE_CONTEXT)
            # connecting to mongo instance/collection
            # collections = db.get_mongo_instance(db_connection,USR_MONGO_COLLECTION)
            # collections = get_db()[USR_MONGO_COLLECTION]
            collections = db.get_mongo_instance(db_connection,USR_MONGO_COLLECTION)
            # fetching the user details from db
            log_info("{} find verified start".format(username), MODULE_CONTEXT)
            result = collections.find(
                {"userName": username, "is_verified": True},
                {"password": 1, "_id": 0, "is_active": 1, "roles":1},
            )
            log_info("{} find verified end".format(username), MODULE_CONTEXT)
            if result.count() == 0:
                log_info("{} is not a verified user".format(username), MODULE_CONTEXT)
                return post_error("Not verified", "User account is not verified", None)
            log_info("{} find active start".format(username), MODULE_CONTEXT)
            for value in result:
                role = value['roles'][0]['roleCode']
                if value["is_active"] == False:
                    log_info(
                        "{} is not an active user".format(username), MODULE_CONTEXT
                    )
                    return post_error(
                        "Not active",
                        "This operation is not allowed for an inactive user",
                        None,
                    )
                log_info("{} find active end".format(username), MODULE_CONTEXT)
                log_info("{} find password start".format(username), MODULE_CONTEXT)
                password_in_db = value["password"].encode("utf-8")
                log_info("{} find password encode".format(username), MODULE_CONTEXT)
                try:
                    log_info("{} find password checkpw".format(username), MODULE_CONTEXT)
                    if (
                        bcrypt.checkpw(password.encode("utf-8"), password_in_db)
                        == False
                    ):
                        log_info(
                            "Password validation failed for {}".format(username),
                            MODULE_CONTEXT,
                        )
                        return post_error(
                            "Invalid Credentials",
                            "Incorrect username or password",
                            None,
                        )
                    log_info("{} find password checkpw stop".format(username), MODULE_CONTEXT)
                    # return role if get_role
                    if get_role:
                        return role
                except Exception as e:
                    log_exception(
                        "exception while decoding password", MODULE_CONTEXT, e
                    )
                    return post_error(
                        "exception while decoding password",
                        "exception:{}".format(str(e)),
                        None,
                    )
            log_info("{} find password end".format(username), MODULE_CONTEXT)
            log_info(f"Initial Login validate end for {username}", MODULE_CONTEXT)
        except Exception as e:
            log_exception(
                "exception while validating username and password" + str(e),
                MODULE_CONTEXT,
                e,
            )
            return post_error(
                "Database exception", "Exception occurred:{}".format(str(e)), None
            )

    @staticmethod
    def read_role_codes():
        """Reading roles from git config."""

        try:
            file = requests.get(role_codes_filepath, allow_redirects=True)
            file_path = json_file_dir + json_file_name
            open(file_path, "wb").write(file.content)
            log_info("Roles data read from git and pushed to local", MODULE_CONTEXT)
            with open(file_path, "r") as stream:
                parsed = json.load(stream)
                roles = parsed["roles"]
                rolecodes = []
                role_details = []
                for role in roles:
                    if role["active"]:
                        rolecodes.append(role["code"])
                        role_details.append(role)
            return rolecodes, role_details
        except Exception as exc:
            log_exception(
                "Exception while reading roles: " + str(exc), MODULE_CONTEXT, exc
            )
            return post_error(
                "CONFIG_READ_ERROR",
                "Exception while reading roles: " + str(exc),
                MODULE_CONTEXT,
            )

    @staticmethod
    def generate_email_user_creation(users):
        """Registered users are notified with email."""

        try:
            for user in users:
                email = user["userName"]
                user_id = user["userID"]
                message = generate_email_notification(email)
                message["Subject"] = f" ANUVAAD - Verify Email {email} "
                filename = "./templates/register_mail_template.html"
                ui_link = mail_ui_link
                activation_link = mail_ui_link + "user/activate/{}/{}/{}".format(
                    email, user_id, eval(str(time.time()).replace(".", "")[0:13])
                )
                html_ = open(filename).read()
                html_ = html_.replace("{{ui_link}}", ui_link)
                html_ = html_.replace("{{activation_link}}", activation_link)
                html_ = MIMEText(html_, "html")
                message.add_alternative(html_, subtype="html")
                send_email(message)

                # msg = Message(
                #     subject="Welcome to Anuvaad",
                #     sender="anuvaad.support@tarento.com",
                #     recipients=[email],
                # )
                # msg.html = render_template(
                #     "register_mail_template.html",
                #     ui_link=mail_ui_link,
                #     activation_link=mail_ui_link
                #     + "user/activate/{}/{}/{}".format(
                #         email, user_id, eval(str(time.time()).replace(".", "")[0:13])
                #     ),
                # )
                # mail.send(msg)
                log_info(
                    "Generated email notification for user registration ",
                    MODULE_CONTEXT,
                )
        except Exception as e:
            log_exception(
                "Exception while generating email notification for user registration: "
                + str(e),
                MODULE_CONTEXT,
                e,
            )
            return post_error(
                "Exception while generating email notification for user registration",
                "Exception occurred:{}".format(str(e)),
                None,
            )

    @staticmethod
    def generate_email_reset_password(user_name, rand_id):
        try:
            email = user_name
            message = generate_email_notification(email)
            message["Subject"] = f" ANUVAAD - Reset Password for {email} "
            filename = "./templates/reset_mail_template.html"
            ui_link = mail_ui_link
            reset_link = mail_ui_link + "user/set-password/{}/{}/{}".format(
                email, rand_id, eval(str(time.time()).replace(".", "")[0:13])
            )
            html_ = open(filename).read()
            html_ = html_.replace("{{ui_link}}", ui_link)
            html_ = html_.replace("{{reset_link}}", reset_link)
            html_ = MIMEText(html_, "html")
            message.add_alternative(html_, subtype="html")
            send_email(message)
            # msg = Message(
            #     subject="[Anuvaad] Please reset your Password ",
            #     sender="anuvaad.support@tarento.com",
            #     recipients=[email],
            # )
            # msg.html = render_template(
            #     "reset_mail_template.html",
            #     ui_link=mail_ui_link,
            #     reset_link=mail_ui_link
            #     + "user/set-password/{}/{}/{}".format(
            #         email, rand_id, eval(str(time.time()).replace(".", "")[0:13])
            #     ),
            # )
            # mail.send(msg)
            log_info(
                "Generated email notification for {} on reset password".format(email),
                MODULE_CONTEXT,
            )
        except Exception as e:
            log_exception(
                "Exception while generating reset password notification: " + str(e),
                MODULE_CONTEXT,
                e,
            )
            return post_error(
                "Exception while generating reset password notification",
                "Exception occurred:{}".format(str(e)),
                None,
            )

    @staticmethod
    def validate_username(user_name,get_email=False):
        """Validating userName/Email"""

        try:
            # connecting to mongo instance/collection
            # collections = get_db()[USR_MONGO_COLLECTION]
            collections = db.get_mongo_instance(db_connection,USR_MONGO_COLLECTION)
            # searching for record matching user_name
            valid = collections.find({"userName": user_name, "is_verified": True})
            if valid.count() == 0:
                log_info("Not a valid email/username", MODULE_CONTEXT)
                return post_error(
                    "Not Valid",
                    "Given email/username is not associated with any of the active Anuvaad accounts",
                    None,
                )
            for value in valid:
                if value["is_active"] == False:
                    log_info("Given email/username is inactive", MODULE_CONTEXT)
                    return post_error(
                        "Not active",
                        "This operation is not allowed for an inactive user",
                        None,
                    )
                if get_email:
                    return {"email":value["email"]} 
        except Exception as e:
            log_exception(
                "exception while validating username/email" + str(e), MODULE_CONTEXT, e
            )
            return post_error(
                "Database exception", "Exception occurred:{}".format(str(e)), None
            )

    @staticmethod
    def generate_models_to_update(user_models, new_models):
        """Model updation

        existing models of respective lang pairs are replaced with new models if applicable,
        more than 1 model of same lang pair are not allowed for a user at a time.
        """

        models_to_replace = []
        for old in user_models:
            for new in new_models:
                # matching src,tgt lang pairs of old and new models
                if (
                    old["src_lang"] == new["src_lang"]
                    and old["tgt_lang"] == new["tgt_lang"]
                ):
                    models_to_replace.append(old)
        # retrieving old models if no new models are there to update
        models = [x for x in user_models if x not in models_to_replace]
        # new models - old + new
        models.extend(new_models)
        return models

    @staticmethod
    def check_model_duplicates(models):
        """Check on models for duplicate entries

        Multiple models of same lang pair are not allowed at a time for a user.
        """

        dup = []
        for model in models:
            dup.append((model["src_lang"], model["tgt_lang"]))
        counter = Counter(dup)
        for count in counter:
            if counter[count] > 1:
                return post_error(
                    "Not Valid",
                    "Multiple models of same language pair cannot be assigned at a time to a user",
                    None,
                )

    @staticmethod
    def decrypt_token(encrypted_message, nonce_encoded):
        """nacl secret decryption"""
        try:
            nonce = b64decode(nonce_encoded)
            encrypted = b64decode(encrypted_message)
            box = SecretBox(bytes(ex_secret_key, encoding="utf8"))
            decrypted = box.decrypt(encrypted, nonce).decode("utf-8")
            return decrypted
        except Exception as e:
            log_info("Token decryption failed", MODULE_CONTEXT)
            return None

    @staticmethod
    def validate_extension_usr_token(token_request):
        try:
            tokens = token_request.split("::")
            if tokens[1] != config.EXTENSION_CODE:
                log_info(
                    "Extension code is missing in the request received", MODULE_CONTEXT
                )
                return None
            current_timestamp = eval(str(time.time()).replace(".", "")[0:13])
            if current_timestamp - eval(tokens[2]) > config.EXTENSION_EXPIRY:
                log_info("Time exceeded for the request received", MODULE_CONTEXT)
                return None
            return tokens[0]
        except Exception as e:
            return None

    @staticmethod
    def fetch_email(username):
        try:
            collections = get_db()[USR_MONGO_COLLECTION]
            # fetching the user details from db
            log_info(f"{username=} find start", MODULE_CONTEXT)
            record = collections.find({"userName": username})
            log_info(f"{username=} find end", MODULE_CONTEXT)
            for i in record:
                return i['email']
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
