import os
import time

DEBUG = False
API_URL_PREFIX = "/anuvaad/content-handler"
HOST = '0.0.0.0'
PORT = 5001

ENABLE_CORS = False

#folders and file path
download_folder = 'upload'
# new mongo config
MONGO_DB_SCHEMA         = os.environ.get('MONGO_CH_DB', 'preprocessing')
MONGO_CONNECTION_URL    = os.environ.get('MONGO_CLUSTER_URL', 'mongodb://localhost:27017')

DICTIONARY_FALLBACK     = os.environ.get('DICTIONARY_FALLBACK_CH', True)