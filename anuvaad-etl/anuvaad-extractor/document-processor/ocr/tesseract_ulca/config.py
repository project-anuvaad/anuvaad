#import logging
DEBUG = False
API_URL_PREFIX = "/anuvaad/ocr"
HOST = '0.0.0.0'
PORT = 5000


ENABLE_CORS = False
IS_DYNAMIC = True
EXRACTION_RESOLUTION = 300


LANG_MAPPING = {
    'en': ['Latin', 'eng'],
    'hi': ['anuvaad_hin', 'Devanagari'],
    'ta':  ['anuvaad_tam', 'Tamil'],
    'bn': ['Bengali'],
    'kn': ['Kannada'],
    'ml': ['Malayalam'],
    'te': ['Telugu']
}
