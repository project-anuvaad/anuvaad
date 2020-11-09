import os
import time

DEBUG = False
API_URL_PREFIX = "/api/v0"
HOST = '0.0.0.0'
PORT = 5001

ENABLE_CORS = False

#folders and file path
download_folder = 'upload'
# new mongo config
MONGO_DB_HOST   = os.environ.get('MONGO_IP', '192.168.1.9')
MONGO_DB_PORT   = os.environ.get('MONGO_PORT', 27017)
MONGO_DB_SCHEMA = os.environ.get('MONGO_DB_IDENTIFIER', 'preprocessing')
