#import logging
import os
import time
DEBUG = False
API_URL_PREFIX = "/anuvaad-etl/document-processor/gv-document-digitization"
HOST = '0.0.0.0'
PORT = 5001
BASE_DIR      = 'upload'
#BASE_DIR      = '/home/naresh/anuvaad/anuvaad-etl/anuvaad-extractor/document-processor/ocr/ocr-gv-server/'
download_folder = 'upload'


ENABLE_CORS = False

# kafka

# ENABLE_CORS = False

# # kafka

input_topic_default = 'anuvaad-dp-tools-ocr-google-vision-input-v15'
input_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_OCR_GOOGLE_VISION_INPUT_V15'
input_topic = os.environ.get(input_topic_identifier, input_topic_default)

output_topic_default = 'anuvaad-dp-tools-ocr-google-vision-output-v15'
output_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_OCR_GOOGLE_VISION_OUTPUT_V15'
output_topic = os.environ.get(output_topic_identifier, output_topic_default)

kf_local_server     = 'localhost:9092'
kafka_ip_host       = 'KAFKA_BOOTSTRAP_SERVER_HOST'
bootstrap_server    = os.environ.get(kafka_ip_host, kf_local_server)

TASK_STAT           = 'GOOGLE-VISION-OCR-15'

CONSUMER_GROUP_default       = 'anuvaad-etl-gvocr-15-consumer-group'
CONSUMER_GROUP_identifier    = 'ANUVAAD_ETL_GVOCR_CONSUMER_GROUP_V15'
CONSUMER_GROUP               = os.environ.get(CONSUMER_GROUP_identifier,CONSUMER_GROUP_default)
download_folder = 'upload'
#
#
# logging.basicConfig(
#     filename=os.getenv("SERVICE_LOG", "server.log"),
#     level=logging.DEBUG,
#     format="%(levelname)s: %(asctime)s \
#         pid:%(process)s module:%(module)s %(message)s",
#     datefmt="%d/%m/%y %H:%M:%S",
# )

#SAVE_URL = "https://auth.anuvaad.org/anuvaad/ocr-content-handler/v0/ocr/save-document"
SAVE_VAR = "OCR_CH_URL"
SAVE_DEFAULT = "http://gateway_anuvaad-ocr-content-handler:5001//anuvaad/ocr-content-handler/v0/ocr/save-document"

SAVE_URL = os.environ.get(SAVE_VAR,SAVE_DEFAULT)
#print(SAVE_URL)
#SAVE_URL = "http://172.30.0.232:5009//anuvaad/ocr-content-handler/v0/ocr/save-document"
SAVE_NO_PAGE = 1


EXRACTION_RESOLUTION  =  300
ocr_class = ["TEXT","TABLE","HEADER","FOOTER","CELL","CELL_TEXT"]#,"IMAGE"]

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
    "ml" :["Malayalam"],
    "ma" :["Marathi"]
}

CROP_CONFIG = {
    'en' : {'top':1, 'bottom':1,'right':1,'left':1},
    'hi': {'top':15, 'bottom':10,'right':5,'left':5},
    'ml': {'top':15, 'bottom':10,'right':5,'left':5},
    'kn':{'top':15, 'bottom':10,'right':5,'left':5 },
    'ta':{'top':10, 'bottom':15,'right':5,'left':10},
    'bn':{'top':15, 'bottom':10,'right':5,'left':5},
    'te':{'top':15, 'bottom':10,'right':5,'left':5},
    'ma':{'top':15, 'bottom':10,'right':5,'left':5}
}

IS_DYNAMIC = True
DYNAMIC_LEVEL = "lines"
DYNAMIC_CLASS = ["TEXT"]

REJECT_FILTER = 2

OCR_LEVEL = {'HIGH_ACCURACY' : 'lines'  }
WATERMARK_THRESHOLD_LOW = 175
WATERMARK_THRESHOLD_HIGH = 250