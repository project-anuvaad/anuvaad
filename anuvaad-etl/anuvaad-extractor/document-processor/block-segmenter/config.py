import logging
import os
import time

DEBUG = False
API_URL_PREFIX = "/anuvaad-etl/document-processor"
HOST = '0.0.0.0'
PORT = 5001

#BASE_DIR = '/opt/share/nginx/upload'
#download_folder = '/opt/share/nginx/upload'
BASE_DIR      = 'upload'
download_folder = 'upload'

TASK_STAT           = 'BLOCK-SEGMENTER'


ENABLE_CORS = False

# kafka dev 

input_topic_default = 'anuvaad-dp-tools-block-segmenter-input-v1'
input_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_BLOCK_SEGMENTER_INPUT'
input_topic = os.environ.get(input_topic_identifier, input_topic_default)

output_topic_default = 'anuvaad-dp-tools-block-segmenter-output-v1'
output_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_BLOCK_SEGMENTER_OUTPUT'
output_topic = os.environ.get(output_topic_identifier, output_topic_default)

kf_local_server     = 'localhost:9092'
kafka_ip_host       = 'KAFKA_BOOTSTRAP_SERVER_HOST'
bootstrap_server    = os.environ.get(kafka_ip_host, kf_local_server)


CONSUMER_GROUP_default       = 'anuvaad-etl-bs-consumer-group'
CONSUMER_GROUP_identifier    = 'ANUVAAD_ETL_BS_CONSUMER_GROUP_V1'
CONSUMER_GROUP               = os.environ.get(CONSUMER_GROUP_identifier,CONSUMER_GROUP_default)



# kafka stage 

# input_topic_default = 'anuvaad-dp-tools-block-segmenter-input-satge'
# input_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_BLOCK_SEGMENTER_INPUT_STAGE'
# input_topic = os.environ.get(input_topic_identifier, input_topic_default)

# output_topic_default = 'anuvaad-dp-tools-block-segmenter-output-stage'
# output_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_BLOCK_SEGMENTER_OUTPUT_STAGE'
# output_topic = os.environ.get(output_topic_identifier, output_topic_default)

# kf_local_server     = 'localhost:9092'
# kafka_ip_host       = 'KAFKA_BOOTSTRAP_SERVER_HOST'
# bootstrap_server    = os.environ.get(kafka_ip_host, kf_local_server)


# CONSUMER_GROUP_default       = 'anuvaad-etl-bs-consumer-group-stage'
# CONSUMER_GROUP_identifier    = 'ANUVAAD_ETL_BS_CONSUMER_GROUP_STAGE'
# CONSUMER_GROUP               = os.environ.get(CONSUMER_GROUP_identifier,CONSUMER_GROUP_default)



#folders and file path

BREAK_BLOCKS = True

DEVICE='cpu'
IMAGE_SIZE=1984
WEIGHT_PATH ="./src/utilities/yolov5/weights/exp14.pt"
CONF_THRESHOLD = 0.1
IOU_THRESHOLD = 0.45

logging.basicConfig(
    filename=os.getenv("SERVICE_LOG", "server.log"),
    level=logging.DEBUG,
    format="%(levelname)s: %(asctime)s \
        pid:%(process)s module:%(module)s %(message)s",
    datefmt="%d/%m/%y %H:%M:%S",
)
DOCUMENT_CONFIGS = {
    'LANGUAGE_TYPE': 'eng',
    
    'HORI_BLOCK_WDTH_DIFF_PERC': 0.85,
    'SUPERSCRIPT_HEIGHT_DIFFERENCE': 7.0,
    'HORI_SPACE_TOO_CLOSE': 10.0,
    
    'VERTICAL_SPACE_TOO_CLOSE': 5.0,
    'AVERAGE_VERTICAL_SPACE': 12.0,
    'LEFT_OR_RIGHT_ALIGNMENT_MARGIN': 20.0
}

BLOCK_CONFIGS = {
    "right_margin_threshold": 0.10,  "left_margin_threshold": 0.10,
    "right_break_threshold": 0.06,   "left_break_threshold": 0.05,
    "header_left_threshold": 0.70,  "header_right_threshold": 0.85,
    "space_multiply_factor": 2.1
}

BLOCK_BREAK_CONFIG = {'margin_support': 2, 'width_threshold': 0.65}

TABLE_CONFIGS = {
    "remove_background" : True ,
    "background_threshold" : 50,
    "extract_by"           : 'starting_point'
}

PREPROCESS_CONFIGS = {'header_cut':0.15  , 'footer_cut' :0.85 ,'repeat_threshold' :0.95 ,'underline_threshold':0.25, 'margin':10 }
DROP_TEXT          =  ['SUPERSCRIPT']
