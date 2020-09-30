import logging
import os

# Flask server
DEBUG = False
API_URL_PREFIX = "/api/v0"
HOST = '0.0.0.0'
PORT = 5001
ENABLE_CORS = False

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
kafka_ip_host = 'KAFKA_IP_HOST'
bootstrap_server = os.environ.get(kafka_ip_host, kf_local_server)

#folders and file path
download_folder = 'upload'

# internal url
internal_gateway_url_save_data = 'http://gateway_anuvaad-content-handler:5001/api/v0/save-content'

logging.basicConfig(
    filename=os.getenv("SERVICE_LOG", "server.log"),
    level=logging.DEBUG,
    format="%(levelname)s: %(asctime)s \
        pid:%(process)s module:%(module)s %(message)s",
    datefmt="%d/%m/%y %H:%M:%S",
)
