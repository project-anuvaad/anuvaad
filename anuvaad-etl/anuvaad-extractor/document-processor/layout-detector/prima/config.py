import logging
import os
import time

DEBUG = False
API_URL_PREFIX = "/anuvaad-etl/document-processor/layout-detector"
HOST = '0.0.0.0'
PORT = 5001
BASE_DIR      = 'upload'
download_folder = 'upload'

#BASE_DIR = '/opt/share/nginx/upload'
#download_folder = '/opt/share/nginx/upload'


ENABLE_CORS = False

# kafka cpu 

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




#Kafka topics GPU

# input_topic_default = 'anuvaad-dp-tools-layout-detector-prima-gpu-input-v1'
# input_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_LAYOUT_DETECTOR_PRIMA_GPU_INPUT'
# input_topic = os.environ.get(input_topic_identifier, input_topic_default)

# output_topic_default = 'anuvaad-dp-tools-layout-detector-prima-gpu-output-v1'
# output_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_LAYOUT_DETECTOR_PRIMA_GPU_OUTPUT'
# output_topic = os.environ.get(output_topic_identifier, output_topic_default)

# kf_local_server     = 'localhost:9092'

# kafka_ip_host       = 'KAFKA_BOOTSTRAP_SERVER_HOST'
# bootstrap_server    = os.environ.get(kafka_ip_host, kf_local_server)

# TASK_STAT           = 'PRIMA-LAYOUT-DETECTOR'

# CONSUMER_GROUP_default       = 'anuvaad-etl-ld-gpu-consumer-group'
# CONSUMER_GROUP_identifier    = 'KAFKA_ANUVAAD_ETL_LD_GPU_CONSUMER_GRP'
# CONSUMER_GROUP               = os.environ.get(CONSUMER_GROUP_identifier,CONSUMER_GROUP_default)








logging.basicConfig(
    filename=os.getenv("SERVICE_LOG", "server.log"),
    level=logging.DEBUG,
    format="%(levelname)s: %(asctime)s \
        pid:%(process)s module:%(module)s %(message)s",
    datefmt="%d/%m/%y %H:%M:%S",
)



WATERMARK_THRESHOLD_LOW = 175
WATERMARK_THRESHOLD_HIGH = 250

PRIMA_SCORE_THRESH_TEST =0.5
PRIMA_CELL_SCORE_THRESH_TEST=0.5



LAYOUT_MODEL_PATH =  "./src/utilities/primalaynet/model_final.pth"
LAYOUT_CONFIG_PATH = "./src/utilities/primalaynet/layout_v2_trained_config.yaml"


LAYOUT_CELL_MODEL_PATH =  "./src/utilities/primalaynet/model_tablenet.pth"
LAYOUT_CELL_CONFIG_PATH = "./src/utilities/primalaynet/tablenet_config.yaml"
