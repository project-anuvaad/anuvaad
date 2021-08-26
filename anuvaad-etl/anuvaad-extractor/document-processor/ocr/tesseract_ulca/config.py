#import logging
import os
import time
DEBUG = False
API_URL_PREFIX = "/anuvaad-etl/document-processor/gv-document-digitization"
HOST = '0.0.0.0'
PORT = 5001
BASE_DIR      = 'upload'
#BASE_DIR      = '/home/naresh/anuvaad/anuvaad-etl/anuvaad-extractor/document-processor/ocr/ocr-gv-server/'
download_folder = 'upload'


ENABLE_CORS = False
IS_DYNAMIC =True
EXRACTION_RESOLUTION  =  300


LANG_MAPPING = {
    'en' : ['Latin'],
    'hi' : ['anuvaad-hi','Devanagari'],
    'ta' :  ['anuvaad-ta','Tamil'],
    'bn' : 2


}