import os
import time

DEBUG           = False
API_URL_PREFIX  = "/anuvaad/content-handler"
HOST            = '0.0.0.0'
PORT            = 5001

ENABLE_CORS     = False

#folders and file path
download_folder = 'upload'
# new mongo config

MONGO_DB_SCHEMA         = os.environ.get('MONGO_CH_DB', 'preprocessing')
MONGO_CONNECTION_URL    = os.environ.get('MONGO_CLUSTER_URL', 'mongodb://localhost:27017')

#redis config
REDIS_SERVER_PREFIX     = os.environ.get('REDIS_PREFIX', 'redis')
REDIS_SERVER_HOST       = os.environ.get('REDIS_URL', 'localhost')
REDIS_SERVER_PORT       = os.environ.get('REDIS_PORT', 6379)

#module level variables
DICTIONARY_FALLBACK       = os.environ.get('DICTIONARY_FALLBACK_CH', True)
USER_TRANSLATION_ENABLED  = os.environ.get('USER_TRANSLATION_ENABLED',True)

#schema for s3 link storage

MONGO_s3_LINK_STORE     = os.environ.get('CH_S3_LINK_COLLECTION','link_store')