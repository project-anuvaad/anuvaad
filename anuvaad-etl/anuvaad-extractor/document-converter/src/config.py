import os
import time

DEBUG = False
API_URL_PREFIX = "/api/v0"
HOST = '0.0.0.0'
PORT = 5001

ENABLE_CORS = False

#folders and file path
download_folder = 'upload'

# internal url
internal_gateway_url_fetch_data = 'http://gateway_anuvaad-content-handler:5001/api/v0/fetch-content'
external_gateway_url_fetch_data = 'https://auth.anuvaad.org/api/v0/fetch-content?record_id=FC-BM-TOK-TRANS-1602148081545|0-16021481022584155.json&start_page=0&end_page=0'