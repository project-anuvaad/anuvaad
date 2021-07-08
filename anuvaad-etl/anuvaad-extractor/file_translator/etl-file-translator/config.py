import logging
import os

# Flask server
DEBUG = False
context_path = '/anuvaad-etl/file-translator'
HOST = '0.0.0.0'
PORT = 5001
ENABLE_CORS = False

# REDIS
redis_server_host = os.environ.get('REDIS_URL', 'localhost')
redis_server_port = os.environ.get('REDIS_PORT', 6379)
redis_key_prefix = 'FT-'
redis_db = os.environ.get('ANUVAAD_FT_REDIS_DB', 4)

# MONGO DB
mongo_server_host = os.environ.get('MONGO_CLUSTER_URL', 'mongodb://localhost:27017,localhost:27018/?replicaSet=foo')

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

# Content Handler
FETCH_CONTENT_URL_DEFAULT = 'https://auth.anuvaad.org/'
FETCH_CONTENT_URL_VAR = 'CONTENT_HANDLER_URL'
CH_URL = os.environ.get(FETCH_CONTENT_URL_VAR, FETCH_CONTENT_URL_DEFAULT)

FETCH_CONTENT_ENDPOINT = 'anuvaad/content-handler/v0/fetch-content'
REF_LINK_STORE_ENDPOINT = 'anuvaad/content-handler/v0/ref-link/store'

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
DOCX_TOC_GEN = True
DOCX_HEADER_FOOTER_GEN = False
DOCX_TXT_BOX_CONTENT_GEN = True

DOCX_PARAGRAPH_TRANS = True
DOCX_TABLE_DATA_TRANS = True
DOCX_TABLE_OF_CONTENT_TRANS = True
DOCX_HEADER_FOOTER_TRANS = False
DOCX_TXT_BOX_CONTENT_TRANS = True

DOCX_HYPERLINK_SUPPORT = False

# TOOL NAMES
TOOL_LIBRE = 'LIBRE'
TOOL_PDF_TO_HTML = 'PDFTOHTML'
TOOL_PYDOCX = 'PYDOCX'

# FILE TYPES
TYPE_DOCX = 'DOCX'
TYPE_PPTX = 'PPTX'
TYPE_PDF = 'PDF'
TYPE_HTML = 'HTML'

# FLOWS
# FLOWS: DOCX
FLOW_DOCX_LIBRE_PDF_PDFTOHTML_HTML_S3_ENABLED = False
FLOW_DOCX_LIBREHTML_S3_ENABLED = False
FLOW_DOCX_PYDOCXHTML_S3_ENABLED = False
FLOW_DOCX_LIBREHTML_LIBREPDF_PDFTOHTML_HTML_S3_ENABLED = True
# FLOWS: PPTX
FLOW_PPTX_LIBRE_PDF_PDFTOHTML_HTML_S3_ENABLED = True
FLOW_PPTX_LIBRE_PDF_S3_ENABLED = False

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
GENERATED_HTML_FILE_PATTERN = '.html'
GENERATED_PDF_FILE_PATTERN = '.pdf'
GENERATED_HTML_DEFAULT_NAME = 'document.html'

PUSH_GENERATED_HTML_TO_S3 = True

aws_access_key = os.environ.get('FT_AWS_S3_ACCESS_KEY', 'ACCESS_KEY')
aws_secret_key = os.environ.get('FT_AWS_S3_SECRET_KEY', 'SECRET_KEY')
aws_bucket_name = os.environ.get('FT_AWS_BUCKET_NAME', 'anuvaad1')
aws_link_prefix = f'https://{aws_bucket_name}.s3.amazonaws.com/'

ALLOWED_MIME_TYPES = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                      'application/json']
ALLOWED_FILE_EXTENSION = ['docx', 'pptx', 'json']

logging.basicConfig(
    filename=os.getenv("SERVICE_LOG", "server.log"),
    level=logging.DEBUG,
    format="%(levelname)s: %(asctime)s \
        pid:%(process)s module:%(module)s %(message)s",
    datefmt="%d/%m/%y %H:%M:%S",
)
