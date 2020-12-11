import logging
import os
import time

DEBUG = True
API_URL_PREFIX = "/anuvaad-etl/document-processor/layout-detector"
HOST = '0.0.0.0'
PORT = 5001
BASE_DIR      = 'upload'

ENABLE_CORS = False

# kafka

input_topic_default = 'anuvaad-dp-tools-layout-detector-prima-input-v1'
input_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_LAYOUT_DETECTOR_PRIMA_INPUT'
input_topic = os.environ.get(input_topic_identifier, input_topic_default)

output_topic_default = 'anuvaad-dp-tools-layout-detector-prima-output-v1'
output_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_LAYOUT_DETECTOR_PRIMA_OUTPUT'
output_topic = os.environ.get(output_topic_identifier, output_topic_default)

kf_local_server     = 'localhost:9092'

kafka_ip_host       = 'KAFKA_BOOTSTRAP_SERVER_HOST'
bootstrap_server    = os.environ.get(kafka_ip_host, kf_local_server)

TASK_STAT           = 'PRIMA-LAYOUT-DETECTOR'

CONSUMER_GROUP_default       = 'anuvaad-etl-ld-consumer-group'
CONSUMER_GROUP_identifier    = 'KAFKA_ANUVAAD_ETL_LD_CONSUMER_GRP'
CONSUMER_GROUP               = os.environ.get(CONSUMER_GROUP_identifier,CONSUMER_GROUP_default)
#folders and file path
download_folder = 'upload'


logging.basicConfig(
    filename=os.getenv("SERVICE_LOG", "server.log"),
    level=logging.DEBUG,
    format="%(levelname)s: %(asctime)s \
        pid:%(process)s module:%(module)s %(message)s",
    datefmt="%d/%m/%y %H:%M:%S",
)

PRIMA_SCORE_THRESH_TEST =0.5

