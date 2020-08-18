import logging
import os
import time

DEBUG = True
API_URL_PREFIX = "/api/v0"
HOST = '0.0.0.0'
PORT = 5001

ENABLE_CORS = False

#folders and file path
download_folder = 'upload'

ALLOWED_FILE_TYPES = ['application/msword','application/pdf','image/x-ms-bmp','image/jpeg','image/jpg','image/png','text/plain','application/vnd.openxmlformats-officedocument.wordprocessingml.document']



logging.basicConfig(
    filename=os.getenv("SERVICE_LOG", "server.log"),
    level=logging.DEBUG,
    format="%(levelname)s: %(asctime)s \
        pid:%(process)s module:%(module)s %(message)s",
    datefmt="%d/%m/%y %H:%M:%S",
)
