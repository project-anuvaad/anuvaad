import logging
import os
import time

DEBUG = False
API_URL_PREFIX = "/api/v0"
HOST = '0.0.0.0'
PORT = 5001
BASE_DIR      = 'upload'

ENABLE_CORS = False

# kafka
input_topic         = 'anuvaad-dp-tools-block-merger-input-v2'
kf_local_server     = 'localhost:9092'
output_topic        = 'anuvaad-dp-tools-block-merger-output-v2'
kafka_ip_host       = 'KAFKA_IP_HOST'
bootstrap_server    = os.environ.get(kafka_ip_host, kf_local_server)
TASK_STAT           = 'BLOCK-MERGER'
CONSUMER_GROUP      = 'anuvaad-etl-bm-consumer-group'

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


FONT_CONFIG   = {
    "hi": 'mangal'
}
FONT_SIZE_CONFIG = {
    "hi":{ 'slab_1':{ 'min':0, 'max':10, 'ratio':0.00},
           'slab_2':{'min':10, 'max':20, 'ratio':0.05},
           'slab_3':{'min':20, 'max':50, 'ratio':0.06}
         }
}

CROP_CONFIG = {
    'hi': {'top':15, 'bottom':10,'right':5,'left':5},
    'ml': {'top':15, 'bottom':10,'right':5,'left':5},
    'kn':{'top':15, 'bottom':10,'right':5,'left':5 },
    'ta':{'top':5, 'bottom':15,'right':5,'left':10 },
    'ma':{'top':5, 'bottom':5,'right':5,'left':5 }
}