import os

## app configuration variables
DEBUG = False
API_URL_PREFIX = ""
HOST = '0.0.0.0'
PORT = 5001

ENABLE_CORS = True

## application base path
APP_BASE_PATH = "src/"

## Module name
MODULE_NAME = "/anuvaad-nmt-adapter"

##Google credentials
GOOGLE_APPLICATION_CREDENTIALS = os.environ['GOOGLE_APPLICATION_CREDENTIALS']
PROJECT_ID = os.environ['PROJECT_ID']