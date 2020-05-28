import logging
import os

DEBUG = True
API_URL_PREFIX = "/api/v0"
HOST = '0.0.0.0'
PORT = 5001

ENABLE_CORS = False

# kafka
sen_topic = 'paragraph_file'
kf_local_server = 'localhost:9092'
kf_group = 'tokenisation'
tok_topic = 'tokenise_sentence'
kafka_ip_host = 'KAFKA_IP_HOST'
bootstrap_server = os.environ.get(kafka_ip_host, kf_local_server)

#folders
upload_folder = 'upload_folder'
download_folder = 'download_folder'

#process id
taskid = '123456'

logging.basicConfig(
    filename=os.getenv("SERVICE_LOG", "server.log"),
    level=logging.DEBUG,
    format="%(levelname)s: %(asctime)s \
        pid:%(process)s module:%(module)s %(message)s",
    datefmt="%d/%m/%y %H:%M:%S",
)
