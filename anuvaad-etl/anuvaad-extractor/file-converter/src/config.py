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

TASK_STAT = 'FILE-CONVERTER'

CONSUMER_GROUP = 'anuvaad-etl-fc-consumer-group'

#mongo
MONGO_IP = 'MONGO_IP'
DEFAULT_VALUE = 'localhost'
MONGO_DB_IDENTIFIER = 'MONGO_DB'
DEFAULT_MONGO_DB_IDENTIFIER = 'preprocessing'
MONGO_SERVER_URL = os.environ.get(MONGO_IP, DEFAULT_VALUE)
MONGO_DB = os.environ.get(MONGO_DB_IDENTIFIER, DEFAULT_MONGO_DB_IDENTIFIER)

# kafka
tok_input_topic_default = 'anuvaad-dp-tools-fc-input-v1'
tok_input_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_FC_INPUT'
tok_input_topic = os.environ.get(tok_input_topic_identifier, tok_input_topic_default)

tok_output_topic_default = 'anuvaad-dp-tools-fc-output-v1'
tok_output_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_FC_OUTPUT'
tok_output_topic = os.environ.get(tok_output_topic_identifier, tok_output_topic_default)

kf_local_server = 'localhost:9092'
kafka_ip_host = 'KAFKA_CLUSTER_DETAILS'
bootstrap_server = os.environ.get(kafka_ip_host, kf_local_server)


logging.basicConfig(
    filename=os.getenv("SERVICE_LOG", "server.log"),
    level=logging.DEBUG,
    format="%(levelname)s: %(asctime)s \
        pid:%(process)s module:%(module)s %(message)s",
    datefmt="%d/%m/%y %H:%M:%S",
)
