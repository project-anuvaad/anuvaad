import os

## Environment variables
IS_RUN_KAFKA = 'IS_RUN_KAFKA'
IS_RUN_KAFKA_DEFAULT_VALUE = False
bootstrap_server_boolean = os.environ.get(IS_RUN_KAFKA, IS_RUN_KAFKA_DEFAULT_VALUE)

KAFKA_BOOTSTRAP_SERVER_HOST = 'KAFKA_BOOTSTRAP_SERVER_HOST'
default_value = 'localhost:9092'
bootstrap_server = os.environ.get(KAFKA_BOOTSTRAP_SERVER_HOST, default_value)

## "description":"Kafka topics and variables"
nmt_input_topic_default = "anuvaad-nmt-input-default"
nmt_output_topic_default = 'anuvaad-nmt-output-default'
group_id = 'anuvaad'

kafka_topic = [
  {
    "consumer":os.environ.get('KAFKA_ANUVAAD_DOC_INPUT_TOPIC', nmt_input_topic_default),
    "producer":os.environ.get('KAFKA_ANUVAAD_DOC_OUTPUT_TOPIC', nmt_output_topic_default),
    "description":"Document translation,also used in Suvas"
  },
  {
    "consumer":os.environ.get('KAFKA_ANUVAAD_PDF_INPUT_TOPIC', nmt_input_topic_default),
    "producer":os.environ.get('KAFKA_ANUVAAD_PDF_OUTPUT_TOPIC', nmt_output_topic_default),
    "description":"Pdf without WFM translation"
  },
  {
    "consumer":os.environ.get('KAFKA_ANUVAAD_WFM_INPUT_TOPIC', nmt_input_topic_default),
    "producer":os.environ.get('KAFKA_ANUVAAD_WFM_OUTPUT_TOPIC', nmt_output_topic_default),
    "description":"kafka topics with WFM"
  }
]

