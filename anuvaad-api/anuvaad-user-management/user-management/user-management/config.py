import os
import time

#CROSS_MODULE_COMMON_CONFIGS
MONGO_SERVER_HOST   =   os.environ.get('MONGO_CLUSTER_URL', 'mongodb://localhost:27017')#,localhost:27018/?replicaSet=foo


#MODULE-SPECIFIC-CONFIGS

#module configs
DEBUG   =   False
CONTEXT_PATH    =   "/anuvaad/user-mgmt"
HOST    =   '0.0.0.0'
PORT    =   5001
ENABLE_CORS =   False

#mongodb-configs
MONGO_DB_SCHEMA                 =   os.environ.get('MONGO_DB_IDENTIFIER', 'usermanagement')
USR_MONGO_COLLECTION            =   os.environ.get('UMS_USR_COLLECTION', 'sample')
USR_TOKEN_MONGO_COLLECTION      =   os.environ.get('UMS_USR_TOKEN_COLLECTION', 'usertokens')
USR_TEMP_TOKEN_MONGO_COLLECTION =   os.environ.get('UMS_USR_TEMP_TOKEN_COLLECTION', 'usertemptoken')
USR_ORG_MONGO_COLLECTION        =   os.environ.get('UMS_ORG_COLLECTION', 'organization')
EX_USR_MONGO_COLLECTION         =   os.environ.get('UMS_EX_USR_COLLECTION', 'exusers')
EX_USR_TOKEN_MONGO_COLLECTION   =   os.environ.get('UMS_EX_USR_TOKEN_COLLECTION', 'exusertokens')
#common-variables
MIN_LENGTH              =   os.environ.get('UMS_PASSWORD_MIN_LENGTH', 6)
if isinstance(MIN_LENGTH, str):
    MIN_LENGTH  =  eval(MIN_LENGTH)

OFFSET_VALUE            =   os.environ.get('UMS_OFFSET_VALUE', 0)
if isinstance(OFFSET_VALUE, str):
    OFFSET_VALUE  =  eval(OFFSET_VALUE)

LIMIT_VALUE             =   os.environ.get('UMS_LIMIT_VALUE', 20)
if isinstance(LIMIT_VALUE, str):
    LIMIT_VALUE  =  eval(LIMIT_VALUE)

AUTH_TOKEN_EXPIRY_HRS   =   os.environ.get('UMS_TOKEN_EXP_HRS', 24)
if isinstance(AUTH_TOKEN_EXPIRY_HRS, str):
    AUTH_TOKEN_EXPIRY_HRS  =  eval(AUTH_TOKEN_EXPIRY_HRS)

ADMIN_ROLE_KEY          =   os.environ.get('UMS_ADMIN_ROLE_KEY','ADMIN')
SUPER_ADMIN_ROLE_KEY    =   os.environ.get('UMS_SUPERADMIN_ROLE_KEY','SUPERADMIN')
EXTENSION_USR_ROLE_KEY  =   os.environ.get('UMS_EXTENSION_USER','EXTENSION')
SECRET_KEY              =   os.environ.get('EXTENSION_SECRET_KEY','85U62e26b2aJ68dae8eQc188e0c8z8J9')
EXTENSION_CODE          =   os.environ.get('EXTENSION_URL_CODE','extn')
EXTENSION_EXPIRY        =   os.environ.get('EXTENSION_EXPIRY_IN_MS',300000)
if isinstance(EXTENSION_EXPIRY, str):
    EXTENSION_EXPIRY  =  eval(EXTENSION_EXPIRY)
EXTENSION_ORG           =   os.environ.get('EXTENSION_USR_ORG','ANUVAAD')
#external file read configs
ROLE_CODES_URL          =   os.environ.get('UMS_ROLE_CODES_URL','https://raw.githubusercontent.com/project-anuvaad/anuvaad/master/anuvaad-api/anuvaad-zuul-api-gw/dev-configs/roles.json')
ROLE_CODES_DIR_PATH     =   os.environ.get('UMS_ROLE_DIR_PATH','/app/configs/') #'/home/jainy/Documents/Anuvaad_local_files/usrmgmt/'
ROLE_CODES_FILE_NAME    =   os.environ.get('UMS_FILE_NAME','roles.json')

#gmail server configs
MAIL_SETTINGS           =   {
                            "MAIL_SERVER": 'smtp.gmail.com',
                            "MAIL_PORT": 465,
                            "MAIL_USE_TLS": False,
                            "MAIL_USE_SSL": True,
                            "MAIL_USERNAME": os.environ.get('SUPPORT_EMAIL','XXXXX'),
                            "MAIL_PASSWORD": os.environ.get('SUPPORT_EMAIL_PASSWORD','xxxxx')
                            }

#React-app base url
BASE_URL                =   os.environ.get('REACT_APP_BASE_URL','https://developers.anuvaad.org/')

