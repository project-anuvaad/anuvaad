import logging
import os
import time

DEBUG = True
API_URL_PREFIX = "/api/v0"
HOST = '0.0.0.0'
PORT = 5001

ENABLE_CORS = False

# kafka
html_input_topic = 'anuvaad-dp-tools-html-json-input'
kf_local_server = 'localhost:9092'
html_output_topic = 'anuvaad-dp-tools-html-json-output'
kafka_ip_host = 'KAFKA_IP_HOST'
bootstrap_server = os.environ.get(kafka_ip_host, kf_local_server)

#folders and file path
download_folder = 'upload'
task_id = str("Html2Json-" + str(time.time()).replace('.', ''))


#urls
base_url_path = 'https://auth.anuvaad.org'

logging.basicConfig(
    filename=os.getenv("SERVICE_LOG", "server.log"),
    level=logging.DEBUG,
    format="%(levelname)s: %(asctime)s \
        pid:%(process)s module:%(module)s %(message)s",
    datefmt="%d/%m/%y %H:%M:%S",
)
