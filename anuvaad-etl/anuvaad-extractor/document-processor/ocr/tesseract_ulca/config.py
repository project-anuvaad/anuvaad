#import logging
import os
import time
DEBUG = False
API_URL_PREFIX = "/anuvaad/ocr"
HOST = '0.0.0.0'
PORT = 5001



ENABLE_CORS = False
IS_DYNAMIC =True
EXRACTION_RESOLUTION  =  300


LANG_MAPPING = {
    'en' : ['Latin','eng'],
    'hi' : ['anuvaad-hi','Devanagari'],
    'ta' :  ['anuvaad-ta','Tamil'],
    'bn' : 2


}