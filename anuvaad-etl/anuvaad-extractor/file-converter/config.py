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

TASK_STAT = 'FILE-CONVERTED'

# kafka
tok_input_topic = 'anuvaad-dp-tools-fc-input'
kf_local_server = 'localhost:9092'
tok_output_topic = 'anuvaad-dp-tools-fc-output'
kafka_ip_host = 'KAFKA_SERVER_URL'
bootstrap_server = os.environ.get(kafka_ip_host, kf_local_server)


logging.basicConfig(
    filename=os.getenv("SERVICE_LOG", "server.log"),
    level=logging.DEBUG,
    format="%(levelname)s: %(asctime)s \
        pid:%(process)s module:%(module)s %(message)s",
    datefmt="%d/%m/%y %H:%M:%S",
)
