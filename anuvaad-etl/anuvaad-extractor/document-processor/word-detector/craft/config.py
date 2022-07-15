import logging
import os
import time

DEBUG = False
API_URL_PREFIX = "/anuvaad-etl/document-processor/word-detector"
HOST = '0.0.0.0'
PORT = 5004
BASE_DIR = 'upload'
# folders and file path
download_folder = 'upload'

#BASE_DIR = '/opt/share/nginx/upload'
#download_folder = '/opt/share/nginx/upload'


ENABLE_CORS = False
TASK_STAT = 'WORD-DETECTOR-CRAFT'

# kafka dev
input_topic_default = 'anuvaad-dp-tools-word-detector-craft-input-v1'
input_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_WORD_DETECTOR_CRAFT_INPUT'
input_topic = os.environ.get(input_topic_identifier, input_topic_default)

output_topic_default = 'anuvaad-dp-tools-word-detector-craft-output-v1'
output_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_WORD_DETECTOR_CRAFT_OUTPUT'
output_topic = os.environ.get(output_topic_identifier, output_topic_default)

kf_local_server = 'localhost:9092'
kafka_ip_host = 'KAFKA_BOOTSTRAP_SERVER_HOST'
bootstrap_server = os.environ.get(kafka_ip_host, kf_local_server)


CONSUMER_GROUP_default = 'anuvaad-etl-wd-consumer-group'
CONSUMER_GROUP_identifier = 'KAFKA_ANUVAAD_ETL_WD_CONSUMER_GRP'
CONSUMER_GROUP = os.environ.get(
    CONSUMER_GROUP_identifier, CONSUMER_GROUP_default)


# kafka stage
# input_topic_default = 'anuvaad-dp-tools-word-detector-craft-input-stage'
# input_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_WORD_DETECTOR_CRAFT_INPUT_STAGE'
# input_topic = os.environ.get(input_topic_identifier, input_topic_default)

# output_topic_default = 'anuvaad-dp-tools-word-detector-craft-output-stage'
# output_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_WORD_DETECTOR_CRAFT_OUTPUT_STAGE'
# output_topic = os.environ.get(output_topic_identifier, output_topic_default)

# kf_local_server     = 'localhost:9092'
# kafka_ip_host       = 'KAFKA_BOOTSTRAP_SERVER_HOST'
# bootstrap_server    = os.environ.get(kafka_ip_host, kf_local_server)


# CONSUMER_GROUP_default       = 'anuvaad-etl-wd-consumer-group-stage'
# CONSUMER_GROUP_identifier    = 'KAFKA_ANUVAAD_ETL_WD_CONSUMER_GRP_STAGE'
# CONSUMER_GROUP               = os.environ.get(CONSUMER_GROUP_identifier,CONSUMER_GROUP_default)


KAFKA_ANUVAAD_ETL_WF_ERROR_TOPIC = 'anuvaad-etl-wf-errors-v1'


logging.basicConfig(
    filename=os.getenv("SERVICE_LOG", "server.log"),
    level=logging.DEBUG,
    format="%(levelname)s: %(asctime)s \
        pid:%(process)s module:%(module)s %(message)s",
    datefmt="%d/%m/%y %H:%M:%S",
)

EXRACTION_RESOLUTION = 300


CRAFT_MODEL_PATH = './src/utilities/craft_pytorch/model/craft_mlt_25k.pth'
CRAFT_REFINE_MODEL_PATH = './src/utilities/craft_pytorch/model/craft_refiner_CTW1500.pth'

LANGUAGE_WORD_THRESOLDS = {
    'en': {'text_threshold': 0.1, 'low_text': 0.5, 'link_threshold': 0.35},
    'detect': {'text_threshold': 0.1, 'low_text': 0.5, 'link_threshold': 0.35},
    'hi': {'text_threshold': 0.1, 'low_text': 0.5, 'link_threshold': 0.2},
    'ma': {'text_threshold': 0.1, 'low_text': 0.5, 'link_threshold': 0.35},
    'ta': {'text_threshold': 0.1, 'low_text': 0.5, 'link_threshold': 0.35},
    'ml': {'text_threshold': 0.1, 'low_text': 0.5, 'link_threshold': 0.35},
    'ka': {'text_threshold': 0.1, 'low_text': 0.5, 'link_threshold': 0.35},
    'te': {'text_threshold': 0.1, 'low_text': 0.5, 'link_threshold': 0.35},
    'bn': {'text_threshold': 0.1, 'low_text': 0.5, 'link_threshold': 0.35},
    'or': {'text_threshold': 0.1, 'low_text': 0.5, 'link_threshold': 0.35},
    'gu': {'text_threshold': 0.1, 'low_text': 0.5, 'link_threshold': 0.35},
    'kn': {'text_threshold': 0.1, 'low_text': 0.5, 'link_threshold': 0.35}
}
LANGUAGE_LINE_THRESOLDS = {
    'en': {'text_threshold': 0.1, 'low_text': 0.5, 'link_threshold': 0.35},
    'detect': {'text_threshold': 0.1, 'low_text': 0.5, 'link_threshold': 0.35},
    'hi': {'text_threshold': 0.1, 'low_text': 0.5, 'link_threshold': 0.35},
    'ma': {'text_threshold': 0.1, 'low_text': 0.5, 'link_threshold': 0.35},
    'ta': {'text_threshold': 0.1, 'low_text': 0.5, 'link_threshold': 0.35},
    'ml': {'text_threshold': 0.1, 'low_text': 0.5, 'link_threshold': 0.35},
    'ka': {'text_threshold': 0.1, 'low_text': 0.5, 'link_threshold': 0.35},
    'te': {'text_threshold': 0.1, 'low_text': 0.5, 'link_threshold': 0.35},
    'bn': {'text_threshold': 0.1, 'low_text': 0.5, 'link_threshold': 0.35},
    'or': {'text_threshold': 0.1, 'low_text': 0.5, 'link_threshold': 0.35},
    'gu': {'text_threshold': 0.1, 'low_text': 0.5, 'link_threshold': 0.35},
    'kn': {'text_threshold': 0.1, 'low_text': 0.5, 'link_threshold': 0.35}
}

LINE_PRIMA_SCORE_THRESH_TEST = 0.5


LINE_LAYOUT_MODEL_PATH = "./src/utilities/primalinenet/anuvaad_line_v1.pth"
LINE_LAYOUT_CONFIG_PATH = "./src/utilities/primalinenet/config.yaml"
##########################################################################
# Alignment
EAST_MODEL = "./src/utilities/east/frozen_east_text_detection.pb"
ANGLE_TOLLERANCE  = 0.25
MIN_CONFIDENCE    = 0.5
MARGIN_TOLLERANCE = 9
EAST_WIDTH        = 1280
EAST_HEIGHT       = 1280
ALIGN = False
ALIGN_MODE = 'FAST'

###########################################################################


WATERMARK_THRESHOLD_LOW = 175
WATERMARK_THRESHOLD_HIGH = 250
#MAGNIFICATION_RATIO = 1.5
MAGNIFICATION_RATIO = 1.0

