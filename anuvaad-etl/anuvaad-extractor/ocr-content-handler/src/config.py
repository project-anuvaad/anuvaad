import os
import time

DEBUG = False
API_URL_PREFIX = "/anuvaad/ocr-content-handler"
HOST = '0.0.0.0'
PORT = 5001

ENABLE_CORS = False

# mongo config

MONGO_DB_SCHEMA         = os.environ.get('MONGO_OCR_CH_DB', 'anuvaad-ocr-contenthandler')
MONGO_CONNECTION_URL    = os.environ.get('MONGO_CLUSTER_URL', 'mongodb://localhost:27017')

