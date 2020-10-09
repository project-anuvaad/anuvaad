import os

## Environment variables
IS_RUN_KAFKA = 'IS_RUN_KAFKA'
IS_RUN_KAFKA_DEFAULT_VALUE = False
bootstrap_server_boolean = os.environ.get(IS_RUN_KAFKA, IS_RUN_KAFKA_DEFAULT_VALUE)

KAFKA_IP_HOST = 'KAFKA_IP_HOST'
default_value = 'localhost:9092'
bootstrap_server = os.environ.get(KAFKA_IP_HOST, default_value)

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
    "consumer":os.environ.get('KAFKA_ANUVAAD_PDF_DEV_INPUT_TOPIC', nmt_input_topic_default),
    "producer":os.environ.get('KAFKA_ANUVAAD_PDF_DEV_OUTPUT_TOPIC', nmt_output_topic_default),
    "description":"Pdf dev environment translation"
  },
  {
    "consumer":os.environ.get('KAFKA_ANUVAAD_PDF_PROD_INPUT_TOPIC', nmt_input_topic_default),
    "producer":os.environ.get('KAFKA_ANUVAAD_PDF_PROD_OUTPUT_TOPIC', nmt_output_topic_default),
    "description":"Pdf production translation"
  },
  {
    "consumer":os.environ.get('KAFKA_ANUVAAD_WFM_DEV_INPUT_TOPIC', nmt_input_topic_default),
    "producer":os.environ.get('KAFKA_ANUVAAD_WFM_DEV_OUTPUT_TOPIC', nmt_output_topic_default),
    "description":"kafka topics for WFM Dev environment"
  },
  {
    "consumer":os.environ.get('KAFKA_ANUVAAD_WFM_PROD_INPUT_TOPIC', nmt_input_topic_default),
    "producer":os.environ.get('KAFKA_ANUVAAD_WFM_PROD_OUTPUT_TOPIC', nmt_output_topic_default),
    "description":"kafka topics for WFM Production environment"
  }
]

