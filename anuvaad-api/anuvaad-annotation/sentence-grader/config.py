#import logging
import os
import time

DEBUG           = False
API_URL_PREFIX  = "/anuvaad-annotation/sentence-grader"
HOST            = '0.0.0.0'
PORT            = 5001
BASE_DIR        = 'upload'
download_folder = 'upload'
ENABLE_CORS     = False

# kafka
#
input_topic             = os.environ.get('KAFKA_ANUVAAD_DP_TOOLS_SENTENCE_GRADER_INPUT', 'anuvaad-dp-tools-sentence-grader-input-v1')
output_topic            = os.environ.get('KAFKA_ANUVAAD_DP_TOOLS_SENTENCE_GRADER_OUTPUT', 'anuvaad-dp-tools-sentence-grader-output-v1')
CONSUMER_GROUP          = os.environ.get('ANUVAAD_ETL_SENTENCE_GRADER_CONSUMER_GROUP_V1', 'anuvaad-etl-sentence-grader-consumer-group-v1')

bootstrap_server        = os.environ.get('KAFKA_BOOTSTRAP_SERVER_HOST', 'localhost:9092')

TASK_STAT               = 'SENTENCE-GRADER'

