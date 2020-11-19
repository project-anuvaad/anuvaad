import logging
import os
import time

DEBUG = True
API_URL_PREFIX = "/api/v0"
HOST = '0.0.0.0'
PORT = 5001
BASE_DIR   = 'upload'

ENABLE_CORS = False

# kafka

input_topic_default = 'anuvaad-dp-tools-word-detector-craft-input-v1'
input_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_WORD_DETECTOR_CRAFT_INPUT'
input_topic = os.environ.get(input_topic_identifier, input_topic_default)

output_topic_default = 'anuvaad-dp-tools-word-detector-craft-output-v1'
output_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_WORD_DETECTOR_CRAFT_OUTPUT'
output_topic = os.environ.get(output_topic_identifier, output_topic_default)

kf_local_server     = 'localhost:9092'
kafka_ip_host       = 'KAFKA_IP_HOST'
bootstrap_server    = os.environ.get(kafka_ip_host, kf_local_server)

TASK_STAT           = 'WORD-DETECTOR-CRAFT'

CONSUMER_GROUP_default       = 'anuvaad-etl-wd-consumer-group'
CONSUMER_GROUP_identifire    = 'KAFKA_ANUVAAD_ETL_WD_CONSUMER_GRP'
CONSUMER_GROUP               = os.environ.get(CONSUMER_GROUP_default,CONSUMER_GROUP_identifire)
#folders and file path
download_folder = 'upload'


logging.basicConfig(
    filename=os.getenv("SERVICE_LOG", "server.log"),
    level=logging.DEBUG,
    format="%(levelname)s: %(asctime)s \
        pid:%(process)s module:%(module)s %(message)s",
    datefmt="%d/%m/%y %H:%M:%S",
)

EXRACTION_RESOLUTION = 300

CRAFT_MODEL_PATH=  './src/utilities/craft_pytorch/model/craft_mlt_25k.pth'
CRAFT_REFINE_MODEL_PATH =  './src/utilities/craft_pytorch/model/craft_refiner_CTW1500.pth'

LANGUAGE_WORD_THRESOLDS ={
'en':{'text_threshold':0.5 ,'low_text': 0.4} ,
'hi':{'text_threshold':0.5 ,'low_text': 0.4},
'ma':{'text_threshold':0.5 ,'low_text': 0.4} ,
'ta':{'text_threshold':0.5 ,'low_text': 0.4} ,
'ml':{'text_threshold':0.5 ,'low_text': 0.4} ,
'ka':{'text_threshold':0.5 ,'low_text': 0.4}
}

LANGUAGE_LINK_THRESOLDS ={
'en':{'link_threshold':0.5 ,'low_text': 0.4} ,
'hi':{'link_threshold':0.5 ,'low_text': 0.4},
'ma':{'link_threshold':0.5 ,'low_text': 0.4} ,
'ta':{'link_threshold':0.5 ,'low_text': 0.4} ,
'ml':{'link_threshold':0.5 ,'low_text': 0.4} ,
'ka':{'link_threshold':0.5 ,'low_text': 0.4}
}

LANGUAGE_LINE_THRESOLDS ={
'en':{'text_threshold':0.5 ,'low_text': 0.4} ,
'hi':{'text_threshold':0.5 ,'low_text': 0.4},
'ma':{'text_threshold':0.5 ,'low_text': 0.4} ,
'ta':{'text_threshold':0.5 ,'low_text': 0.4} ,
'ml':{'text_threshold':0.5 ,'low_text': 0.4} ,
'ka':{'text_threshold':0.5 ,'low_text': 0.4}
}

