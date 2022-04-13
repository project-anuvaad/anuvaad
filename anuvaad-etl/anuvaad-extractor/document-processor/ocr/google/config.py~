#import logging
import os
import time

DEBUG = False
API_URL_PREFIX = "/anuvaad-etl/document-processor/gv-document-digitization"
HOST = '0.0.0.0'
PORT = 5001
BASE_DIR      = 'upload'
#BASE_DIR      = '/home/naresh/anuvaad/anuvaad-etl/anuvaad-extractor/document-processor/gv-document-digitization/upload'
download_folder = 'upload'



ENABLE_CORS = False

# kafka
#
input_topic_default = 'anuvaad-dp-tools-gv-document-digitization-input-v10'
input_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_GV_DOCUMENT_DIGITIZATION_INPUT'
input_topic = os.environ.get(input_topic_identifier, input_topic_default)

output_topic_default = 'anuvaad-dp-tools-gv-document-digitization-output-v10'
output_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_GV_DOCUMENT_DIGITIZATION_OUTPUT'
output_topic = os.environ.get(output_topic_identifier, output_topic_default)

kf_local_server     = 'localhost:9092'
kafka_ip_host       = 'KAFKA_BOOTSTRAP_SERVER_HOST'
bootstrap_server    = os.environ.get(kafka_ip_host, kf_local_server)

TASK_STAT           = 'GV-DOCUMENT-DIGITIZATION'

CONSUMER_GROUP_default       = 'anuvaad-etl-gv-document-digitization-consumer-group-v10'
CONSUMER_GROUP_identifier    = 'ANUVAAD_ETL_GV_DOCUMENT_DIGITIZATION_CONSUMER_GROUP_V10'
CONSUMER_GROUP               = os.environ.get(CONSUMER_GROUP_identifier,CONSUMER_GROUP_default)


# API_URL_PREFIX = "/anuvaad-etl/document-processor/ocr/google-vision"
# HOST = '0.0.0.0'
# PORT = 5001
# BASE_DIR      = 'upload'

# ENABLE_CORS = False

# # kafka





# input_topic_default = 'anuvaad-dp-tools-ocr-tesseract-input-v1'
# input_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_OCR_TESSERACT_INPUT'
# input_topic = os.environ.get(input_topic_identifier, input_topic_default)

# output_topic_default = 'anuvaad-dp-tools-ocr-tesseract-output-v1'
# output_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_OCR_TESSERACT_OUTPUT'
# output_topic = os.environ.get(output_topic_identifier, output_topic_default)

# kf_local_server     = 'localhost:9092'
# kafka_ip_host       = 'KAFKA_BOOTSTRAP_SERVER_HOST'
# bootstrap_server    = os.environ.get(kafka_ip_host, kf_local_server)

# TASK_STAT           = 'GV-DOCUMENT-DIGITIZATION'

# CONSUMER_GROUP_default       = 'anuvaad-etl-tess-consumer-group'
# CONSUMER_GROUP_identifier    = 'ANUVAAD_ETL_TESS_CONSUMER_GROUP_V1'
# CONSUMER_GROUP               = os.environ.get(CONSUMER_GROUP_identifier,CONSUMER_GROUP_default)




# input_topic_default = 'anuvaad-dp-tools-ocr-google-vision-input-v1'
# input_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_OCR_GOOGLE_VISION_INPUT'
# input_topic = os.environ.get(input_topic_identifier, input_topic_default)

# output_topic_default = 'anuvaad-dp-tools-ocr-google-vision-output-v1'
# output_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_OCR_GOOGLE_VISION_OUTPUT'
# output_topic = os.environ.get(output_topic_identifier, output_topic_default)

# kf_local_server     = 'localhost:9092'
# kafka_ip_host       = 'KAFKA_BOOTSTRAP_SERVER_HOST'
# bootstrap_server    = os.environ.get(kafka_ip_host, kf_local_server)

# TASK_STAT           = 'GOOGLE-VISION-OCR'

# CONSUMER_GROUP_default       = 'anuvaad-etl-gvocr-consumer-group'
# CONSUMER_GROUP_identifier    = 'ANUVAAD_ETL_GVOCR_CONSUMER_GROUP_V1'
# CONSUMER_GROUP               = os.environ.get(CONSUMER_GROUP_identifier,CONSUMER_GROUP_default)
#
#
# logging.basicConfig(
#     filename=os.getenv("SERVICE_LOG", "server.log"),
#     level=logging.DEBUG,
#     format="%(levelname)s: %(asctime)s \
#         pid:%(process)s module:%(module)s %(message)s",
#     datefmt="%d/%m/%y %H:%M:%S",
# )
EXRACTION_RESOLUTION  =  300
#SAVE_URL = "https://auth.anuvaad.org/anuvaad/ocr-content-handler/v0/ocr/save-document"

SAVE_VAR = "OCR_CH_URL"
SAVE_DEFAULT = "http://gateway_anuvaad-ocr-content-handler:5001//anuvaad/ocr-content-handler/v0/ocr/save-document"

SAVE_URL = os.environ.get(SAVE_VAR,SAVE_DEFAULT)
print(SAVE_URL)

#SAVE_URL = "http://172.30.0.232:5009//anuvaad/ocr-content-handler/v0/ocr/save-document"
SAVE_NO_PAGE = 1

CLEAN_BACKGROUND = False

##########################################################################
#Alignment
ALIGN = True
ALIGN_MODE= 'FAST'


###########################################################################
