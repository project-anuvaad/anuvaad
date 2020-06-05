import logging
import os
import time

DEBUG = True
API_URL_PREFIX = "/api/v0"
HOST = '0.0.0.0'
PORT = 5001

ENABLE_CORS = False

# kafka
sen_topic = 'anuvaad-dp-tools-tokeniser-input_1'
kf_local_server = 'localhost:9092'
# kf_group = 'exp_tokenisation'
tok_topic = 'anuvaad-dp-tools-tokeniser-output_2'
kafka_ip_host = 'KAFKA_IP_HOST'
bootstrap_server = os.environ.get(kafka_ip_host, kf_local_server)

#folders and file path
download_folder = 'upload'


#process id
#taskid = str("TOK-" + str(int(time.time())))

logging.basicConfig(
    filename=os.getenv("SERVICE_LOG", "server.log"),
    level=logging.DEBUG,
    format="%(levelname)s: %(asctime)s \
        pid:%(process)s module:%(module)s %(message)s",
    datefmt="%d/%m/%y %H:%M:%S",
)
