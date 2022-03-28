#import logging
import os
import time

DEBUG           = False
API_URL_PREFIX  = "/anuvaad-annotation/sentence-annotation"
HOST            = '0.0.0.0'
PORT            = 5001
BASE_DIR        = 'upload'
download_folder = 'upload'
ENABLE_CORS     = False

# kafka
#
input_topic             = os.environ.get('KAFKA_ANUVAAD_DP_TOOLS_SENTENCE_ANNOTATION_INPUT', 'anuvaad-dp-tools-sentence-annotation-input-v1')
output_topic            = os.environ.get('KAFKA_ANUVAAD_DP_TOOLS_SENTENCE_ANNOTATION_OUTPUT', 'anuvaad-dp-tools-sentence-annotation-output-v1')
CONSUMER_GROUP          = os.environ.get('ANUVAAD_ETL_SENTENCE_ANNOTATION_CONSUMER_GROUP_V1', 'anuvaad-etl-sentence-annotation-consumer-group-v1')
bootstrap_server        = os.environ.get('KAFKA_BOOTSTRAP_SERVER_HOST', 'localhost:9092')

TASK_STAT               = 'SENTENCE-ANNOTATION'

# mongodb
MONGO_DB_SCHEMA         = os.environ.get('MONGO_CH_DB', 'annotation')
MONGO_CONNECTION_URL    = os.environ.get('MONGO_CLUSTER_URL', 'mongodb://localhost:27017')