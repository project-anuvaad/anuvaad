import os
import time
DEBUG = False
API_URL_PREFIX = "/anuvaad-etl/document-processor/tesseract-document-digitization"
HOST = '0.0.0.0'
PORT = 5001
BASE_DIR      = 'upload'
#BASE_DIR      = '/home/naresh/anuvaad/anuvaad-etl/anuvaad-extractor/document-processor/ocr/ocr-tesseract-server/'
download_folder = 'upload'


ENABLE_CORS = False

# kafka

# ENABLE_CORS = False

# # kafka

input_topic_default = 'anuvaad-dp-tools-ocr-tesseract-input-v20'
input_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_OCR_TESSERACT_INPUT_V20'
input_topic = os.environ.get(input_topic_identifier, input_topic_default)

output_topic_default = 'anuvaad-dp-tools-ocr-tesseract-output-v20'
output_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_OCR_TESSERACT_OUTPUT_V20'
output_topic = os.environ.get(output_topic_identifier, output_topic_default)

kf_local_server     = 'localhost:9092'
kafka_ip_host       = 'KAFKA_BOOTSTRAP_SERVER_HOST'
bootstrap_server    = os.environ.get(kafka_ip_host, kf_local_server)

TASK_STAT           = 'TESSERACT-OCR-20'

CONSUMER_GROUP_default       = 'anuvaad-etl-tesseractocr-20-consumer-group'
CONSUMER_GROUP_identifier    = 'ANUVAAD_ETL_TESSERACTOCR_CONSUMER_GROUP_V20'
CONSUMER_GROUP               = os.environ.get(CONSUMER_GROUP_identifier,CONSUMER_GROUP_default)
download_folder = 'upload'

SAVE_VAR = "OCR_CH_URL"
SAVE_DEFAULT = "http://gateway_anuvaad-ocr-content-handler:5001//anuvaad/ocr-content-handler/v0/ocr/save-document"

SAVE_URL = os.environ.get(SAVE_VAR,SAVE_DEFAULT)
SAVE_NO_PAGE = 1

IS_DYNAMIC =True
EXRACTION_RESOLUTION  =  300
BATCH_SIZE  = 2
DYNAMIC_MARGINS= False
PERSPECTIVE_TRANSFORM=False
FALL_BACK_LANGUAGE=None
PSM=7
POST_PROCESSING_MODE=None


LANG_MAPPING       =  {
    "en" : ["Latin","eng"],
    "kn" : ['Kannada',"kan"],
    "gu": ["guj"],
    "or": ["ori"],
    "hi" : ["Devanagari","hin"],
    "bn" : ["Bengali","ben"],
    "mr": ["Devanagari","hin"],
    "ta": ['Tamil',"anuvaad_tam"],
    "te" : ["Telugu","tel"],
    "ml" :["Malayalam"],
    "ma" :["Marathi"]
}