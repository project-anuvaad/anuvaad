import logging
import os
import time

DEBUG = False
API_URL_PREFIX = "/anuvaad-etl/document-processor/ocr/tesseract"
HOST = '0.0.0.0'
PORT = 5001
BASE_DIR      = 'upload'

ENABLE_CORS = False

# kafka

input_topic_default = 'anuvaad-dp-tools-ocr-tesseract-input-v1'
input_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_OCR_TESSERACT_INPUT'
input_topic = os.environ.get(input_topic_identifier, input_topic_default)

output_topic_default = 'anuvaad-dp-tools-ocr-tesseract-output-v1'
output_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_OCR_TESSERACT_OUTPUT'
output_topic = os.environ.get(output_topic_identifier, output_topic_default)

kf_local_server     = 'localhost:9092'
kafka_ip_host       = 'KAFKA_BOOTSTRAP_SERVER_HOST'
bootstrap_server    = os.environ.get(kafka_ip_host, kf_local_server)

TASK_STAT           = 'TESSERACT-OCR'

CONSUMER_GROUP_default       = 'anuvaad-etl-tess-consumer-group'
CONSUMER_GROUP_identifier    = 'ANUVAAD_ETL_TESS_CONSUMER_GROUP_V1'
CONSUMER_GROUP               = os.environ.get(CONSUMER_GROUP_identifier,CONSUMER_GROUP_default)
#folders and file path
download_folder = 'upload'


logging.basicConfig(
    filename=os.getenv("SERVICE_LOG", "server.log"),
    level=logging.DEBUG,
    format="%(levelname)s: %(asctime)s \
        pid:%(process)s module:%(module)s %(message)s",
    datefmt="%d/%m/%y %H:%M:%S",
)


ocr_class = ["TEXT","TABLE","HEADER","FOOTER","CELL"]#,"IMAGE"]

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