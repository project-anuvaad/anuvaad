import os
import time

DEBUG = False
context_path = "/anuvaad-etl/document-converter"
HOST = '0.0.0.0'
PORT = 5001

ENABLE_CORS = False

#folders and file path
download_folder = '/home/jainy/Documents/upload'

WORKING_DIR      = os.path.dirname(os.getcwd())
FONT_DIR         = os.path.join(WORKING_DIR, 'font')
DATA_DIR         = os.path.join(WORKING_DIR, 'data')
DATA_OUTPUT_DIR  = os.path.join(DATA_DIR, 'output')


# internal url
CONTENT_HANDLER_ENDPOINT    = os.environ.get('CONTENT_HANDLER_SERVER_URL', 'http://gateway_anuvaad-content-handler:5001/')
FILE_CONVERTER_ENDPOINT     = os.environ.get('FILE_CONVERTER_SERVER_URL', 'http://gateway_anuvaad-file-converter:5001/')


# OCR_CONTENT_HANDLER_ENDPOINT    = os.environ.get('OCR_CONTENT_HANDLER_SERVER_URL', 'http://172.30.0.232:5009/')
OCR_CONTENT_HANDLER_ENDPOINT    = os.environ.get('OCR_CONTENT_HANDLER_SERVER_URL', 'https://auth.anuvaad.org')
FILE_CONVERTER_ENDPOINT     = os.environ.get('FILE_CONVERTER_SERVER_URL', 'http://gateway_anuvaad-file-converter:5001/')
