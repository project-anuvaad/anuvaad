import logging
import os

# Flask server
DEBUG = False
context_path = '/anuvaad-etl/tokeniser'
HOST = '0.0.0.0'
PORT = 5001
ENABLE_CORS = False

# REDIS
redis_server_host = os.environ.get('REDIS_URL', 'localhost')
redis_server_port = os.environ.get('REDIS_PORT', 6379)
redis_key_prefix = 'TK-'
redis_db = os.environ.get('ANUVAAD_TK_REDIS_DB', 5)


# kafka
consumer_grp_default = 'anuvaad-etl-tokeniser-consumer-group'
consumer_grp_identifier = 'KAFKA_ANUVAAD_ETL_TOKENISER_CONSUMER_GRP'
CONSUMER_GROUP = os.environ.get(consumer_grp_identifier, consumer_grp_default)

input_topic_default = 'anuvaad-dp-tools-tokeniser-input-v1'
input_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_TOKENISER_INPUT'
input_topic = os.environ.get(input_topic_identifier, input_topic_default)

output_topic_default = 'anuvaad-dp-tools-tokeniser-output-v1'
output_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_TOKENISER_OUTPUT'
output_topic = os.environ.get(output_topic_identifier, output_topic_default)

kf_local_server = 'localhost:9092'
kafka_ip_host = 'KAFKA_BOOTSTRAP_SERVER_HOST'
bootstrap_server = os.environ.get(kafka_ip_host, kf_local_server)

# ID SEPARATOR
ID_SEPARATOR = '_SENTENCE-'

#folders and file path
download_folder = 'upload'

logging.basicConfig(
    filename=os.getenv("SERVICE_LOG", "server.log"),
    level=logging.DEBUG,
    format="%(levelname)s: %(asctime)s \
        pid:%(process)s module:%(module)s %(message)s",
    datefmt="%d/%m/%y %H:%M:%S",
)
