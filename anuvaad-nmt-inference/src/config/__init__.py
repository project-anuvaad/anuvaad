from .kafka_topics import kafka_topic, bootstrap_server_boolean, bootstrap_server
import os

## app configuration variables
DEBUG = False
API_URL_PREFIX = ""
HOST = '0.0.0.0'
PORT = 5001

ENABLE_CORS = True

## application base path
APP_BASE_PATH = "src/"

## config file 
ICONFG_FILE = os.path.join(APP_BASE_PATH, 'config/iconf.json')

## Module name
MODULE_NAME = "/nmt-inference"

## fetch model details
FETCH_MODEL_CONFG = os.path.join(APP_BASE_PATH, 'config/fetch_models.json')

## LaBSE model path
LABSE_PATH = os.path.join(APP_BASE_PATH, 'available_nmt_models/sbert.net_models_LaBSE')

## DB details
MONGO_SERVER_URL = os.environ.get('MONGO_CLUSTER_URL', 'localhost:27017')
DB_NAME = os.environ.get('MONGO_NMT_DB', 'anvaad-nmt-inference')
MONGO_NMT_MODELS_COLLECTION = os.environ.get('MONGO_NMT_MODELS_COLLECTION', 'anvaad-nmt-models')

## Supported languages (ISO-639-1 codes)
source = ['en','hi','mr','ta','te','kn','gu','pa','bn','ml','as','brx','doi','ks','kok','mai','mni','ne','or','sd','si','ur','sat','lus','njz','pnr','kha','grt','sa']

## truncation limit for sentence length
trunc_limit = 180