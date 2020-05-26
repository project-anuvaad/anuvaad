import logging
import os

DEBUG = True
API_URL_PREFIX = "/api/v0"
HOST = 'localhost'
PORT = 5000

ENABLE_CORS = False

# kafka
sen_topic = 'txt_paragraph'
kf_server = 'localhost:9092'
kf_group = 'tokenisation'

#folders
upload_folder = 'upload_folder'
download_folder = 'download_folder'

logging.basicConfig(
    filename=os.getenv("SERVICE_LOG", "server.log"),
    level=logging.DEBUG,
    format="%(levelname)s: %(asctime)s \
        pid:%(process)s module:%(module)s %(message)s",
    datefmt="%d/%m/%y %H:%M:%S",
)
