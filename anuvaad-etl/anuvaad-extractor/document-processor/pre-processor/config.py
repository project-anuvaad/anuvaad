import logging
import os
import time

DEBUG = True
API_URL_PREFIX = "/anuvaad/anuvaad-etl/pre-processor"
HOST = '0.0.0.0'
PORT = 5002

ENABLE_CORS = False

# folders and file path
download_folder = 'upload'

TASK_STAT = "PRE-PROCESS"

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
# MONGO_IP = 'MONGO_CLUSTER_URL'
# DEFAULT_VALUE = 'localhost'
# MONGO_DB_IDENTIFIER = 'MONGO_FU_DB'
# MONGO_DB_IDENTIFIER = 'MONGO_FU_DB'
# DEFAULT_MONGO_DB_IDENTIFIER = 'preprocessing'
# MONGO_SERVER_URL = os.environ.get(MONGO_IP, DEFAULT_VALUE)
# MONGO_DB = os.environ.get(MONGO_DB_IDENTIFIER, DEFAULT_MONGO_DB_IDENTIFIER)

# Application configuration
MAX_UPLOAD_SIZE = os.environ.get('MAX_FILE_UPLOAD_SIZE', 100)

##########################################################################
# Alignment
EAST_MODEL = "./src/utilities/east/frozen_east_text_detection.pb"
ANGLE_TOLLERANCE  = 0.25
MIN_CONFIDENCE    = 0.5
MARGIN_TOLLERANCE = 9
EAST_WIDTH        = 1280
EAST_HEIGHT       = 1280
ALIGN = False
ALIGN_MODE = 'FAST'
###########################################################################

WATERMARK = True
WATERMARK_THRESHOLD_LOW = 175
WATERMARK_THRESHOLD_HIGH = 250
EXRACTION_RESOLUTION = 300
