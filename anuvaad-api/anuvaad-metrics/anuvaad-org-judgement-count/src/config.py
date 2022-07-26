import os
import pymongo

## app configuration variables
DEBUG = False
API_URL_PREFIX = "/anuvaad-metrics-api"
HOST = '0.0.0.0'
PORT = 5001

ENABLE_CORS = True


MONGO_SERVER_URL = os.environ.get('MONGO_CLUSTER_URL', 'mongodb://localhost:27017')
USER_DB = os.environ.get('MONGO_DB_IDENTIFIER', 'usermanagement')
WFM_DB = os.environ.get('MONGO_WFM_DB', 'anuvaad-etl-wfm-db')
PREPROCESSING_DB = os.environ.get('MONGO_CH_DB', 'preprocessing')


USER_COLLECTION =  'sample'
WFM_COLLECTION =  'anuvaad-etl-wfm-jobs-collection'
FILE_CONTENT_COLLECTION =  'file_content'

DOWNLOAD_FOLDER = 'upload'
USERMANAGEMENT    = os.environ.get('USERMANAGEMENT_URL', 'http://gateway_anuvaad-user-management:5001')

#gmail server configs
MAIL_SETTINGS               =   {
                                "MAIL_SERVER"   : os.environ.get('ANUVAAD_EMAIL_SERVER','smtp.gmail.com'),
                                "MAIL_PORT"     : eval(os.environ.get('ANUVAAD_EMAIL_SECURE_PORT','465')),
                                "MAIL_USE_TLS"  : False,
                                "MAIL_USE_SSL"  : True,
                                "MAIL_USERNAME" : os.environ.get('SUPPORT_EMAIL','xxxxxxxxxxxxxxxxx'),
                                "MAIL_PASSWORD" : os.environ.get('SUPPORT_EMAIL_PASSWORD','xxxxxxxxxxxxxx')
                                }
MAIL_SENDER                 =   os.environ.get('SUPPORT_EMAIL','xxxxxxxxxxx')
