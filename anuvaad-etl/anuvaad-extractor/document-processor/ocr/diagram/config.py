import logging
import os
import time

API_URL_PREFIX = "/anuvaad-etl/block-merger"
HOST = '0.0.0.0'
PORT = 5001
BASE_DIR = 'upload'

ENABLE_CORS = False

# kafka

input_topic_default = 'anuvaad-dp-tools-ocr-diagram-input'
input_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_OCR_DIAGRAM_INPUT'
input_topic = os.environ.get(input_topic_identifier, input_topic_default)

output_topic_default = 'anuvaad-dp-tools-ocr-diagram-output'
output_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_OCR_DIAGRAM__OUTPUT'
output_topic = os.environ.get(output_topic_identifier, output_topic_default)

kf_local_server = 'localhost:9092'
kafka_ip_host = 'KAFKA_BOOTSTRAP_SERVER_HOST'
bootstrap_server = os.environ.get(kafka_ip_host, kf_local_server)

TASK_STAT = 'IMAGE-OCR'

CONSUMER_GROUP_default = 'anuvaad-etl-ocr-diagram-consumer-group'
CONSUMER_GROUP_identifire = 'ANUVAAD_ETL_OCR_DIAGRAM_CONSUMER_GROUP'
CONSUMER_GROUP = os.environ.get(
    CONSUMER_GROUP_default, CONSUMER_GROUP_identifire)


BULK_SEARCH_default = 'https://auth.anuvaad.org/anuvaad-etl/wf-manager/v1/workflow/jobs/search/bulk'
BULK_SEARCH_identifire = 'BLUK_SEARCH'
BULK_SEARCH = os.environ.get(BULK_SEARCH_default, BULK_SEARCH_identifire)


OCR_CODE_default = 'WF_A_OD10GV'
OCR_CODE_identifire = 'OCR_CODE'
OCR_CODE = os.environ.get(OCR_CODE_default, OCR_CODE_identifire)


WF_INIT_default = 'https://auth.anuvaad.org/anuvaad-etl/wf-manager/v1/workflow/async/initiate'
WF_INIT_identifire = 'WORKFLOW_INIT'
WF_INIT = os.environ.get(WF_INIT_default, WF_INIT_identifire)


# folders and file path
download_folder = 'upload'
file_upload_url = str(os.environ.get('USER_FILE_UPLOADER_HOST', 'http://gateway_anuvaad-user-fileuploader:5001')) \
    + str(os.environ.get('USER_FILE_UPLOAD_ENDPOINT',
          '/anuvaad-api/file-uploader/v0/upload-file'))

logging.basicConfig(
    filename=os.getenv("SERVICE_LOG", "server.log"),
    level=logging.DEBUG,
    format="%(levelname)s: %(asctime)s \
        pid:%(process)s module:%(module)s %(message)s",
    datefmt="%d/%m/%y %H:%M:%S",
)


auth_token = None
