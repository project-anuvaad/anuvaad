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