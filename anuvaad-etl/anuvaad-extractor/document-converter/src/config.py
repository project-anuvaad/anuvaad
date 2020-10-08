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
#external_gateway_url_fetch_data = 'https://auth.anuvaad.org/api/v0/fetch-content?record_id=FC-BM-TOK-TRANS-1602131286324|0-1602131319572397.json&start_page=0&end_page=0'
# "Authorization":"Bearer 3e8e9a33265f40d9baf24a092093ed09|bcb2ca91d0ca489d8895b84ab909c2af"