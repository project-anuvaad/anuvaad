import os
import time

context_path = "/anuvaad-etl/document-converter"

DEBUG = False
HOST = '0.0.0.0'
PORT = 5001

ENABLE_CORS = False

#folders and file path
download_folder = 'upload'

FONT_DIR         = os.environ.get('DOC_EXPORTER_FONTS','fonts')
DATA_OUTPUT_DIR  = os.environ.get('DOC_EXPORTER_OUTPUT_FOLDER','upload')


# internal url
CONTENT_HANDLER_ENDPOINT    = os.environ.get('CONTENT_HANDLER_SERVER_URL', 'http://gateway_anuvaad-content-handler:5001')
FILE_CONVERTER_ENDPOINT     = os.environ.get('FILE_CONVERTER_SERVER_URL', 'http://gateway_anuvaad-file-converter:5001/')


OCR_CONTENT_HANDLER_HOST    = os.environ.get('OCR_CONTENT_HANDLER_SERVER_URL', 'http://172.30.0.232:5009/')
