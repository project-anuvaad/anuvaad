import logging
import os

# Flask server
DEBUG = False
context_path = '/anuvaad-etl/file-translator'
HOST = '0.0.0.0'
PORT = 5001
ENABLE_CORS = False

# kafka
consumer_grp_default = 'anuvaad-etl-file-translator-consumer-group'
consumer_grp_identifier = 'KAFKA_ANUVAAD_ETL_FILE_TRANLATOR_CONSUMER_GRP'
CONSUMER_GROUP = os.environ.get(consumer_grp_identifier, consumer_grp_default)

# For Transform flow
input_topic_default = 'anuvaad-dp-tools-file-translator-transform-input-v1'
input_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_FT_INPUT'
transform_input_topic = os.environ.get(input_topic_identifier, input_topic_default)

output_topic_default = 'anuvaad-dp-tools-file-translator-transform-output-v1'
output_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_FT_OUTPUT'
transform_output_topic = os.environ.get(output_topic_identifier, output_topic_default)

# For download flow
input_topic_default = 'anuvaad-dp-tools-file-translator-download-input-v1'
input_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_FT_DOWNLOAD_INPUT'
download_input_topic = os.environ.get(input_topic_identifier, input_topic_default)

output_topic_default = 'anuvaad-dp-tools-file-translator-download-output-v1'
output_topic_identifier = 'KAFKA_ANUVAAD_DP_TOOLS_FT_DOWNLOAD_OUTPUT'
download_output_topic = os.environ.get(output_topic_identifier, output_topic_default)

kf_local_server = 'localhost:9092'
kafka_ip_host = 'KAFKA_BOOTSTRAP_SERVER_HOST'
bootstrap_server = os.environ.get(kafka_ip_host, kf_local_server)

# Fetch Content
FETCH_CONTENT_URL_DEFAULT = 'https://auth.anuvaad.org/anuvaad/content-handler/v0/fetch-content'
FETCH_CONTENT_URL_VAR = 'FETCH_CONTENT_URL'
FC_URL = os.environ.get(FETCH_CONTENT_URL_VAR, FETCH_CONTENT_URL_DEFAULT)

# ENV HOST
ENV_HOST_URL = 'https://auth.anuvaad.org/'

# folders and file path
download_folder = 'upload'

# TIMEOUT
PDF_TO_HTML_TIMEOUT = 300
PDF_CONVERSION_TIMEOUT = 300

# DOCX CONFIG
DOCX_PARAGRAPH_GEN = True
DOCX_TABLE_DATA_GEN = True
DOCX_TABLE_OF_CONTENT_GEN = False
DOCX_HEADER_FOOTER_GEN = False

DOCX_PARAGRAPH_TRANS = True
DOCX_TABLE_DATA_TRANS = True
DOCX_TABLE_OF_CONTENT_TRANS = False
DOCX_HEADER_FOOTER_TRANS = False

DOCX_HYPERLINK_SUPPORT = False

# PAGE LIMIT
DOCX_PAGE_LIMIT_ENABLE = True
PARA_WISE_PAGE_LIMIT = False
MAX_PARA_IN_A_PAGE = 100
RUN_WISE_PAGE_LIMIT = False
MAX_RUN_IN_A_PAGE = 30
WORD_WISE_PAGE_LIMIT = True
MAX_WORD_IN_A_PAGE = 500

# PPTX CONFIG
PPTX_PARAGRAPH_GEN = True
PPTX_TABLE_DATA_GEN = True
PPTX_TABLE_OF_CONTENT_GEN = False
PPTX_HEADER_FOOTER_GEN = False

PPTX_PARAGRAPH_TRANS = True
PPTX_TABLE_DATA_TRANS = True
PPTX_TABLE_OF_CONTENT_TRANS = False
PPTX_HEADER_FOOTER_TRANS = False

PPTX_HYPERLINK_SUPPORT = False
PPTX_PAGE_LIMIT_ENABLE = False

DOCX_FILE_PREFIX = 'DOCX-'
PPTX_FILE_PREFIX = 'PPTX-'

ALLOWED_FILE_TYPES = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                      'application/json']
ALLOWED_FILE_EXTENSION = ['.docx', '.pptx', '.json']

logging.basicConfig(
    filename=os.getenv("SERVICE_LOG", "server.log"),
    level=logging.DEBUG,
    format="%(levelname)s: %(asctime)s \
        pid:%(process)s module:%(module)s %(message)s",
    datefmt="%d/%m/%y %H:%M:%S",
)
