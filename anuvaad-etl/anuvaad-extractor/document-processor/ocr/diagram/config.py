import logging
import os
import time

API_URL_PREFIX = "/anuvaad-etl/block-merger"
HOST = '0.0.0.0'
PORT = 5001
BASE_DIR      = 'upload'

ENABLE_CORS = False

# kafka

input_topic_default = 'anuvaad-dp-tools-block-merger-input-v2'
input_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_BLOCK_MERGER_INPUT'
input_topic = os.environ.get(input_topic_identifier, input_topic_default)

output_topic_default = 'anuvaad-dp-tools-block-merger-output-v2'
output_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_BLOCK_MERGER_OUTPUT'
output_topic = os.environ.get(output_topic_identifier, output_topic_default)

kf_local_server     = 'localhost:9092'
kafka_ip_host       = 'KAFKA_BOOTSTRAP_SERVER_HOST'
bootstrap_server    = os.environ.get(kafka_ip_host, kf_local_server)

TASK_STAT           = 'BLOCK-MERGER'

CONSUMER_GROUP_default       = 'anuvaad-etl-bm-consumer-group'
CONSUMER_GROUP_identifire    = 'KAFKA_ANUVAAD_ETL_BM_CONSUMER_GRP'
CONSUMER_GROUP               = os.environ.get(CONSUMER_GROUP_default,CONSUMER_GROUP_identifire)
#folders and file path
download_folder = 'upload'
file_upload_url = str(os.environ.get('USER_FILE_UPLOADER_HOST', 'http://gateway_anuvaad-user-fileuploader:5001')) \
                    + str(os.environ.get('USER_FILE_UPLOAD_ENDPOINT', '/anuvaad-api/file-uploader/v0/upload-file'))

logging.basicConfig(
    filename=os.getenv("SERVICE_LOG", "server.log"),
    level=logging.DEBUG,
    format="%(levelname)s: %(asctime)s \
        pid:%(process)s module:%(module)s %(message)s",
    datefmt="%d/%m/%y %H:%M:%S",
)





auth_token=None