import logging
import os
import time

DEBUG = True
API_URL_PREFIX = "/api/v0"
HOST = '0.0.0.0'
PORT = 5001
BASE_DIR      = 'upload'

ENABLE_CORS = False

# kafka
input_topic = 'anuvaad-dp-tools-block-merger-input-v1'
kf_local_server = 'localhost:9092'
output_topic = 'anuvaad-dp-tools-block-merger-output-v1'
kafka_ip_host = 'KAFKA_IP_HOST'
bootstrap_server = os.environ.get(kafka_ip_host, kf_local_server)
group_id = 'anuvaad-etl-bm-consumer-group'
#folders and file path
download_folder = 'upload'


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
    "space_multiply_factor": 1.8
}

TABLE_CONFIGS = {
    "remove_background" : True ,
    "background_threshold" : 50,
    "extract_by"           : 'starting_point'
}

PREPROCESS_CONFIGS = {'header_cut':0.15  , 'footer_cut' :0.15 ,'repeat_threshold' :0.95 ,'underline_threshold':0.25, 'margin':10 }
DROP_TEXT          =  ['SUPERSCRIPT']

LANG_MAPPING       =  {
    "en" : "eng", "kn" : "kan", "gu": "guj","or": "ori",
    "hi" : "hin", "bn" : "ben", "mr": "mar", "ta": "tam",
    "te" : "tel"

}