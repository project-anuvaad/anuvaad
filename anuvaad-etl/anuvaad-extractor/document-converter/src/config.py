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
#external_gateway_url_fetch_data = 'https://auth.anuvaad.org/api/v0/fetch-content?record_id=FC-BM-TOK-TRANS-1602165339279|0-16021653501622374.json&start_page=0&end_page=0'
# "Authorization":"Bearer fcaa45d8ce284697846cf0976df28d73|dd2d80923bb148cf9f5be18f36f35e6b"