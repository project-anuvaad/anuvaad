import logging
import os

DEBUG = True
API_URL_PREFIX = "/api/v0"
HOST = '0.0.0.0'
PORT = 5001

mix_model_dir = '/opt/share/python/upload/models/exp_3_mix/'
model_dir_order = '/opt/share/python/upload/models/exp_3_order/'
model_dir_judgment = '/opt/share/python/upload/models/exp_3_judgment/'

ENABLE_CORS = False

# kafka
ner_input_topic = 'anuvaad-dp-tools-ner-input'
kf_local_server = 'localhost:9092'
ner_output_topic = 'anuvaad-dp-tools-ner-output'
kafka_ip_host = 'KAFKA_IP_HOST'
bootstrap_server = os.environ.get(kafka_ip_host, kf_local_server)

#folders and file path
download_folder = 'upload'

logging.basicConfig(
    filename=os.getenv("SERVICE_LOG", "server.log"),
    level=logging.DEBUG,
    format="%(levelname)s: %(asctime)s \
        pid:%(process)s module:%(module)s %(message)s",
    datefmt="%d/%m/%y %H:%M:%S",
)
