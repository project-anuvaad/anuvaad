import logging
import os
import time


DEBUG = False
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

LANG_MAPPING       =  {
    "en" : ["Latin","eng"],
    "kn" : ['Kannada',"kan"],
    "gu": ["guj"],
    "or": ["ori"],
    "hi" : ["Devanagari","hin","eng"],
    "bn" : ["Bengali","ben"],
    "mr": ["Devanagari","hin","eng"],
    "ta": ['Tamil',"tam"],
    "te" : ["Telugu","tel"],
    "ml" :["Malayalam"]
}


FONT_CONFIG   = {
    "hi": 'Ariel Unicode MS'
}
FONT_SIZE_CONFIG = {
    "hi":{ 'slab_1':{ 'min':0, 'max':15, 'ratio':-0.05},
           'slab_2':{'min':15, 'max':25, 'ratio':0.05},
           'slab_3':{'min':25, 'max':50, 'ratio':0.06}
         }
}

CROP_CONFIG = {
    'en' : {'top':1, 'bottom':1,'right':1,'left':1},
    'hi': {'top':15, 'bottom':10,'right':5,'left':5},
    'gu': {'top': 15, 'bottom': 10, 'right': 5, 'left': 5},
    'or': {'top': 15, 'bottom': 10, 'right': 5, 'left': 5},
    'bn': {'top': 15, 'bottom': 10, 'right': 5, 'left': 5},
    'ml': {'top':15, 'bottom':10,'right':5,'left':5},
    'kn':{'top':15, 'bottom':10,'right':5,'left':5 },
    'ta':{'top':10, 'bottom':15,'right':5,'left':10 },
    'te':{'top':10, 'bottom':15,'right':5,'left':10 },
    'mr':{'top':15, 'bottom':10,'right':5,'left':5}
}

CLASS_2_LANG = []  #['ta']

CRAFT_MODEL_PATH =  "./src/utilities/craft_pytorch/model/craft_mlt_25k.pth"
CRAFT_REFINE_MODEL_PATH = "./src/utilities/craft_pytorch/model/craft_refiner_CTW1500.pth"


WATERMARK_THRESHOLD_LOW = 175
WATERMARK_THRESHOLD_HIGH = 250
WATERMARK_REMOVE = True

PRIMA_SCORE_THRESH_TEST =0.5
LAYOUT_MODEL_PATH =  "./src/utilities/primalaynet/model_final.pth"
LAYOUT_CONFIG_PATH = "./src/utilities/primalaynet/config.yaml"
#
#LAYOUT_MODEL_PATH =  "/home/naresh/anuvaad_BM_prima_model/model_final.pth"
#LAYOUT_CONFIG_PATH = "/home/naresh/anuvaad-BM/anuvaad/anuvaad-etl/anuvaad-extractor/block-merger/src/utilities/primalaynet/config.yaml"


# LAYOUT_MODEL_PATH = '/home/dhiraj/Downloads/model_final.pth'
# LAYOUT_CONFIG_PATH = '/home/dhiraj/Documents/anuvaad/anuvaad-etl/anuvaad-extractor/block-merger/src/utilities/primalaynet/config.yaml'

HEADER_FOOTER_BY_PRIMA = True

LAYOUT_CLASSES = ['HEADER','FOOTER']

BM_PROCESSES = 3
BM_OCR_PROCESSES = 2
