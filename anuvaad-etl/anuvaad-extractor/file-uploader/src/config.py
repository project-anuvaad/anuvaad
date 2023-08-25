import logging
import os
import time

DEBUG = False
API_URL_PREFIX = "/anuvaad-api/file-uploader"
HOST = '0.0.0.0'
PORT = 5001

ENABLE_CORS = False

# folders and file path
download_folder = 'upload'

ALLOWED_FILE_TYPES = ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/html',
                      'application/vnd.ms-excel', 'application/vnd.ms-powerpoint',
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      'application/vnd.oasis.opendocument.spreadsheet', 'application/zip', 'application/octet-stream',
                      'application/msword', 'application/pdf', 'image/x-ms-bmp', 'image/jpeg', 'image/jpg', 'image/png',
                      'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                      'application/json', 'application/vnd.oasis.opendocument.text', 'application/xml', 'image/bmp',
                      'text/csv']
ALLOWED_FILE_EXTENSIONS = ['json', 'xlm', 'xla', 'xls', 'xlsx', 'excel', 'xlsm', 'xlt', 'xltx', 'xlsb', 'odt', 'pdf',
                           'txt', 'ods', 'pptx', 'ppt', 'doc', 'docx', 'docm', 'png', 'jpg', 'jpeg', 'bmp', 'csv']

# mongo
MONGO_IP = 'MONGO_CLUSTER_URL'
DEFAULT_VALUE = 'localhost'
MONGO_DB_IDENTIFIER = 'MONGO_FU_DB'
MONGO_DB_IDENTIFIER = 'MONGO_FU_DB'
DEFAULT_MONGO_DB_IDENTIFIER = 'preprocessing'
MONGO_SERVER_URL = os.environ.get(MONGO_IP, DEFAULT_VALUE)
MONGO_DB = os.environ.get(MONGO_DB_IDENTIFIER, DEFAULT_MONGO_DB_IDENTIFIER)

aws_access_key = os.environ.get('FT_AWS_S3_ACCESS_KEY', '**********')
aws_secret_key = os.environ.get('FT_AWS_S3_SECRET_KEY', '**********')
aws_bucket_name = os.environ.get('FT_AWS_BUCKET_NAME', 'anuvaad1')
aws_link_prefix = f'https://{aws_bucket_name}.s3.amazonaws.com/'


# Content Handler
FETCH_CONTENT_URL_DEFAULT = 'http://gateway_anuvaad-content-handler:5001/'
FETCH_CONTENT_URL_VAR = 'CONTENT_HANDLER_URL'
CH_URL = os.environ.get(FETCH_CONTENT_URL_VAR, FETCH_CONTENT_URL_DEFAULT)

#Workflow manager Granularity
WFM_GRANULARITY_DEFAULT = 'http://gateway_anuvaad-etl-wf-manager:5001/'
WFM_GRANULARITY_VAR = 'WORKFLOW_MANAGER_URL'
WFM_GRANULARITY =  os.environ.get(WFM_GRANULARITY_VAR, WFM_GRANULARITY_DEFAULT)

WFM_GRANULARITY_END_POINT = "anuvaad-etl/wf-manager/v1/workflow/setGranularity"

FETCH_CONTENT_ENDPOINT = 'anuvaad/content-handler/v0/fetch-content'
REF_LINK_STORE_ENDPOINT = 'anuvaad/content-handler/v0/ref-link/store'

# Application configuration
MAX_UPLOAD_SIZE = os.environ.get('MAX_FILE_UPLOAD_SIZE', 100)
page_limit = 200
