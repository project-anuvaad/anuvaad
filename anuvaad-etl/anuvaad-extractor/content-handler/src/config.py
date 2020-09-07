import logging
import os
import time

DEBUG = False
API_URL_PREFIX = "/api/v0"
HOST = '0.0.0.0'
PORT = 5001

ENABLE_CORS = False

#folders and file path
download_folder = 'upload'


BLOCK_TYPES = [{'key':'lines'},{'key':'images'},{'key':'tables'},{'key':'text_blocks'}]

#mongo
MONGO_IP = 'MONGO_IP'
DEFAULT_VALUE = 'localhost'
MONGO_DB_IDENTIFIER = 'MONGO_DB'
DEFAULT_MONGO_DB_IDENTIFIER = 'preprocessing'
MONGO_SERVER_URL = os.environ.get(MONGO_IP, DEFAULT_VALUE)
MONGO_DB = os.environ.get(MONGO_DB_IDENTIFIER, DEFAULT_MONGO_DB_IDENTIFIER)


logging.basicConfig(
    filename=os.getenv("SERVICE_LOG", "server.log"),
    level=logging.DEBUG,
    format="%(levelname)s: %(asctime)s \
        pid:%(process)s module:%(module)s %(message)s",
    datefmt="%d/%m/%y %H:%M:%S",
)
